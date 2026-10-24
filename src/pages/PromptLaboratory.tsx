import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Play,
  RotateCcw,
  Edit2,
  Save,
  ShieldCheck,
  AlertTriangle,
  History,
  Bot,
  ExternalLink,
  Info
} from 'lucide-react';
import { PromptTemplate } from '../types';

interface PromptLaboratoryProps {
  prompts: PromptTemplate[];
  onSavePrompt: (prompt: PromptTemplate) => void;
}

export const PromptLaboratory: React.FC<PromptLaboratoryProps> = ({ prompts, onSavePrompt }) => {
  const [selectedPromptId, setSelectedPromptId] = useState<string>(prompts[0]?.id || 'PRMPT-01');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentPrompt = prompts.find(p => p.id === selectedPromptId) || prompts[0];

  const [editPromptText, setEditPromptText] = useState(currentPrompt.promptText);
  const [editConstraints, setEditConstraints] = useState(currentPrompt.safetyConstraints);

  const handleSelectPrompt = (id: string) => {
    setSelectedPromptId(id);
    const p = prompts.find(item => item.id === id);
    if (p) {
      setEditPromptText(p.promptText);
      setEditConstraints(p.safetyConstraints);
      setIsEditing(false);
      setTestOutput(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const updatedHistory = [
      ...currentPrompt.versionHistory,
      {
        version: `v1.${currentPrompt.versionHistory.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        change: 'Updated prompt text and safety constraints via laboratory editor.'
      }
    ];

    onSavePrompt({
      ...currentPrompt,
      promptText: editPromptText,
      safetyConstraints: editConstraints,
      versionHistory: updatedHistory
    });

    setIsEditing(false);
  };

  const handleRunTest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      if (currentPrompt.category === 'Triage') {
        setTestOutput(JSON.stringify({
          summary: "Confirmed Ransomware-like dropper attempting shadow copy deletion on student workstation.",
          recommendedSeverity: "Critical",
          severityRationale: "Immediate file destruction risk across mapped SMB volumes.",
          currentPhase: "CONTAIN",
          immediateActions: [
            "Trigger EDR network host isolation (Do NOT power down)",
            "Block outbound C2 IP 185.220.101.5 on gateway firewall",
            "Collect volatile memory triage package"
          ],
          escalationRequired: true,
          safetyWarning: "HUMAN SIGN-OFF MANDATORY prior to workstation partition wipe."
        }, null, 2));
      } else {
        setTestOutput(`[SIMULATED EXECUTION RESULT - ENGINE VERIFIED]
Prompt: ${currentPrompt.name}
Output Format: ${currentPrompt.expectedOutputFormat}
Safety Audit: Passed 0 critical violations.
All recommended containment actions mapped to NIST SP 800-61 Rev. 3 standard.`);
      }
    }, 700);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30">
              PROMPT ENGINEERING & SAFETY
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Version-Controlled IR Prompts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Prompt Laboratory & Evaluation Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            System prompts, safety constraints, expected schemas, and observed limitations.
          </p>
        </div>
      </div>

      {/* Prompt Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {prompts.map((p) => {
          const isSelected = p.id === selectedPromptId;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPrompt(p.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#141530] border-violet-500 text-white shadow-glow-violet'
                  : 'bg-[#0e1629] border-[#1e2f52] text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-violet-400 font-bold">{p.id}</span>
                <span className="text-slate-500">{p.category}</span>
              </div>
              <div className="text-xs font-bold truncate text-white">{p.name}</div>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Layout (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata & Constraints (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white tracking-wide">
                Prompt Specifications
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {currentPrompt.testStatus}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-mono text-[10px] uppercase text-slate-500 block">Objective</span>
              <p className="text-slate-200 leading-relaxed">{currentPrompt.objective}</p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-mono text-[10px] uppercase text-slate-500 block">Expected Output Format</span>
              <p className="text-slate-300 font-mono text-[11px] bg-[#080d1a] p-2.5 rounded-lg border border-slate-800">
                {currentPrompt.expectedOutputFormat}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-300">
                <ShieldCheck className="w-3.5 h-3.5" /> Enforced Safety Constraints:
              </span>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {currentPrompt.safetyConstraints}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-mono text-[10px] uppercase text-slate-500 block">Observed Model Limitations</span>
              <p className="text-slate-400 leading-relaxed">{currentPrompt.observedLimitations}</p>
            </div>

            {/* Version History */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-cyan-400" /> Version History
              </span>
              <div className="space-y-1.5">
                {currentPrompt.versionHistory.map((vh, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#080d1a] border border-slate-800 text-[11px]">
                    <div className="flex items-center justify-between text-cyan-400 font-mono text-[10px]">
                      <span>{vh.version}</span>
                      <span>{vh.date}</span>
                    </div>
                    <div className="text-slate-300 mt-0.5">{vh.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prompt Text & Live Tester (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-violet-400" />
                  <span>{currentPrompt.name}</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  {isEditing ? 'Editing Prompt Template' : 'Full Production Prompt Text'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-cyan-400" /> Edit Prompt
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleRunTest}
                      disabled={isRunning}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-violet transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isRunning ? 'Running...' : 'Run Prompt'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Prompt Body */}
            <div>
              {isEditing ? (
                <textarea
                  rows={14}
                  value={editPromptText}
                  onChange={(e) => setEditPromptText(e.target.value)}
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-xl p-3.5 text-xs font-mono text-slate-100 leading-relaxed focus:outline-none focus:border-violet-500"
                />
              ) : (
                <pre className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto">
                  {currentPrompt.promptText}
                </pre>
              )}
            </div>

            {/* Test Execution Output */}
            {testOutput && (
              <div className="pt-3 border-t border-slate-800 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Deterministic Output Validation Result
                  </span>
                  <button onClick={() => setTestOutput(null)} className="text-slate-500 hover:text-slate-300">
                    Clear
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#080d1a] border border-cyan-800/40 text-xs font-mono text-cyan-200 whitespace-pre-wrap max-h-56 overflow-y-auto">
                  {testOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
