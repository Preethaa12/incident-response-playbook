import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Bot,
  FileText,
  Plus,
  Lock,
  Layers,
  User,
  Hash,
  Download,
  AlertOctagon,
  X,
  FileSpreadsheet,
  Check,
  Building2
} from 'lucide-react';
import { Incident, IncidentPhase, IncidentStatus } from '../types';

interface IncidentDetailPageProps {
  incidents: Incident[];
  onUpdatePhase: (incidentId: string, phase: IncidentPhase, role: string, notes: string) => void;
  onUpdateStatus: (incidentId: string, status: IncidentStatus, role: string, notes: string) => void;
  onAddTimelineEvent: (incidentId: string, event: { phase: IncidentPhase; action: string; responsibleRole: string; outcome: string; notes: string; timestamp: string }) => void;
  onAddEvidence: (incidentId: string, evidence: { name: string; type: string; timestamp: string; hashOrNote: string; collectedBy: string }) => void;
  onDeleteIncident?: (id: string) => void;
}

export const IncidentDetailPage: React.FC<IncidentDetailPageProps> = ({
  incidents,
  onUpdatePhase,
  onUpdateStatus,
  onAddTimelineEvent,
  onAddEvidence,
  onDeleteIncident,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const incident = incidents.find(i => i.id === id);

  // Modal states
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [showCloseConfirmModal, setShowCloseConfirmModal] = useState(false);

  // New Event Form State
  const [eventPhase, setEventPhase] = useState<IncidentPhase>(incident?.currentPhase || 'CONTAIN');
  const [eventAction, setEventAction] = useState('');
  const [eventRole, setEventRole] = useState(incident?.assignedResponder || 'Security Responder');
  const [eventOutcome, setEventOutcome] = useState('');
  const [eventNotes, setEventNotes] = useState('');

  // New Evidence Form State
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceType, setEvidenceType] = useState('System Report');
  const [evidenceHash, setEvidenceHash] = useState('');
  const [evidenceCollector, setEvidenceCollector] = useState(incident?.assignedResponder || 'Alex Rivera');

  if (!incident) {
    return (
      <div className="text-center py-20 animate-fadeIn">
        <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Incident Not Found</h2>
        <p className="text-xs text-slate-400 mt-1">The requested incident ID "{id}" does not exist in the active store.</p>
        <button
          onClick={() => navigate('/incidents')}
          className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
        >
          Return to Incidents
        </button>
      </div>
    );
  }

  const nistPhases: IncidentPhase[] = ['PREPARE', 'DETECT', 'CONTAIN', 'RECOVER', 'REVIEW'];

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventAction.trim()) return;

    onAddTimelineEvent(incident.id, {
      phase: eventPhase,
      action: eventAction.trim(),
      responsibleRole: eventRole,
      outcome: eventOutcome.trim() || 'Executed as documented',
      notes: eventNotes.trim() || 'Logged via SentinelX timeline',
      timestamp: new Date().toISOString()
    });

    setEventAction('');
    setEventOutcome('');
    setEventNotes('');
    setShowAddEventModal(false);
  };

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceName.trim()) return;

    onAddEvidence(incident.id, {
      name: evidenceName.trim(),
      type: evidenceType,
      hashOrNote: evidenceHash.trim() || 'SHA256: Calculated upon ingestion',
      collectedBy: evidenceCollector,
      timestamp: new Date().toISOString()
    });

    setEvidenceName('');
    setEvidenceHash('');
    setShowAddEvidenceModal(false);
  };

  const handleConfirmClose = () => {
    onUpdateStatus(incident.id, 'Resolved', 'Dr. Sarah Chen (Incident Commander)', 'Incident formally verified resolved and closed by Commander.');
    setShowCloseConfirmModal(false);
  };

  const exportIncidentJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incident, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${incident.id}_dossier.json`);
    dlAnchor.click();
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Back button & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/incidents')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Incident Register
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigate(`/copilot?incidentId=${incident.id}`)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 text-xs font-semibold shadow-glow-violet transition-all"
          >
            <Bot className="w-4 h-4 text-violet-400" /> Consult AI Copilot
          </button>

          <button
            onClick={() => navigate(`/reports?incidentId=${incident.id}`)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-glow-cyan transition-all"
          >
            <FileText className="w-4 h-4 text-cyan-400" /> Build Report
          </button>

          <button
            onClick={exportIncidentJSON}
            className="p-2 rounded-xl bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 transition-colors"
            title="Download Incident JSON Dossier"
          >
            <Download className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Incident Dossier Header Card */}
      <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-md">
                {incident.id}
              </span>
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  incident.severity === 'Critical'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-glow-red'
                    : incident.severity === 'High'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : incident.severity === 'Medium'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}
              >
                {incident.severity} SEVERITY
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {incident.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Northstar Learning Labs
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {incident.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {incident.description}
            </p>
          </div>

          {/* Status & Closure Control */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 min-w-[200px]">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Current Status
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={incident.status}
                  onChange={(e) => onUpdateStatus(incident.id, e.target.value as IncidentStatus, 'Marcus Vance', `Status updated to ${e.target.value}`)}
                  className="bg-[#080d1a] border border-[#1e2f52] rounded-lg px-3 py-1.5 text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="New">New</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Contained">Contained</option>
                  <option value="Recovering">Recovering</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {incident.status !== 'Resolved' ? (
              <button
                onClick={() => setShowCloseConfirmModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Close Incident
              </button>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> RESOLVED & SIGNED OFF
              </span>
            )}
          </div>
        </div>

        {/* Phase Stepper Bar (NIST SP 800-61) */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Active Response Phase
          </div>

          <div className="grid grid-cols-5 gap-2">
            {nistPhases.map((phase, idx) => {
              const isCurrent = incident.currentPhase === phase;
              const currentIndex = nistPhases.indexOf(incident.currentPhase);
              const isPast = idx < currentIndex;

              return (
                <button
                  key={phase}
                  onClick={() => onUpdatePhase(incident.id, phase, incident.assignedResponder, `Phase updated to ${phase}`)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-glow-cyan'
                      : isPast
                      ? 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      : 'bg-[#080d1a] border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[9px] font-mono tracking-wider font-semibold">
                    STEP 0{idx + 1}
                  </div>
                  <div className="text-xs font-bold mt-0.5 truncate">{phase}</div>
                  <div className="text-[9px] mt-1 text-slate-400">
                    {isCurrent ? '● Active' : isPast ? '✓ Completed' : 'Pending'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Key Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Affected Asset</span>
            <span className="font-semibold text-slate-200">{incident.affectedAsset}</span>
          </div>

          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Detection Timestamp</span>
            <span className="font-mono text-slate-200">{new Date(incident.detectionTime).toLocaleString()}</span>
          </div>

          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Lead Responder</span>
            <span className="font-semibold text-slate-200">{incident.assignedResponder}</span>
          </div>

          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Incident Commander</span>
            <span className="font-semibold text-slate-200">{incident.incidentCommander}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Timeline & Actions vs Evidence & Containment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline & Actions (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline Section */}
          <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" /> Response Chronology & Timeline
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ordered audit log of events, communications, and triage decisions
                </p>
              </div>

              <button
                onClick={() => setShowAddEventModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Timeline Entry
              </button>
            </div>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {incident.timeline.map((event) => (
                <div key={event.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#080d1a] border-2 border-cyan-400 ring-4 ring-[#080d1a]" />

                  <div className="bg-[#090e1c] border border-slate-800/80 rounded-xl p-3.5 hover:border-cyan-500/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{event.action}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {event.phase}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed">
                      {event.notes}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span><strong>Role:</strong> {event.responsibleRole}</span>
                      <span className="text-emerald-400"><strong>Outcome:</strong> {event.outcome}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Taken Summary */}
          <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg">
            <h2 className="text-sm font-bold text-white tracking-wide mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Containment & Operational Actions Log
            </h2>
            <div className="space-y-2">
              {incident.actionsTaken.map((act, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#090e1c] border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-200"
                >
                  <span className="font-mono font-bold text-cyan-400 flex-shrink-0 mt-0.5">
                    {idx + 1}.
                  </span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Evidence & Status Controls (1 Column) */}
        <div className="space-y-6">
          {/* Containment & Recovery Status */}
          <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Containment & Recovery Posture
            </h2>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Containment Status
              </label>
              <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 text-xs text-slate-200 leading-relaxed">
                {incident.containmentStatus || 'No formal containment note logged yet.'}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Recovery Status
              </label>
              <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 text-xs text-slate-200 leading-relaxed">
                {incident.recoveryStatus || 'Recovery assessment in progress.'}
              </div>
            </div>

            {incident.lessonsLearned && (
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Lessons Learned
                </label>
                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-300 leading-relaxed">
                  {incident.lessonsLearned}
                </div>
              </div>
            )}
          </div>

          {/* Evidence References */}
          <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <Hash className="w-4 h-4 text-cyan-400" /> Digital Evidence Chain
              </h2>
              <button
                onClick={() => setShowAddEvidenceModal(true)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                title="Register Evidence Item"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {incident.evidenceReferences.length > 0 ? (
                incident.evidenceReferences.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-[#090e1c] border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 truncate">{ev.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-1.5 py-0.2 rounded">
                        {ev.type}
                      </span>
                    </div>

                    <div className="font-mono text-[10px] text-slate-400 truncate">
                      {ev.hashOrNote}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                      <span>By: {ev.collectedBy}</span>
                      <span>{new Date(ev.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#090e1c] text-center text-xs text-slate-500">
                  No evidence registered. Click + to add forensic dumps, log exports, or MDM snapshots.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Timeline Entry Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0d1527] border border-[#1e2f52] rounded-2xl max-w-lg w-full shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">Record Response Action & Event</h3>
              <button onClick={() => setShowAddEventModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Action Description</label>
                <input
                  type="text"
                  placeholder="e.g. Conducted forensic memory triage via Velociraptor"
                  value={eventAction}
                  onChange={(e) => setEventAction(e.target.value)}
                  required
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">NIST Phase</label>
                  <select
                    value={eventPhase}
                    onChange={(e) => setEventPhase(e.target.value as IncidentPhase)}
                    className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                  >
                    <option value="PREPARE">PREPARE</option>
                    <option value="DETECT">DETECT</option>
                    <option value="CONTAIN">CONTAIN</option>
                    <option value="RECOVER">RECOVER</option>
                    <option value="REVIEW">REVIEW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Responsible Role</label>
                  <input
                    type="text"
                    value={eventRole}
                    onChange={(e) => setEventRole(e.target.value)}
                    className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Outcome / Result</label>
                <input
                  type="text"
                  placeholder="e.g. Memory image verified clean; Hash sha256 calculated"
                  value={eventOutcome}
                  onChange={(e) => setEventOutcome(e.target.value)}
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Technical Notes</label>
                <textarea
                  rows={2}
                  placeholder="Additional context, tool outputs, or commands executed..."
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-glow-cyan"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {showAddEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0d1527] border border-[#1e2f52] rounded-2xl max-w-lg w-full shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">Register Digital Evidence Item</h3>
              <button onClick={() => setShowAddEvidenceModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvidenceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Evidence Name / Artifact Title</label>
                <input
                  type="text"
                  placeholder="e.g. Memory Dump Triage raw image"
                  value={evidenceName}
                  onChange={(e) => setEvidenceName(e.target.value)}
                  required
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Artifact Type</label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value)}
                    className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                  >
                    <option value="System Report">System Report</option>
                    <option value="Memory Dump">Memory Dump</option>
                    <option value="Network PCAP">Network PCAP</option>
                    <option value="Disk Image">Disk Image</option>
                    <option value="Log Export">Log Export</option>
                    <option value="Email Header">Email Header</option>
                    <option value="Physical Security">Physical Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Collected By</label>
                  <input
                    type="text"
                    value={evidenceCollector}
                    onChange={(e) => setEvidenceCollector(e.target.value)}
                    className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cryptographic Hash or Forensic Reference</label>
                <input
                  type="text"
                  placeholder="SHA256: 4b29e710d021c324... or Vault Reference"
                  value={evidenceHash}
                  onChange={(e) => setEvidenceHash(e.target.value)}
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-glow-cyan"
                >
                  Register Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close Confirmation Modal */}
      {showCloseConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0d1527] border border-emerald-500/40 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white">Confirm Incident Resolution & Closure</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Are you sure you want to mark <strong>{incident.id}</strong> as Resolved? This certifies that containment and recovery procedures are verified complete and transitions the incident into the <strong>REVIEW</strong> phase.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 text-[11px] text-slate-400">
              Commander Signoff: <strong>Dr. Sarah Chen (Lab Director)</strong>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCloseConfirmModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-green"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
