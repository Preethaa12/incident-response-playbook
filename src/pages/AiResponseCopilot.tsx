import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  AlertOctagon,
  ShieldAlert,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Download,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Cpu,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { Incident, IncidentCategory, Severity } from '../types';
import { aiCopilotService, CopilotRecommendation } from '../services/aiCopilotService';

interface AiResponseCopilotProps {
  incidents: Incident[];
}

export const AiResponseCopilot: React.FC<AiResponseCopilotProps> = ({ incidents }) => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('incidentId');

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(preselectedId || '');
  const [category, setCategory] = useState<IncidentCategory>('Lost or Stolen Laptop');
  const [affectedAsset, setAffectedAsset] = useState('Lab Laptop #14 (Dell XPS 13, Asset Tag: NSL-LT-014)');
  const [description, setDescription] = useState(
    'Dell XPS 13 reported missing from Robotics Workshop. Contains cached lab portal sessions and local Git capstone files.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CopilotRecommendation | null>(null);
  const [copied, setCopied] = useState(false);

  // If preselected incident changed, populate inputs
  useEffect(() => {
    if (selectedIncidentId) {
      const match = incidents.find(i => i.id === selectedIncidentId);
      if (match) {
        setCategory(match.category);
        setAffectedAsset(match.affectedAsset);
        setDescription(match.description);
      }
    }
  }, [selectedIncidentId, incidents]);

  // Run initial analysis automatically
  useEffect(() => {
    handleRunAnalysis();
  }, []);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const rec = await aiCopilotService.analyzeIncident({
        title: selectedIncidentId ? incidents.find(i => i.id === selectedIncidentId)?.title : undefined,
        category,
        affectedAsset,
        description,
        selectedIncidentId: selectedIncidentId || undefined,
      });
      setResult(rec);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `SENTINELX AI INCIDENT ANALYSIS
Category: ${category}
Asset: ${affectedAsset}
Assessed Severity: ${result.assessedSeverity}
NIST Phase: ${result.currentPhase}

EXECUTIVE SUMMARY:
${result.summary}

IMMEDIATE RECOMMENDED ACTIONS:
${result.immediateActions.map((a, idx) => `${idx + 1}. [${a.requiresApproval ? 'APPROVAL REQUIRED' : 'GENERAL'}] ${a.action} (${a.assignedRole})`).join('\n')}

CONTAINMENT GUIDANCE:
${result.containmentGuidance.map(c => `- ${c}`).join('\n')}

RECOVERY GUIDANCE:
${result.recoveryGuidance.map(r => `- ${r}`).join('\n')}

EVIDENCE CHECKLIST:
${result.evidenceChecklist.map(e => `- ${e}`).join('\n')}

QUESTIONS FOR RESPONDER:
${result.questionsForResponder.map(q => `- ${q}`).join('\n')}

UNCERTAINTY & MISSING INFO:
${result.uncertaintyNotes.map(u => `- ${u}`).join('\n')}

SAFETY NOTICE:
${result.safetyDisclaimers.join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAnalysisJSON = () => {
    if (!result) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `sentinelx_copilot_analysis_${Date.now()}.json`);
    dlAnchor.click();
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#12142e] via-[#101938] to-[#0c152a] border border-violet-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/40 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-violet-400" /> AI DECISION SUPPORT WORKSPACE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LOCAL DETERMINISTIC ENGINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              AI Incident Response Copilot
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Synthesizes situational descriptions into prioritized containment actions, missing-evidence checklists, and NIST SP 800-61 Rev. 3 phase guidance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-violet transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze Scenario'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Input Workspace vs AI Generated Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white tracking-wide">
                Scenario & Asset Context
              </h2>
              <span className="text-[10px] font-mono text-cyan-400">Step 1</span>
            </div>

            {/* Select existing incident */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                Load Active Incident (Optional)
              </label>
              <select
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(e.target.value)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
              >
                <option value="">-- Enter Custom / Fictional Scenario --</option>
                {incidents.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.id} - {i.title.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                Threat Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
              >
                <option value="Lost or Stolen Laptop">Lost or Stolen Laptop</option>
                <option value="Malware Alert">Malware Alert</option>
                <option value="Account Takeover">Account Takeover</option>
                <option value="Phishing">Phishing</option>
                <option value="Suspicious Login">Suspicious Login</option>
                <option value="Data Exposure">Data Exposure</option>
              </select>
            </div>

            {/* Affected Asset */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                Affected Asset Identifier
              </label>
              <input
                type="text"
                value={affectedAsset}
                onChange={(e) => setAffectedAsset(e.target.value)}
                placeholder="e.g. Lab Laptop #14, Workstation 07, or user account"
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                Incident Description & Telemetry
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste alert messages, observable symptoms, command lines, or physical reports..."
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-violet transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Decision Support</span>
            </button>
          </div>

          {/* AI Safety Boundary Alert */}
          <div className="bg-[#0e1629] border border-violet-900/40 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-violet-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>AI Safety Guardrails Active</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Autonomous destructive actions (wipe, delete, terminate) strictly prohibited.</li>
              <li>Human approval required for high-impact containment.</li>
              <li>Engine operates offline with zero external credential leakage.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: AI Output Dossier (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {result ? (
            <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-xl space-y-6">
              {/* Header with Severity & Copy/Export */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/40 flex items-center justify-center shadow-glow-violet">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">AI Analysis & Triage Dossier</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.2 rounded">
                        Confidence {result.confidenceScore}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Engine: {result.engineUsed}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={exportAnalysisJSON}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Severity Assessment Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  result.assessedSeverity === 'Critical'
                    ? 'bg-red-950/30 border-red-500/40 text-red-200'
                    : result.assessedSeverity === 'High'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                }`}
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-current" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Severity Rating: {result.assessedSeverity}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-black/40 border border-current">
                      Assessed Priority
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {result.severityRationale}
                  </p>
                </div>
              </div>

              {/* NIST SP 800-61 Phase Lifecycle Bar */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-2">
                  NIST SP 800-61 Rev. 3 Lifecycle Progression
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {result.phaseProgress.map((p, idx) => (
                    <div
                      key={p.phase}
                      className={`p-2 rounded-lg border text-center text-xs ${
                        p.status === 'active'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-glow-cyan'
                          : p.status === 'completed'
                          ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                          : 'bg-[#080d1a] border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="text-[9px] font-mono">0{idx + 1}</div>
                      <div className="truncate text-[11px]">{p.phase}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate Recommended Actions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-cyan-400" /> Immediate Recommended Actions
                </h3>
                <div className="space-y-2.5">
                  {result.immediateActions.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-1.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                          <span className="text-cyan-400 font-mono">{idx + 1}.</span> {act.action}
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase self-start sm:self-auto border ${
                            act.requiresApproval
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {act.requiresApproval ? 'Approval Required' : 'General Guidance'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {act.rationale}
                      </p>
                      <div className="text-[10px] font-mono text-cyan-400 pt-1">
                        Assigned Role: {act.assignedRole}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Containment & Recovery Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> Containment Guidance
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
                    {result.containmentGuidance.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Recovery & Restoration
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
                    {result.recoveryGuidance.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Evidence Checklist & Responder Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" /> Evidence Preservation Checklist
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                    {result.evidenceChecklist.map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Questions for Responder
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                    {result.questionsForResponder.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Uncertainty Notes & Authoritative References */}
              <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-violet-400" /> Authoritative Source References
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Verified Citations</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {result.sourceReferences.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800 hover:border-violet-500/50 block group text-xs"
                    >
                      <div className="font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                        {ref.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{ref.standard}</div>
                      <div className="text-[9px] text-violet-400 font-mono mt-1 flex items-center gap-0.5">
                        Official Standard <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    </a>
                  ))}
                </div>

                <div className="pt-2 border-t border-violet-900/40">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Uncertainty & Information Gaps:
                  </span>
                  {result.uncertaintyNotes.map((note, idx) => (
                    <p key={idx} className="text-xs text-amber-300/90 leading-relaxed flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" /> {note}
                    </p>
                  ))}
                </div>
              </div>

              {/* Mandatory Safety Disclaimers */}
              <div className="p-4 rounded-xl bg-[#090d19] border border-slate-800 text-[11px] text-slate-400 space-y-1">
                {result.safetyDisclaimers.map((disc, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {disc}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-12 text-center text-slate-400">
              <Bot className="w-10 h-10 text-slate-600 mx-auto mb-3 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-200">Generating Situational Guidance...</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
