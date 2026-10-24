import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Printer,
  FileCheck,
  Check,
  X,
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { VerificationTestCase } from '../types';

interface AiVerificationSafetyLabProps {
  tests: VerificationTestCase[];
  onUpdateManualReview: (testId: string, review: VerificationTestCase['manualReview']) => void;
  onRunAutomatedCheck: (testId: string) => void;
  onRunAllChecks: () => void;
}

export const AiVerificationSafetyLab: React.FC<AiVerificationSafetyLabProps> = ({
  tests,
  onUpdateManualReview,
  onRunAutomatedCheck,
  onRunAllChecks,
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(tests[0]?.id || 'TEST-01');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isAuditingAll, setIsAuditingAll] = useState(false);

  const currentTest = tests.find(t => t.id === selectedTestId) || tests[0];

  // Metrics
  const totalTests = tests.length;
  const passedTests = tests.filter(t => t.status === 'Passed').length;
  const failedTests = tests.filter(t => t.status === 'Failed').length;
  const warningTests = tests.filter(t => t.status === 'Warning').length;

  const handleRunAll = () => {
    setIsAuditingAll(true);
    setTimeout(() => {
      onRunAllChecks();
      setIsAuditingAll(false);
    }, 600);
  };

  const handleToggleManualField = (field: 'factualAccuracy' | 'sourceValidity' | 'operationalSafety' | 'policyCompliance') => {
    const updatedReview = {
      ...currentTest.manualReview,
      [field]: !currentTest.manualReview[field],
      reviewedBy: 'Dr. Sarah Chen (Auditor)'
    };
    onUpdateManualReview(currentTest.id, updatedReview);
  };

  const handleUpdateNotes = (notes: string) => {
    const updatedReview = {
      ...currentTest.manualReview,
      notes,
      reviewedBy: 'Dr. Sarah Chen (Auditor)'
    };
    onUpdateManualReview(currentTest.id, updatedReview);
  };

  const filteredTests = tests.filter(t => {
    return categoryFilter === 'All' || t.category === categoryFilter;
  });

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/40">
              AI SAFETY BENCHMARK & AUDIT LAB
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Key Project Differentiator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Verification & Safety Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Automated heuristic screening and dual-custody manual audit of AI-generated incident response guidance.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRunAll}
            disabled={isAuditingAll}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-violet transition-all"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditingAll ? 'animate-spin' : ''}`} />
            <span>{isAuditingAll ? 'Auditing Corpus...' : 'Execute Automated Audit Suite'}</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Hero */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Total Test Cases</span>
          <div className="text-2xl font-black text-white mt-1">{totalTests}</div>
          <span className="text-[10px] text-slate-500 font-mono">Benchmarked Prompts</span>
        </div>

        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">Passed Checks</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{passedTests}</div>
          <span className="text-[10px] text-emerald-400/80 font-mono">Clean Compliance</span>
        </div>

        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-red-400 font-semibold block">Violations Caught</span>
          <div className="text-2xl font-black text-red-400 mt-1">{failedTests}</div>
          <span className="text-[10px] text-red-400/80 font-mono">Unsafe Guidance Flagged</span>
        </div>

        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block">Manual Reviews</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {tests.filter(t => t.manualReview.factualAccuracy !== null).length} / {totalTests}
          </div>
          <span className="text-[10px] text-amber-400/80 font-mono">Human-in-the-Loop</span>
        </div>
      </div>

      {/* Preliminary Screening Notice */}
      <div className="bg-[#101428] border border-cyan-800/50 rounded-2xl p-4 text-xs text-slate-300 space-y-1">
        <span className="font-bold text-cyan-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> Automated Screening Disclaimer:
        </span>
        <p className="text-[11px] leading-relaxed text-slate-300">
          Automated heuristic checks serve as preliminary safety screening for hallucinated standards, broken URLs, and unsafe destructive patterns (such as pulling power during ransomware execution). They do not constitute absolute mathematical proof of factual correctness. All critical containment recommendations require human Incident Commander authorization.
        </p>
      </div>

      {/* Test Case Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredTests.map((test) => {
          const isSelected = test.id === selectedTestId;
          return (
            <div
              key={test.id}
              onClick={() => setSelectedTestId(test.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#141530] border-violet-500 shadow-glow-violet'
                  : 'bg-[#0e1629] border-[#1e2f52] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-violet-400 font-bold">{test.id}</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                    test.status === 'Passed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : test.status === 'Failed'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {test.status}
                </span>
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1">{test.title}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {test.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Test Inspection Canvas */}
      <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-violet-400 bg-violet-950/40 border border-violet-800/40 px-2 py-0.2 rounded">
                {currentTest.id}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Category: {currentTest.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {currentTest.title}
            </h2>
          </div>

          <button
            onClick={() => onRunAutomatedCheck(currentTest.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-violet-400" /> Re-Scan Test Case
          </button>
        </div>

        {/* Input vs AI Candidate Snippet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block">
              Test Prompt / Incident Inquiry:
            </span>
            <div className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 text-slate-200 leading-relaxed font-mono text-[11px]">
              {currentTest.sampleInput}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block">
              AI Candidate Output Evaluated:
            </span>
            <div className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 text-amber-200 leading-relaxed font-mono text-[11px]">
              {currentTest.aiOutputSnippet}
            </div>
          </div>
        </div>

        {/* Automated Screening Check Results */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" /> Automated Screening Heuristic Checks
          </h3>

          <div className="space-y-2">
            {currentTest.automatedChecks.map((chk) => (
              <div
                key={chk.id}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                  chk.passed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-950/20 border-red-500/30 text-red-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">{chk.name}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-black/40 border border-current">
                      Severity: {chk.severity}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">{chk.details}</p>
                </div>

                <div className="flex-shrink-0">
                  {chk.passed ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      PASSED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                      FAILED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Review Section (Human-in-the-Loop) */}
        <div className="p-5 rounded-2xl bg-[#090e1c] border border-slate-800 space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Human Expert Review Signoff (Dual-Custody)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Reviewer: {currentTest.manualReview.reviewedBy || 'Pending'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Factual Accuracy */}
            <div
              onClick={() => handleToggleManualField('factualAccuracy')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                currentTest.manualReview.factualAccuracy
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#080d1a] border-slate-800 text-slate-400'
              }`}
            >
              <span>Factual Accuracy</span>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${currentTest.manualReview.factualAccuracy ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-600'}`}>
                {currentTest.manualReview.factualAccuracy && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Source Validity */}
            <div
              onClick={() => handleToggleManualField('sourceValidity')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                currentTest.manualReview.sourceValidity
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#080d1a] border-slate-800 text-slate-400'
              }`}
            >
              <span>Source Validity</span>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${currentTest.manualReview.sourceValidity ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-600'}`}>
                {currentTest.manualReview.sourceValidity && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Operational Safety */}
            <div
              onClick={() => handleToggleManualField('operationalSafety')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                currentTest.manualReview.operationalSafety
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#080d1a] border-slate-800 text-slate-400'
              }`}
            >
              <span>Operational Safety</span>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${currentTest.manualReview.operationalSafety ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-600'}`}>
                {currentTest.manualReview.operationalSafety && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Policy Compliance */}
            <div
              onClick={() => handleToggleManualField('policyCompliance')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                currentTest.manualReview.policyCompliance
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#080d1a] border-slate-800 text-slate-400'
              }`}
            >
              <span>Policy Compliance</span>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${currentTest.manualReview.policyCompliance ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-600'}`}>
                {currentTest.manualReview.policyCompliance && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Expert Auditor Notes & Remediations
            </label>
            <textarea
              rows={2}
              value={currentTest.manualReview.notes}
              onChange={(e) => handleUpdateNotes(e.target.value)}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
