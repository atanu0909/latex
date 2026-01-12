'use client';

import { useState } from 'react';

interface QuestionConfig {
  subject: string;
  className: string;
  questionTypes: string[];
  difficulty: string;
  customInstructions?: string;
  questionsByType?: {
    mcq: number;
    fillInBlanks: number;
    trueFalse: number;
    general: number;
  };
  questionsByMarks?: {
    '2': number;
    '3': number;
    '4': number;
    '5': number;
    '6': number;
    '10': number;
  };
}

interface Props {
  config: QuestionConfig;
  onConfigChange: (config: QuestionConfig) => void;
}

const SUBJECTS = [
  { value: 'mathematics', label: '📐 Mathematics' },
  { value: 'physics', label: '⚛️ Physics' },
  { value: 'chemistry', label: '🧪 Chemistry' },
  { value: 'biology', label: '🧬 Biology' },
  { value: 'computer-science', label: '💻 Computer Science' },
  { value: 'statistics', label: '📊 Statistics' },
  { value: 'engineering', label: '⚙️ Engineering' },
  { value: 'economics', label: '💰 Economics' },
];

const CLASSES = [
  { value: 'class-1', label: '🎒 Class 1' },
  { value: 'class-2', label: '🎒 Class 2' },
  { value: 'class-3', label: '🎒 Class 3' },
  { value: 'class-4', label: '🎒 Class 4' },
  { value: 'class-5', label: '🎒 Class 5' },
  { value: 'class-6', label: '📚 Class 6' },
  { value: 'class-7', label: '📚 Class 7' },
  { value: 'class-8', label: '📚 Class 8' },
  { value: 'class-9', label: '📚 Class 9' },
  { value: 'class-10', label: '📚 Class 10' },
  { value: 'class-11', label: '🎓 Class 11' },
  { value: 'class-12', label: '🎓 Class 12' },
  { value: 'undergraduate', label: '🎓 Undergraduate' },
  { value: 'graduate', label: '🎓 Graduate/Masters' },
  { value: 'phd', label: '👨‍🔬 PhD/Research' },
];

