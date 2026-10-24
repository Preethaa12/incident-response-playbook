import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Incident, IncidentCategory, Severity } from '../../types';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: Omit<Incident, 'id' | 'timeline' | 'evidenceReferences' | 'actionsTaken'> & { initialAction?: string }) => void;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('Lost or Stolen Laptop');
  const [severity, setSeverity] = useState<Severity>('High');
  const [description, setDescription] = useState('');
  const [affectedAsset, setAffectedAsset] = useState('');
  const [assignedResponder, setAssignedResponder] = useState('Alex Rivera (Security Responder)');
  const [incidentCommander, setIncidentCommander] = useState('Dr. Sarah Chen (Lab Director)');
  const [initialAction, setInitialAction] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Incident title is required';
    if (!description.trim()) newErrors.description = 'Detailed incident description is required';
    if (!affectedAsset.trim()) newErrors.affectedAsset = 'Affected asset or hostname must be specified';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      category,
      severity,
      status: 'New',
      currentPhase: 'DETECT',
      description: description.trim(),
      affectedAsset: affectedAsset.trim(),
      detectionTime: new Date().toISOString(),
      assignedResponder,
      incidentCommander,
      containmentStatus: 'Initial triage in progress; containment pending evaluation.',
      recoveryStatus: 'Asset under assessment.',
      initialAction: initialAction.trim() || undefined,
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setAffectedAsset('');
    setInitialAction('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0d1527] border border-[#1e2f52] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#111c35] border-b border-[#1e2f52] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Log New Cybersecurity Incident
              </h2>
              <p className="text-xs text-slate-400">
                Northstar Learning Labs • CSE Capstone Incident Registry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Incident Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Workstation 09 Sudden High CPU with Encoded PowerShell"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {errors.title}
              </p>
            )}
          </div>

          {/* Category & Severity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Incident Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Lost or Stolen Laptop">Lost or Stolen Laptop</option>
                <option value="Malware Alert">Malware Alert</option>
                <option value="Account Takeover">Account Takeover</option>
                <option value="Phishing">Phishing</option>
                <option value="Suspicious Login">Suspicious Login</option>
                <option value="Data Exposure">Data Exposure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="Critical" className="text-red-400">Critical (Active widespread damage / Ransomware)</option>
                <option value="High" className="text-amber-400">High (Direct asset compromise / Admin identity)</option>
                <option value="Medium" className="text-cyan-400">Medium (Suspicious activity / Contained scope)</option>
                <option value="Low" className="text-emerald-400">Low (Informational alert / Minor violation)</option>
              </select>
            </div>
          </div>

          {/* Affected Asset */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Affected Asset / Target Identifier <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Lab Laptop #14 (NSL-LT-014), Workstation 07, or user@northstarlabs.edu.test"
              value={affectedAsset}
              onChange={(e) => setAffectedAsset(e.target.value)}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {errors.affectedAsset && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {errors.affectedAsset}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Incident Description & Observable Symptoms <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe what occurred, how it was detected, error codes, unusual process names, or physical context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* Responders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Assigned Responder
              </label>
              <select
                value={assignedResponder}
                onChange={(e) => setAssignedResponder(e.target.value)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Alex Rivera (Security Responder)">Alex Rivera (Security Responder)</option>
                <option value="Marcus Vance (IT Administrator)">Marcus Vance (IT Administrator)</option>
                <option value="Elena Rostova (Operations)">Elena Rostova (Operations)</option>
                <option value="Tier-1 Student Lab Assistant">Tier-1 Student Lab Assistant</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Incident Commander
              </label>
              <select
                value={incidentCommander}
                onChange={(e) => setIncidentCommander(e.target.value)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Dr. Sarah Chen (Lab Director)">Dr. Sarah Chen (Lab Director)</option>
                <option value="Arthur Pendelton, Esq. (Legal Advisory)">Arthur Pendelton, Esq. (Legal)</option>
              </select>
            </div>
          </div>

          {/* Initial Action Taken */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Initial Containment Action Taken (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Disconnected network Ethernet cable; Initiated BitLocker check"
              value={initialAction}
              onChange={(e) => setInitialAction(e.target.value)}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-400" />
            <p>
              Submitting initializes response phase at <strong>DETECT</strong> pursuant to NIST SP 800-61 Rev. 3. You can utilize the <strong>AI Response Copilot</strong> immediately after logging to generate containment steps.
            </p>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-[#1e2f52] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold tracking-wide shadow-glow-cyan transition-all"
            >
              Register Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
