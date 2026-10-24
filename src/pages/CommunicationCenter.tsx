import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Send,
  AlertTriangle,
  Info,
  Edit2,
  Save,
  RotateCcw,
  Building2,
  Users,
  ShieldAlert
} from 'lucide-react';
import { CommunicationTemplate, Incident } from '../types';

interface CommunicationCenterProps {
  templates: CommunicationTemplate[];
  incidents: Incident[];
  onUpdateTemplate: (template: CommunicationTemplate) => void;
}

export const CommunicationCenter: React.FC<CommunicationCenterProps> = ({
  templates,
  incidents,
  onUpdateTemplate,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || 'TMPL-01');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  const targetIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  // Editable fields
  const [editSubject, setEditSubject] = useState(currentTemplate.subject);
  const [editBody, setEditBody] = useState(currentTemplate.body);
  const [editAudience, setEditAudience] = useState(currentTemplate.audience);

  // Update edit form when selection changes
  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tmpl = templates.find(t => t.id === id);
    if (tmpl) {
      setEditSubject(tmpl.subject);
      setEditBody(tmpl.body);
      setEditAudience(tmpl.audience);
      setIsEditing(false);
    }
  };

  // Perform dynamic variable replacement for preview
  const renderPreview = (text: string) => {
    if (!targetIncident) return text;

    return text
      .replace(/{{INCIDENT_ID}}/g, targetIncident.id)
      .replace(/{{TITLE}}/g, targetIncident.title)
      .replace(/{{SEVERITY}}/g, targetIncident.severity)
      .replace(/{{AFFECTED_ASSET}}/g, targetIncident.affectedAsset)
      .replace(/{{DETECTION_TIME}}/g, new Date(targetIncident.detectionTime).toLocaleString())
      .replace(/{{ASSIGNED_RESPONDER}}/g, targetIncident.assignedResponder)
      .replace(/{{INCIDENT_COMMANDER}}/g, targetIncident.incidentCommander)
      .replace(/{{DESCRIPTION}}/g, targetIncident.description)
      .replace(/{{CONTAINMENT_STATUS}}/g, targetIncident.containmentStatus || 'Host isolated and cloud tokens invalidated.')
      .replace(/{{PLAYBOOK_REF}}/g, targetIncident.category === 'Lost or Stolen Laptop' ? 'PB-01' : targetIncident.category === 'Malware Alert' ? 'PB-02' : 'PB-03')
      .replace(/{{CURRENT_DATE}}/g, new Date().toLocaleDateString())
      .replace(/{{RESOLUTION_TIME}}/g, new Date().toLocaleString())
      .replace(/{{RECIPIENT_LEADERSHIP}}/g, 'Dean of Engineering & Lab Oversight Committee')
      .replace(/{{OPERATIONAL_IMPACT}}/g, 'Isolated to single lab workbench; no university core systems affected')
      .replace(/{{DATA_IMPACT}}/g, 'No unencrypted PII or sensitive institutional credentials exposed')
      .replace(/{{ESTIMATED_RECOVERY_HOURS}}/g, '4')
      .replace(/{{LEGAL_ADVISOR}}/g, 'Arthur Pendelton, Esq.')
      .replace(/{{NEXT_UPDATE_TIME}}/g, '17:00 UTC')
      .replace(/{{NETWORK_TARGET}}/g, 'Switch Port 14 / Student Lab VLAN 302')
      .replace(/{{USER_TARGET}}/g, 's.kumar@northstarlabs.edu.test')
      .replace(/{{IOC_TARGETS}}/g, '185.220.101.5 (TCP/443)')
      .replace(/{{SYSTEM_SCOPE}}/g, 'Lab Room 302 High-Performance Workstation Cluster')
      .replace(/{{MAINTENANCE_WINDOW}}/g, 'Tonight 22:00 - 23:30 UTC')
      .replace(/{{IMPACTED_SERVICES}}/g, 'Local VM hypervisor & student build server')
      .replace(/{{USER_ACTION_REQUIRED}}/g, 'Save open project files and log off workstations before 22:00 UTC')
      .replace(/{{CONTACT_EMAIL}}/g, 'ir-support@northstarlabs.edu.test')
      .replace(/{{PIR_DATE}}/g, 'Thursday at 14:00 UTC in Lab Conference Room 301')
      .replace(/{{MEETING_DATETIME}}/g, 'Thursday, October 29 at 14:00 UTC')
      .replace(/{{MEETING_LOCATION}}/g, 'Secure Signal Conference Bridge #ir-review')
      .replace(/{{FACILITATOR_NAME}}/g, 'Dr. Sarah Chen (Incident Commander)')
      .replace(/{{PLAYBOOK_NUMBER}}/g, '01');
  };

  const previewSubject = renderPreview(currentTemplate.subject);
  const previewBody = renderPreview(currentTemplate.body);

  const handleCopy = () => {
    const fullMessage = `Subject: ${previewSubject}\nAudience: ${currentTemplate.audience}\n\n${previewBody}`;
    navigator.clipboard.writeText(fullMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveTemplate = () => {
    onUpdateTemplate({
      ...currentTemplate,
      subject: editSubject,
      body: editBody,
      audience: editAudience
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              STAKEHOLDER COMMUNICATIONS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              6 Standard Crisis Templates
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Communication Template Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Verified notification drafts for internal responders, executive leadership, IT engineers, and lab community.
          </p>
        </div>

        {/* Safety Disclaimer Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Demo Safeguard: External emails are never automatically dispatched.</span>
        </div>
      </div>

      {/* Template Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {templates.map((tmpl) => {
          const isSelected = tmpl.id === selectedTemplateId;
          return (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#111c35] border-cyan-500 text-white shadow-glow-cyan'
                  : 'bg-[#0e1629] border-[#1e2f52] text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[9px] font-mono uppercase block text-cyan-400">
                {tmpl.id}
              </span>
              <span className="text-xs font-bold line-clamp-1 mt-0.5 block">
                {tmpl.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Preview & Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Guidance & Context (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-white tracking-wide pb-2 border-b border-slate-800">
              Template Instructions
            </h2>

            {/* Target incident selector for dynamic variables */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                Populate Variables from Incident:
              </label>
              <select
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(e.target.value)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                {incidents.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.id} — {i.title.slice(0, 36)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-mono text-[10px] uppercase text-slate-500 block">Target Audience</span>
              <p className="font-semibold text-slate-200">{currentTemplate.audience}</p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-mono text-[10px] uppercase text-slate-500 block">Operational Purpose</span>
              <p className="text-slate-300 leading-relaxed">{currentTemplate.purpose}</p>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-300 space-y-1">
              <span className="font-bold block flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-cyan-400" /> Usage Policy:
              </span>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {currentTemplate.guidance}
              </p>
            </div>

            {/* Supported Placeholders List */}
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                Supported Placeholders
              </span>
              <div className="flex flex-wrap gap-1">
                {currentTemplate.placeholders.map((ph, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#080d1a] text-slate-400 border border-slate-800"
                  >
                    {ph}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>{currentTemplate.title}</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  {isEditing ? 'Editing Raw Template Body' : 'Live Variable Replacement Preview'}
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
                      onClick={handleSaveTemplate}
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
                      <Edit2 className="w-3.5 h-3.5 text-cyan-400" /> Edit Template
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-glow-cyan transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Subject line */}
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                Subject Line
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2.5 text-xs text-slate-100 font-mono"
                />
              ) : (
                <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 font-mono text-xs text-cyan-300 font-semibold truncate">
                  {previewSubject}
                </div>
              )}
            </div>

            {/* Message Body */}
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                Message Body
              </label>
              {isEditing ? (
                <textarea
                  rows={14}
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-xl p-3.5 text-xs font-mono text-slate-100 leading-relaxed focus:outline-none focus:border-cyan-500"
                />
              ) : (
                <pre className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[480px] overflow-y-auto">
                  {previewBody}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
