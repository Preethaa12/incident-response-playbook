import React, { useState } from 'react';
import {
  BookOpen,
  Laptop,
  Bug,
  KeyRound,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Check,
  Info
} from 'lucide-react';
import { Playbook, PlaybookStep } from '../types';

interface PlaybookLibraryProps {
  playbooks: Playbook[];
  onToggleStep: (playbookId: string, stepId: string, notes?: string) => void;
  onResetPlaybook: (playbookId: string) => void;
}

export const PlaybookLibrary: React.FC<PlaybookLibraryProps> = ({
  playbooks,
  onToggleStep,
  onResetPlaybook,
}) => {
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(playbooks[0]?.id || 'PB-01');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    steps: true,
    decisions: true,
    evidence: true,
    escalation: false,
    closure: false
  });

  const currentPlaybook = playbooks.find(p => p.id === selectedPlaybookId) || playbooks[0];

  const completedSteps = currentPlaybook.steps.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedSteps / Math.max(1, currentPlaybook.steps.length)) * 100);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentPlaybook, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${currentPlaybook.id}_playbook_sop.json`);
    dlAnchor.click();
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              OPERATIONAL PROCEDURES (SOP)
            </span>
            <span className="text-xs text-slate-400 font-mono">
              NIST SP 800-61 Rev. 3 Aligned
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Incident Response Playbook Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Step-by-step interactive response workflows with decision gates and role accountability.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onResetPlaybook(currentPlaybook.id)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            title="Reset Step Progress"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset SOP
          </button>
          <button
            onClick={handleExportJSON}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" /> Export SOP
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print Playbook
          </button>
        </div>
      </div>

      {/* Playbook Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {playbooks.map((pb) => {
          const isSelected = pb.id === selectedPlaybookId;
          const completedCount = pb.steps.filter(s => s.isCompleted).length;
          const pct = Math.round((completedCount / pb.steps.length) * 100);

          let Icon = Laptop;
          if (pb.category === 'Malware Alert') Icon = Bug;
          if (pb.category === 'Account Takeover') Icon = KeyRound;

          return (
            <div
              key={pb.id}
              onClick={() => setSelectedPlaybookId(pb.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#111c35] border-cyan-500/80 shadow-glow-cyan'
                  : 'bg-[#0e1629] border-[#1e2f52] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                      {pb.id}
                    </span>
                    <h3 className="text-xs font-bold text-white truncate max-w-[170px]">
                      {pb.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-cyan-300">
                  {pct}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2">
                <span>{completedCount} / {pb.steps.length} Steps</span>
                <span>{pb.steps.filter(s => s.procedureType === 'approval_required').length} Approval Gates</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Playbook Content */}
      <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-xl space-y-6 printable-area">
        {/* Playbook Header & Scope */}
        <div className="pb-6 border-b border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                  {currentPlaybook.id}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Category: {currentPlaybook.category}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {currentPlaybook.title}
              </h2>
            </div>

            <div className="bg-[#080d1a] border border-slate-800 rounded-xl px-4 py-2.5 text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Execution Progress</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{progressPercent}%</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
            {currentPlaybook.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#090e1c] border border-slate-800 space-y-1">
              <strong className="text-cyan-300 font-mono text-[11px] block uppercase">Purpose:</strong>
              <p className="text-slate-300 leading-relaxed">{currentPlaybook.purpose}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#090e1c] border border-slate-800 space-y-1">
              <strong className="text-cyan-300 font-mono text-[11px] block uppercase">Scope & Applicability:</strong>
              <p className="text-slate-300 leading-relaxed">{currentPlaybook.scope}</p>
            </div>
          </div>
        </div>

        {/* Section 1: Response Steps with Checkboxes */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('steps')}
            className="w-full flex items-center justify-between py-2 text-left font-bold text-sm text-white hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Response Steps Checklist ({completedSteps}/{currentPlaybook.steps.length})</span>
            </span>
            {expandedSections.steps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.steps && (
            <div className="space-y-3 pt-1">
              {currentPlaybook.steps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => onToggleStep(currentPlaybook.id, step.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    step.isCompleted
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                      : step.procedureType === 'approval_required'
                      ? 'bg-[#12162a] border-amber-500/40 hover:border-amber-500 text-slate-200'
                      : 'bg-[#090e1c] border-slate-800 hover:border-cyan-500/50 text-slate-200'
                  }`}
                >
                  <div className="pt-0.5 flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        step.isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      {step.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-cyan-400">
                          Step {step.stepNumber}:
                        </span>
                        <span className={`text-xs font-bold ${step.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {step.title}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {step.phase}
                        </span>
                      </div>

                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border self-start sm:self-auto ${
                          step.procedureType === 'approval_required'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {step.procedureType === 'approval_required' ? 'Commander Approval Required' : 'General Procedure'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.description}
                    </p>

                    {step.isCompleted && step.completedAt && (
                      <div className="text-[10px] font-mono text-emerald-400 pt-1">
                        ✓ Completed on {new Date(step.completedAt).toLocaleString()} by {step.completedBy}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Decision Points */}
        {currentPlaybook.decisionPoints.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => toggleSection('decisions')}
              className="w-full flex items-center justify-between py-2 text-left font-bold text-sm text-white hover:text-cyan-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Decision Points & Branching Conditions ({currentPlaybook.decisionPoints.length})</span>
              </span>
              {expandedSections.decisions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSections.decisions && (
              <div className="space-y-3">
                {currentPlaybook.decisionPoints.map((dp) => (
                  <div key={dp.id} className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                      <span className="text-amber-400 font-mono font-bold">GATE:</span> {dp.question}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {dp.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${
                            opt.escalate
                              ? 'bg-red-950/20 border-red-500/40 text-red-200'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="font-bold mb-1 flex items-center gap-1.5">
                            <span className="font-mono text-cyan-400">Path {idx + 1}:</span> {opt.label}
                          </div>
                          <div className="text-[11px] text-slate-400 mb-1.5">{opt.action}</div>
                          <div className="text-[10px] font-mono text-cyan-300">
                            Recommendation: {opt.recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 3: Evidence Checklist */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => toggleSection('evidence')}
            className="w-full flex items-center justify-between py-2 text-left font-bold text-sm text-white hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Required Evidence Artifacts</span>
            </span>
            {expandedSections.evidence ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.evidence && (
            <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800">
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
                {currentPlaybook.evidenceChecklist.map((ev, idx) => (
                  <li key={idx}>{ev}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section 4: Escalation & Closure Criteria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Mandatory Escalation Triggers
            </h4>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              {currentPlaybook.escalationConditions.map((cond, idx) => (
                <li key={idx}>{cond}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Incident Closure Criteria
            </h4>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              {currentPlaybook.closureCriteria.map((crit, idx) => (
                <li key={idx}>{crit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