const QUESTION_TYPES = [
  { value: 'problem-solving', label: 'Problem Solving' },
  { value: 'conceptual', label: 'Conceptual Understanding' },
  { value: 'application', label: 'Real-world Application' },
  { value: 'proof-based', label: 'Proof & Derivation' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false', label: 'True/False' },
];

const DIFFICULTIES = [
  { value: 'easy', label: '🟢 Easy' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'hard', label: '🔴 Hard' },
  { value: 'mixed', label: '🎯 Mixed' },
];

export default function QuestionCustomizer({ config, onConfigChange }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onConfigChange({ ...config, subject: e.target.value });
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onConfigChange({ ...config, className: e.target.value });
  };

  const handleQuestionTypeToggle = (type: string) => {
    const types = config.questionTypes.includes(type)
      ? config.questionTypes.filter(t => t !== type)
      : [...config.questionTypes, type];
    
    if (types.length > 0) {
      onConfigChange({ ...config, questionTypes: types });
    }
  };

  const handleDifficultyChange = (difficulty: string) => {
    onConfigChange({ ...config, difficulty });
  };

  const handleCustomInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onConfigChange({ ...config, customInstructions: e.target.value });
  };

  const handleQuestionTypeCountChange = (type: keyof NonNullable<QuestionConfig['questionsByType']>, delta: number) => {
    const current = config.questionsByType || { mcq: 0, fillInBlanks: 0, trueFalse: 0, general: 0 };
    const newValue = Math.max(0, (current[type] || 0) + delta);
    onConfigChange({
      ...config,
      questionsByType: { ...current, [type]: newValue }
    });
  };

  const handleQuestionMarkCountChange = (marks: keyof NonNullable<QuestionConfig['questionsByMarks']>, delta: number) => {
    const current = config.questionsByMarks || { '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '10': 0 };
    const newValue = Math.max(0, (current[marks] || 0) + delta);
    onConfigChange({
      ...config,
      questionsByMarks: { ...current, [marks]: newValue }
    });
  };

  const getTotalQuestionsByType = () => {
    const types = config.questionsByType || { mcq: 0, fillInBlanks: 0, trueFalse: 0, general: 0 };
    return types.mcq + types.fillInBlanks + types.trueFalse + types.general;
  };

  const getTotalQuestionsByMarks = () => {
    const marks = config.questionsByMarks || { '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '10': 0 };
    return marks['2'] + marks['3'] + marks['4'] + marks['5'] + marks['6'] + marks['10'];
  };

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl mb-8 overflow-hidden border-2 border-purple-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-8 py-6 flex justify-between items-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all"
      >
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">⚙️</span>
          <span>Customize Your Questions</span>
        </h2>
        <span className="text-3xl text-white transform transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="p-8 space-y-6">
          {/* Class and Subject Selection - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                <span>Select Your Class/Level</span>
              </label>
              <select
                value={config.className}
                onChange={handleClassChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-lg bg-white shadow-sm"
              >
                {CLASSES.map(cls => (
                  <option key={cls.value} value={cls.value}>
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <span>Select Subject</span>
              </label>
              <select
                value={config.subject}
                onChange={handleSubjectChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-lg bg-white shadow-sm"
              >
                {SUBJECTS.map(subject => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Types */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <span>Question Types (select at least one)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {QUESTION_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => handleQuestionTypeToggle(type.value)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    config.questionTypes.includes(type.value)
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>Difficulty Level</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff.value}
                  onClick={() => handleDifficultyChange(diff.value)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    config.difficulty === diff.value
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instructions */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <span>Custom Instructions (Optional) ⭐</span>
            </label>
            <textarea
              value={config.customInstructions || ''}
              onChange={handleCustomInstructionsChange}
              placeholder="Examples: • Focus on Chapter 3: Photosynthesis only • Include more questions on chemical equations • Make difficulty level: moderate to hard • Focus on topics: cell structure, DNA replication • Include real-world application questions"
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-400 transition-all text-sm min-h-[100px] resize-y shadow-sm hover:shadow-md bg-white"
              rows={4}
            />
            <p className="mt-2 text-sm text-yellow-700 flex items-start gap-2">
              <span>💡</span>
              <span><strong>Smart Tips:</strong> Be specific about chapters, topics, difficulty level, or question style. These instructions take highest priority during generation.</span>
            </p>
          </div>

          {/* 1 Mark Questions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-300 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <span>1 Mark Questions <span className="text-blue-600">(Total: {getTotalQuestionsByType()})</span></span>
            </h3>
            <div className="space-y-3">
              {[
                { key: 'mcq' as const, label: 'Multiple Choice (MCQ)', icon: '🔤' },
                { key: 'fillInBlanks' as const, label: 'Fill in the Blanks', icon: '📝' },
                { key: 'trueFalse' as const, label: 'True or False', icon: '✓✗' },
                { key: 'general' as const, label: 'General Questions', icon: '❓' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuestionTypeCountChange(item.key, -1)}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 transition-all transform hover:scale-110"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-gray-800">
                      {config.questionsByType?.[item.key] || 0}
                    </span>
                    <button
                      onClick={() => handleQuestionTypeCountChange(item.key, 1)}
                      className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg font-bold text-white transition-all transform hover:scale-110 shadow-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Questions by Marks */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-300 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎖️</span>
              <span>Questions by Marks <span className="text-purple-600">(Total: {getTotalQuestionsByMarks()})</span></span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: '2' as const, label: '2 Marks', icon: '②' },
                { key: '3' as const, label: '3 Marks', icon: '③' },
                { key: '4' as const, label: '4 Marks', icon: '④' },
                { key: '5' as const, label: '5 Marks', icon: '⑤' },
                { key: '6' as const, label: '6 Marks', icon: '⑥' },
                { key: '10' as const, label: '10 Marks', icon: '⑩' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuestionMarkCountChange(item.key, -1)}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 transition-all transform hover:scale-110"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-gray-800">
                      {config.questionsByMarks?.[item.key] || 0}
                    </span>
                    <button
                      onClick={() => handleQuestionMarkCountChange(item.key, 1)}
                      className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-white transition-all transform hover:scale-110 shadow-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl border-2 border-purple-300 shadow-lg">
            <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>Configuration Summary</span>
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-lg">🎓</span>
                <span>Class/Level: <span className="font-semibold text-purple-700">{CLASSES.find(c => c.value === config.className)?.label}</span></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                <span>Subject: <span className="font-semibold text-purple-700">{SUBJECTS.find(s => s.value === config.subject)?.label}</span></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <span>Total 1 Mark Questions: <span className="font-semibold text-blue-700">{getTotalQuestionsByType()}</span></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">🎖️</span>
                <span>Total Questions by Marks: <span className="font-semibold text-purple-700">{getTotalQuestionsByMarks()}</span></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">📝</span>
                <span>Question Types: <span className="font-semibold text-purple-700">{config.questionTypes.map(t => QUESTION_TYPES.find(qt => qt.value === t)?.label).join(', ') || 'None'}</span></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <span>Difficulty: <span className="font-semibold text-purple-700">{DIFFICULTIES.find(d => d.value === config.difficulty)?.label}</span></span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
