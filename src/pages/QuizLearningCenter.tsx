import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Award,
  BookOpen,
  Sparkles,
  Check,
  Building2
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/seedData';

export const QuizLearningCenter: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestionIdx];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [question.id]: optIdx }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setIsSubmitted(false);
  };

  // Score calculation
  let correctCount = 0;
  QUIZ_QUESTIONS.forEach(q => {
    if (selectedAnswers[q.id] === q.correctAnswerIndex) {
      correctCount++;
    }
  });

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              EDUCATIONAL KNOWLEDGE ASSESSMENT
            </span>
            <span className="text-xs text-slate-400 font-mono">
              10 Practical IR Questions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Incident Response Quiz & Learning Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Evaluate your knowledge of NIST SP 800-61 lifecycle, host containment, volatile RAM preservation, and ethical AI.
          </p>
        </div>

        <button
          onClick={handleRetake}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset Quiz
        </button>
      </div>

      {!isSubmitted ? (
        /* Active Question View */
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold">
                QUESTION {currentQuestionIdx + 1} OF {totalQuestions}
              </span>
              <span className="text-slate-400">
                {Object.keys(selectedAnswers).length} Answered
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1.5 pt-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              Domain: {question.category}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed pt-1">
              {question.question}
            </h2>
          </div>

          {/* 4 Answer Options */}
          <div className="space-y-3 pt-2">
            {question.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[question.id] === optIdx;

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500 text-white shadow-glow-cyan'
                      : 'bg-[#090e1c] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="pt-0.5 flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[11px] font-bold ${
                        isSelected
                          ? 'bg-cyan-400 border-cyan-400 text-black'
                          : 'border-slate-600 bg-slate-800 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed flex-1">
                    {opt}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              disabled={currentQuestionIdx === 0}
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {currentQuestionIdx < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-glow-cyan"
              >
                Next Question <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length < totalQuestions}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-glow-green disabled:opacity-50"
              >
                <Award className="w-4 h-4" /> Submit Quiz for Evaluation
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Answer Key View */
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 max-w-4xl mx-auto">
          {/* Result Banner */}
          <div className="text-center space-y-3 pb-6 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-glow-cyan">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                Assessment Results
              </span>
              <h2 className="text-3xl font-black text-white">
                You Scored {scorePercent}% ({correctCount} / {totalQuestions})
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                {scorePercent >= 80
                  ? 'Outstanding readiness! You demonstrated a comprehensive understanding of NIST incident response standards and responsible AI use.'
                  : scorePercent >= 60
                  ? 'Good foundation! Review the detailed explanations below to strengthen your understanding of memory preservation and containment gates.'
                  : 'Needs improvement. We recommend reviewing Playbooks PB-01, PB-02, and PB-03.'}
              </p>
            </div>

            <button
              onClick={handleRetake}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-glow-cyan"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
            </button>
          </div>

          {/* Answer Key Review with Explanations */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> Answer Key & Educational Explanations
            </h3>

            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const userAnswer = selectedAnswers[q.id];
                const isCorrect = userAnswer === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border ${
                      isCorrect
                        ? 'bg-[#0a1424] border-emerald-500/40'
                        : 'bg-[#180f1e] border-red-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          Question {idx + 1} • {q.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {q.question}
                        </h4>
                      </div>

                      <span
                        className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-red-500/20 text-red-400 border-red-500/40'
                        }`}
                      >
                        {isCorrect ? 'Correct (+10)' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 pt-2">
                      <div className="text-emerald-400 font-medium">
                        ✓ Correct Answer: {q.options[q.correctAnswerIndex]}
                      </div>
                      {!isCorrect && userAnswer !== undefined && (
                        <div className="text-red-400">
                          ✗ Your Selected Answer: {q.options[userAnswer]}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-300 leading-relaxed bg-black/30 p-2.5 rounded-lg">
                      <strong className="text-cyan-300">Explanation: </strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
