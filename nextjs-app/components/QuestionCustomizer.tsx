'use client';

import { useState } from 'react';

interface QuestionConfig {
  subject: string;
  numQuestions: number;
  questionTypes: string[];
  difficulty: string;
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

  const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    onConfigChange({ ...config, numQuestions: Math.min(50, Math.max(1, value)) });
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

  return (
    <div className="bg-white rounded-2xl shadow-2xl mb-8 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-8 py-6 flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-colors"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          ⚙️ Customize Questions
        </h2>
        <span className="text-3xl transform transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="p-8 space-y-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              📚 Subject
            </label>
            <select
              value={config.subject}
              onChange={handleSubjectChange}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-lg"
            >
              {SUBJECTS.map(subject => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              🔢 Number of Questions: <span className="text-purple-600">{config.numQuestions}</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="50"
                value={config.numQuestions}
                onChange={handleNumQuestionsChange}
                className="flex-1 h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                min="1"
                max="50"
                value={config.numQuestions}
                onChange={handleNumQuestionsChange}
                className="w-20 px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 text-center"
              />
            </div>
          </div>

          {/* Question Types */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              📝 Question Types (select at least one)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {QUESTION_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => handleQuestionTypeToggle(type.value)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    config.questionTypes.includes(type.value)
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
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
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              🎯 Difficulty Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff.value}
                  onClick={() => handleDifficultyChange(diff.value)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    config.difficulty === diff.value
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <h3 className="font-semibold text-gray-700 mb-2">📋 Configuration Summary:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Subject: <span className="font-medium">{SUBJECTS.find(s => s.value === config.subject)?.label}</span></li>
              <li>• Number of Questions: <span className="font-medium">{config.numQuestions}</span></li>
              <li>• Question Types: <span className="font-medium">{config.questionTypes.map(t => QUESTION_TYPES.find(qt => qt.value === t)?.label).join(', ')}</span></li>
              <li>• Difficulty: <span className="font-medium">{DIFFICULTIES.find(d => d.value === config.difficulty)?.label}</span></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
