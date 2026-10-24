import React, { useState } from 'react';
import {
  Zap,
  Play,
  CheckCircle2,
  Clock,
  RotateCcw,
  Check,
  Building2,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Download,
  Lock,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AutomationRun, Incident } from '../types';

interface AutomationStudioProps {
  automations: AutomationRun[];
  incidents: Incident[];
  onTriggerAutomation: (incidentId: string) => AutomationRun;
  onApproveAutomation: (runId: string, approverName: string) => void;
}

export const AutomationStudio: React.FC<AutomationStudioProps> = ({
  automations,
  incidents,
  onTriggerAutomation,
  onApproveAutomation,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [selectedRunId, setSelectedRunId] = useState<string>(automations[0]?.id || '');
  const [isTriggering, setIsTriggering] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'integrations'>('pipeline');

  const currentRun = automations.find(a => a.id === selectedRunId) || automations[0];

  const handleTrigger = () => {
    if (!selectedIncidentId) return;
    setIsTriggering(true);
    setTimeout(() => {
      const newRun = onTriggerAutomation(selectedIncidentId);
      setSelectedRunId(newRun.id);
      setIsTriggering(false);
    }, 500);
  };

  const handleApprove = () => {
    if (!currentRun) return;
    onApproveAutomation(currentRun.id, 'Dr. Sarah Chen (Incident Commander)');
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              ORCHESTRATION PIPELINE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Working Local Automation Workflow
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Automation Studio & Workflow Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Automate incident intake, sanitization, report draft synthesis, and dual-custody commander approval gates.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#080d1a] border border-[#1e2f52] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pipeline'
                ? 'bg-cyan-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Active Pipeline
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'integrations'
                ? 'bg-cyan-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Zapier / Make Guide
          </button>
        </div>
      </div>

      {activeTab === 'pipeline' ? (
        <div className="space-y-6">
          {/* Launch Automation Trigger Card */}
          <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                Run Incident Intake & Report Automation Pipeline
              </span>
              <p className="text-xs text-slate-300">
                Trigger intake validation, record synthesis, and staged human approval checkpoint for an incident.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(e.target.value)}
                className="bg-[#080d1a] border border-[#1e2f52] rounded-xl px-3 py-2 text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                {incidents.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.id} — {i.title.slice(0, 32)}...
                  </option>
                ))}
              </select>

              <button
                onClick={handleTrigger}
                disabled={isTriggering}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isTriggering ? 'animate-spin' : ''}`} />
                <span>{isTriggering ? 'Executing Pipeline...' : 'Trigger Pipeline'}</span>
              </button>
            </div>
          </div>

          {/* Workflow Diagram & Steps Visualization */}
          {currentRun && (
            <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                      {currentRun.id}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Target: {currentRun.incidentId}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    {currentRun.trigger}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                      currentRun.status === 'Executed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : currentRun.status === 'Pending Approval'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    }`}
                  >
                    Status: {currentRun.status}
                  </span>
                </div>
              </div>

              {/* Processing Stages Stepper */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                  Processing Stages & Checkpoints
                </span>

                <div className="space-y-3">
                  {currentRun.steps.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isPending = step.status === 'pending';
                    const isApprovalStep = idx === 4;

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isCompleted
                            ? 'bg-[#090e1c] border-slate-800/90 text-slate-200'
                            : isApprovalStep && currentRun.status === 'Pending Approval'
                            ? 'bg-[#181a30] border-amber-500/60 shadow-glow-amber text-white'
                            : 'bg-[#070b16] border-slate-800/60 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                              isCompleted
                                ? 'bg-emerald-500 text-black'
                                : isApprovalStep && currentRun.status === 'Pending Approval'
                                ? 'bg-amber-500 text-black animate-pulse'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                          </div>

                          <div>
                            <div className="text-xs font-bold">{step.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{step.details}</div>
                          </div>
                        </div>

                        {/* If Human Approval step and pending */}
                        {isApprovalStep && currentRun.status === 'Pending Approval' ? (
                          <button
                            onClick={handleApprove}
                            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-green flex items-center gap-1.5 self-start sm:self-auto"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Sign Off
                          </button>
                        ) : (
                          <div className="font-mono text-[10px] text-slate-500 text-right">
                            {step.timestamp || 'Pending Step'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Execution Run Log Details */}
              <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-cyan-400 font-bold">
                    Pipeline Execution Telemetry Log
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    Timestamp: {new Date(currentRun.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="font-mono text-[11px] text-slate-300 space-y-1">
                  <div>[PIPELINE] Initialized automation run ID: {currentRun.id}</div>
                  <div>[VALIDATOR] Checked required incident fields: OK</div>
                  <div>[CLASSIFIER] Applied deterministic classification logic: OK</div>
                  <div>[SYNTHESIZER] Report summary compiled with audit metadata: OK</div>
                  {currentRun.approvedBy && (
                    <div className="text-emerald-400">
                      [APPROVAL] Signed off by: {currentRun.approvedBy} at {new Date(currentRun.approvedAt || '').toLocaleTimeString()}
                    </div>
                  )}
                  {currentRun.status === 'Executed' && (
                    <div className="text-cyan-400">
                      [DISPATCH] Export bundle staging completed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* INTEGRATIONS GUIDE FOR ZAPIER / MAKE */
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              External Automation Integration Guide (Zapier & Make)
            </h2>
            <p className="text-xs text-slate-400">
              How to configure external webhooks securely without exposing API keys or secrets in frontend code.
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
              <h3 className="font-bold text-cyan-300 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" /> Security Architecture: Server-Side Webhooks Only
              </h3>
              <p>
                In production, webhook URLs, Zapier API keys, and notification tokens must NEVER be embedded in the React client code or client-side bundles. All external automations must pass through an authenticated server-side endpoint (e.g. Supabase Edge Function or Express API gateway) that validates the user JWT session before dispatching external webhooks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-sm">Example Webhook Payload Schema</h3>
              <pre className="p-3 bg-[#080d1a] border border-slate-800 rounded-lg font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`{
  "event": "sentinelx.incident.contained",
  "incidentId": "INC-2026-0401",
  "category": "Lost or Stolen Laptop",
  "severity": "High",
  "affectedAsset": "Lab Laptop #14 (NSL-LT-014)",
  "responder": "Alex Rivera",
  "approvalSignoff": "Dr. Sarah Chen",
  "timestamp": "2026-10-23T20:30:00Z"
}`}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-sm">Recommended Zapier / Make Triggers for Educational Labs</h3>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
                <li><strong>Slack / Microsoft Teams Alert:</strong> Post high-priority emergency alerts to private #ir-incident-response bridge when severity is High or Critical.</li>
                <li><strong>MDM Intune Webhook:</strong> Push automated device remote lock command upon Incident Commander approval.</li>
                <li><strong>Jira / GitHub Issues Sync:</strong> Create tracking issue with NIST phase milestones for post-incident corrective actions.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
