import React, { useState } from 'react';
import {
  Swords,
  Play,
  RotateCcw,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Printer,
  Download,
  Shield,
  FileCheck,
  Check,
  XCircle,
  Lightbulb
} from 'lucide-react';
import { TabletopScenario, TabletopAttempt } from '../types';

interface TabletopSimulatorProps {
  scenarios: TabletopScenario[];
  attempts: TabletopAttempt[];
  onSaveAttempt: (attempt: TabletopAttempt) => void;
}

export const TabletopSimulator: React.FC<TabletopSimulatorProps> = ({
  scenarios,
  attempts,
  onSaveAttempt,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id || 'SIM-01');
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [revealedConsequence, setRevealedConsequence] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showFacilitatorNotes, setShowFacilitatorNotes] = useState(false);
  const [stageScores, setStageScores] = useState<{ [stageId: string]: { optionId: string; points: number } }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const scenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];
  const stage = scenario.stages[currentStageIdx];

  // Calculate cumulative score
  const totalScore = Object.values(stageScores).reduce((acc, curr) => acc + curr.points, 0);
  const maxScore = scenario.scoringRubric.maxPoints;
  const scorePercent = Math.round((totalScore / maxScore) * 100);

  // Determine Grade
  const currentThreshold = scenario.scoringRubric.thresholds.find(t => totalScore >= t.min) || scenario.scoringRubric.thresholds[scenario.scoringRubric.thresholds.length - 1];

  const handleSelectOption = (optionId: string) => {
    if (revealedConsequence) return; // Prevent changing after revealing
    setSelectedOptionId(optionId);
  };

  const handleConfirmDecision = () => {
    if (!selectedOptionId || !stage) return;
    const option = stage.options.find(o => o.id === selectedOptionId);
    if (!option) return;

    setStageScores(prev => ({
      ...prev,
      [stage.id]: { optionId: option.id, points: option.points }
    }));
    setRevealedConsequence(true);
  };

  const handleNextStage = () => {
    if (currentStageIdx < scenario.stages.length - 1) {
      setCurrentStageIdx(prev => prev + 1);
      setSelectedOptionId(null);
      setRevealedConsequence(false);
      setShowHint(false);
    } else {
      // Completed drill!
      setIsCompleted(true);
      onSaveAttempt({
        scenarioId: scenario.id,
        currentStageIndex: scenario.stages.length,
        selectedOptions: Object.entries(stageScores).map(([stageId, data]) => ({
          stageId,
          optionId: data.optionId,
          points: data.points
        })),
        totalScore,
        isFinished: true,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        notes: `Achieved ${totalScore}/${maxScore} (${scorePercent}%) - ${currentThreshold.grade}`
      });
    }
  };

  const handleRestart = () => {
    setCurrentStageIdx(0);
    setSelectedOptionId(null);
    setRevealedConsequence(false);
    setShowHint(false);
    setStageScores({});
    setIsCompleted(false);
  };

  const handlePrintAAR = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              SIMULATION LAB
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Decision & Consequence Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tabletop Readiness Exercise Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Test incident triage, containment speed, and communication under simulated cyber attacks.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowFacilitatorNotes(!showFacilitatorNotes)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            {showFacilitatorNotes ? <EyeOff className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{showFacilitatorNotes ? 'Hide Facilitator Guide' : 'Facilitator Guide'}</span>
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Restart Drill
          </button>
        </div>
      </div>

      {/* Scenario Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((sc, idx) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <div
              key={sc.id}
              onClick={() => {
                setSelectedScenarioId(sc.id);
                handleRestart();
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#181b33] border-amber-500/70 shadow-glow-amber'
                  : 'bg-[#0e1629] border-[#1e2f52] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-cyan-400 font-bold">{sc.id}</span>
                <span className="text-[10px] text-slate-400 font-mono">{sc.estimatedDuration}</span>
              </div>
              <h3 className="text-xs font-bold text-white truncate mb-1">{sc.title}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {sc.summary}
              </p>
            </div>
          );
        })}
      </div>

      {/* Facilitator Notes Callout */}
      {showFacilitatorNotes && (
        <div className="bg-[#12182c] border border-cyan-800/60 rounded-2xl p-5 text-xs text-slate-300 space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-cyan-300">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Facilitator-Only Briefing & Exercise Objectives</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            {scenario.facilitatorOverview}
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <strong>Target Audience:</strong> {scenario.targetAudience} • <strong>Grading Standard:</strong> NIST SP 800-61 Rev. 3
          </div>
        </div>
      )}

      {/* Main Simulation View or Completed After-Action Report */}
      {!isCompleted ? (
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-xl space-y-6">
          {/* Progress & Stage Indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                STAGE {stage.stageNumber} OF {scenario.stages.length} • {stage.timestamp}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {stage.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-1.5 text-right font-mono">
                <span className="text-[9px] uppercase text-slate-500 block">Current Score</span>
                <span className="text-base font-bold text-amber-400">{totalScore} / {maxScore}</span>
              </div>
            </div>
          </div>

          {/* Attack Inject Box */}
          <div className="p-4 rounded-xl bg-[#090e1c] border border-cyan-900/50 space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              SIMULATED EVENT INJECT
            </span>
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              {stage.inject}
            </p>
          </div>

          {/* Expected Actions & Discussion Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1.5">
              <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block">
                Expected NIST Actions:
              </span>
              <ul className="space-y-1 list-disc pl-4 text-slate-300">
                {stage.expectedActions.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1.5">
              <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block">
                Discussion Questions for Team:
              </span>
              <ul className="space-y-1 list-disc pl-4 text-slate-300">
                {stage.discussionQuestions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Multiple Choice Dilemma Options */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Response Action for Stage {stage.stageNumber}:
            </h3>

            <div className="space-y-3">
              {stage.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;

                let borderStyle = 'border-slate-800 hover:border-slate-700 bg-[#090e1c]';
                if (isSelected) {
                  borderStyle = 'border-cyan-500 bg-cyan-950/20 shadow-glow-cyan';
                }
                if (revealedConsequence && isSelected) {
                  borderStyle =
                    opt.feedbackType === 'optimal'
                      ? 'border-emerald-500 bg-emerald-950/20 shadow-glow-green'
                      : opt.feedbackType === 'acceptable'
                      ? 'border-amber-500 bg-amber-950/20'
                      : 'border-red-500 bg-red-950/20 shadow-glow-red';
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${borderStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                          {opt.text}
                        </p>

                        {/* Revealed Consequence & Feedback */}
                        {revealedConsequence && isSelected && (
                          <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 animate-fadeIn">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                                  opt.feedbackType === 'optimal'
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                    : opt.feedbackType === 'acceptable'
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                    : 'bg-red-500/20 text-red-400 border-red-500/40'
                                }`}
                              >
                                {opt.feedbackType} (+{opt.points} pts)
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                              {opt.consequences}
                            </p>

                            <p className="text-[11px] text-slate-400 italic">
                              Rationale: {opt.rationale}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hint Drawer */}
          {showHint && (
            <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-800/40 text-xs text-violet-300 flex items-start gap-2.5 animate-fadeIn">
              <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-violet-400" />
              <div>
                <strong>Readiness Hint:</strong> {stage.hint}
              </div>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Request Hint'}</span>
            </button>

            {!revealedConsequence ? (
              <button
                disabled={!selectedOptionId}
                onClick={handleConfirmDecision}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Decision
              </button>
            ) : (
              <button
                onClick={handleNextStage}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-glow-green transition-all flex items-center gap-1.5"
              >
                <span>{currentStageIdx < scenario.stages.length - 1 ? 'Advance to Next Stage' : 'View After-Action Report'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* AFTER-ACTION REPORT (AAR) VIEW */
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 printable-area">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                  AAR COMPLETED
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {scenario.id} Simulation
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">
                Tabletop After-Action Report (AAR)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Northstar Learning Labs • Exercise Evaluation & Improvement Plan
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintAAR}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" /> Print AAR
              </button>
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-glow-cyan"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Drill
              </button>
            </div>
          </div>

          {/* Scorecard Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#090e1c] border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Points</span>
              <div className="text-3xl font-black text-white mt-1">
                {totalScore} <span className="text-sm font-normal text-slate-400">/ {maxScore}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090e1c] border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Readiness Grade</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {currentThreshold.grade}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090e1c] border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Designation</span>
              <div className="text-lg font-bold text-cyan-300 mt-1 truncate">
                {currentThreshold.title}
              </div>
            </div>
          </div>

          {/* Assessment Summary */}
          <div className="p-5 rounded-2xl bg-[#090e1c] border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Evaluator Assessment
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {currentThreshold.assessment}
            </p>
          </div>

          {/* Recommendations */}
          <div className="p-5 rounded-2xl bg-[#090e1c] border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Prescribed Defensive Improvements
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              {currentThreshold.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
