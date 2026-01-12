import os
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
from google import genai
from google.genai import types
import PyPDF2
from io import BytesIO
import markdown
from datetime import datetime
import subprocess
import tempfile
import shutil

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'pdf'}

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Configure Gemini API
client = genai.Client(api_key=os.environ.get('GEMINI_API_KEY'))

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def extract_text_from_pdf(pdf_file):
    """Extract text from PDF file"""
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    return text

def generate_questions_with_gemini(pdf_text):
    """Generate math questions from PDF text using Gemini"""
    
    prompt = f"""
    You are a mathematics expert. Based on the following educational content, generate comprehensive math questions with solutions.
    
    Content:
    {pdf_text}
    
    Please generate 10 high-quality math questions based on this content. For each question:
    1. Create a clear, well-formatted question
    2. Provide a detailed solution with step-by-step explanation
    3. Use proper LaTeX notation for all mathematical expressions
    
    Format your response ENTIRELY in LaTeX. Use the following structure:
    
    \\documentclass{{article}}
    \\usepackage{{amsmath}}
    \\usepackage{{amssymb}}
    \\usepackage{{geometry}}
    \\geometry{{margin=1in}}
    
    \\title{{Generated Math Questions}}
    \\author{{AI Question Generator}}
    \\date{{\\today}}
    
    \\begin{{document}}
    \\maketitle
    
    \\section*{{Question 1}}
    [Question text with $\\LaTeX$ math]
    
    \\subsection*{{Solution}}
    [Detailed solution with $$equations$$]
    
    [Continue for all questions...]
    
    \\end{{document}}
    
    Make sure ALL mathematical expressions are in LaTeX format (use $...$ for inline and $$...$$ or \\[...\\] for display math).
    """
    
    response = client.models.generate_content(
        model='gemini-2.0-flash-exp',
        contents=prompt
    )
    return response.text

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Only PDF files are allowed'}), 400
    
    try:
        # Extract text from PDF
        pdf_text = extract_text_from_pdf(file)
        
        if not pdf_text.strip():
            return jsonify({'error': 'Could not extract text from PDF'}), 400
        
        # Generate questions using Gemini
        latex_content = generate_questions_with_gemini(pdf_text)
        
        return jsonify({
            'success': True,
            'latex': latex_content
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download', methods=['POST'])
def download_latex():
    """Download the generated LaTeX file"""
    data = request.json
    latex_content = data.get('latex', '')
    
    if not latex_content:
        return jsonify({'error': 'No LaTeX content provided'}), 400
    
    # Create a file-like object
    buffer = BytesIO()
    buffer.write(latex_content.encode('utf-8'))
    buffer.seek(0)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'math_questions_{timestamp}.tex'
    
    return send_file(
        buffer,
        as_attachment=True,
        download_name=filename,
        mimetype='text/plain'
    )

@app.route('/download-pdf', methods=['POST'])
def download_pdf():
    """Download the generated questions as PDF by compiling LaTeX"""
    data = request.json
    latex_content = data.get('latex', '')
    
    if not latex_content:
        return jsonify({'error': 'No LaTeX content provided'}), 400
    
    # Create a temporary directory
    temp_dir = tempfile.mkdtemp()
    
    try:
        # Write LaTeX content to a file
        tex_file = os.path.join(temp_dir, 'questions.tex')
        with open(tex_file, 'w', encoding='utf-8') as f:
            f.write(latex_content)
        
        # Check if pdflatex is available
        try:
            # Compile LaTeX to PDF using pdflatex
            result = subprocess.run(
                ['pdflatex', '-interaction=nonstopmode', '-output-directory', temp_dir, tex_file],
                capture_output=True,
                timeout=30
            )
            
            pdf_file = os.path.join(temp_dir, 'questions.pdf')
            
            if not os.path.exists(pdf_file):
                # If pdflatex failed, return error with log
                log_file = os.path.join(temp_dir, 'questions.log')
                error_msg = "LaTeX compilation failed."
                if os.path.exists(log_file):
                    with open(log_file, 'r') as f:
                        log_content = f.read()
                        # Extract the error from log
                        if '!' in log_content:
                            error_lines = [line for line in log_content.split('\n') if line.startswith('!')]
                            if error_lines:
                                error_msg = error_lines[0]
                raise Exception(error_msg)
            
            # Read the PDF file
            with open(pdf_file, 'rb') as f:
                pdf_data = f.read()
            
            pdf_buffer = BytesIO(pdf_data)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'math_questions_{timestamp}.pdf'
            
            return send_file(
                pdf_buffer,
                as_attachment=True,
                download_name=filename,
                mimetype='application/pdf'
            )
            
        except FileNotFoundError:
            return jsonify({
                'error': 'PDF compilation not available. pdflatex is not installed. Please download the LaTeX file instead and compile it locally.'
            }), 500
        except subprocess.TimeoutExpired:
            return jsonify({'error': 'PDF compilation timed out'}), 500
            
    except Exception as e:
        return jsonify({'error': f'PDF generation failed: {str(e)}'}), 500
    finally:
        # Clean up temporary directory
        shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
