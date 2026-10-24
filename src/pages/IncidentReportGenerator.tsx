import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  Printer,
  Download,
  Save,
  RotateCcw,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Clock,
  Eye,
  Edit3
} from 'lucide-react';
import { Incident, IncidentReport } from '../types';
import { dataService } from '../services/dataService';

interface IncidentReportGeneratorProps {
  incidents: Incident[];
}

export const IncidentReportGenerator: React.FC<IncidentReportGeneratorProps> = ({ incidents }) => {
  const [searchParams] = useSearchParams();
  const preselectedIncidentId = searchParams.get('incidentId');

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    preselectedIncidentId || incidents[0]?.id || ''
  );
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Load existing report or generate draft
  useEffect(() => {
    if (selectedIncidentId) {
      const existing = dataService.getReports().find(r => r.incidentId === selectedIncidentId);
      if (existing) {
        setReport(existing);
      } else {
        const draft = dataService.generateReportDraft(selectedIncidentId);
        setReport(draft);
      }
    }
  }, [selectedIncidentId]);

  const handleFieldChange = (field: keyof IncidentReport, val: any) => {
    if (!report) return;
    setReport({ ...report, [field]: val });
  };

  const handleSave = () => {
    if (!report) return;
    dataService.saveReport(report);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleResetDraft = () => {
    if (!selectedIncidentId) return;
    if (window.confirm('Reset this report to the latest live incident state?')) {
      const freshDraft = dataService.generateReportDraft(selectedIncidentId);
      setReport(freshDraft);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!report) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${report.id}_incident_report.json`);
    dlAnchor.click();
  };

  if (!report) {
    return (
      <div className="text-center py-20 text-slate-400">
        <FileText className="w-10 h-10 mx-auto mb-2 text-slate-600" />
        <p>Select an incident to build an incident report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              AUDIT-READY DOCUMENTATION
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Report ID: {report.id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Incident Report Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Synthesize metadata, forensic timeline, containment evidence, and corrective action plans.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            {isPreviewMode ? <Edit3 className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isPreviewMode ? 'Edit Mode' : 'Print Preview'}</span>
          </button>
          <button
            onClick={handleResetDraft}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            title="Re-generate draft from incident timeline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Refresh Draft
          </button>
          <button
            onClick={handleExportJSON}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" /> JSON
          </button>
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-glow-cyan transition-all"
          >
            <Save className="w-3.5 h-3.5" /> {isSavedNotice ? 'Saved!' : 'Save Draft'}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-glow-green transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </button>
        </div>
      </div>

      {/* Select Incident Selector */}
      <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-mono uppercase text-slate-400 font-semibold whitespace-nowrap">
            Target Incident:
          </label>
          <select
            value={selectedIncidentId}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            className="bg-[#080d1a] border border-[#1e2f52] rounded-lg px-3 py-1.5 text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
          >
            {incidents.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} — {i.title.slice(0, 48)} ({i.severity})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Status:</span>
          <select
            value={report.status}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="bg-[#080d1a] border border-[#1e2f52] rounded-lg px-2.5 py-1 text-xs text-cyan-400 font-semibold focus:outline-none"
          >
            <option value="Draft">Draft</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved & Finalized</option>
          </select>
        </div>
      </div>

      {/* Main Printable Document Canvas */}
      <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 printable-area text-slate-200">
        {/* Document Header */}
        <div className="border-b-2 border-slate-700 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
                SentinelX <span className="text-xs px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-mono border border-cyan-500/30">AI</span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-cyan-400" /> Northstar Learning Labs
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Official Cybersecurity Incident Report
            </h2>
            <p className="text-xs text-slate-400">
              Reference ID: {report.incidentId} • Published: {new Date(report.generatedAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-[#080d1a] border border-slate-800 p-3 rounded-xl text-right font-mono text-xs">
            <div><strong>Severity:</strong> <span className="text-amber-400">{report.incidentMetadata.severity}</span></div>
            <div><strong>Status:</strong> <span className="text-emerald-400">{report.incidentMetadata.status}</span></div>
            <div><strong>Classification:</strong> {report.status}</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            1. Executive Summary
          </h3>
          {isPreviewMode ? (
            <p className="text-xs text-slate-300 leading-relaxed bg-[#080d1a] p-3.5 rounded-xl border border-slate-800">
              {report.executiveSummary}
            </p>
          ) : (
            <textarea
              rows={3}
              value={report.executiveSummary}
              onChange={(e) => handleFieldChange('executiveSummary', e.target.value)}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          )}
        </div>

        {/* Section 2: Metadata & Asset Identification */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            2. Incident Metadata & Affected Assets
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3.5 bg-[#080d1a] rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Incident ID</span>
              <span className="font-mono text-cyan-400 font-bold">{report.incidentId}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Category</span>
              <span className="font-semibold">{report.incidentMetadata.category}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Lead Responder</span>
              <span>{report.incidentMetadata.leadResponder}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Incident Commander</span>
              <span>{report.incidentMetadata.incidentCommander}</span>
            </div>
          </div>

          <div className="mt-2">
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Target Asset Details
            </label>
            {isPreviewMode ? (
              <p className="text-xs text-slate-300 p-2.5 rounded-lg bg-[#080d1a] border border-slate-800">
                {report.affectedAssets}
              </p>
            ) : (
              <input
                type="text"
                value={report.affectedAssets}
                onChange={(e) => handleFieldChange('affectedAssets', e.target.value)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            )}
          </div>
        </div>

        {/* Section 3: Detection & Timeline */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            3. Chronological Response Timeline
          </h3>
          {isPreviewMode ? (
            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed bg-[#080d1a] p-3.5 rounded-xl border border-slate-800">
              {report.detectionAndTimeline}
            </pre>
          ) : (
            <textarea
              rows={4}
              value={report.detectionAndTimeline}
              onChange={(e) => handleFieldChange('detectionAndTimeline', e.target.value)}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          )}
        </div>

        {/* Section 4: Impact Assessment & Containment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              4. Operational & Privacy Impact
            </h3>
            {isPreviewMode ? (
              <p className="text-xs text-slate-300 p-3 rounded-xl bg-[#080d1a] border border-slate-800 leading-relaxed">
                {report.impactAssessment}
              </p>
            ) : (
              <textarea
                rows={3}
                value={report.impactAssessment}
                onChange={(e) => handleFieldChange('impactAssessment', e.target.value)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              5. Containment Measures Taken
            </h3>
            {isPreviewMode ? (
              <p className="text-xs text-slate-300 p-3 rounded-xl bg-[#080d1a] border border-slate-800 leading-relaxed">
                {report.containment}
              </p>
            ) : (
              <textarea
                rows={3}
                value={report.containment}
                onChange={(e) => handleFieldChange('containment', e.target.value)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            )}
          </div>
        </div>

        {/* Section 5: Recovery & Forensic Evidence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              6. Recovery & System Restoration
            </h3>
            {isPreviewMode ? (
              <p className="text-xs text-slate-300 p-3 rounded-xl bg-[#080d1a] border border-slate-800 leading-relaxed">
                {report.recovery}
              </p>
            ) : (
              <textarea
                rows={3}
                value={report.recovery}
                onChange={(e) => handleFieldChange('recovery', e.target.value)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              7. Chain of Custody & Evidence
            </h3>
            {isPreviewMode ? (
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap p-3 rounded-xl bg-[#080d1a] border border-slate-800 leading-relaxed">
                {report.evidenceReferences}
              </pre>
            ) : (
              <textarea
                rows={3}
                value={report.evidenceReferences}
                onChange={(e) => handleFieldChange('evidenceReferences', e.target.value)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            )}
          </div>
        </div>

        {/* Section 6: Root Cause & Lessons Learned */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              8. Root Cause Determination
            </h3>
            {isPreviewMode ? (
              <p className="text-xs text-slate-300 p-3 rounded-xl bg-[#080d1a] border border-slate-800 leading-relaxed">
                {report.rootCause}
              </p>
            ) : (
              <textarea
                rows={3}
                value={report.rootCause}
                onChange={(e) => handleFieldChange('rootCause', e.target.value)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              9. Lessons Learned & Human Review
            </h3>
            {isPreviewMode ? (
              <p className="text-xs text-slate-300 p-3 rounded-xl bg-[#080d1a] border border-slate-800 leading-relaxed">
                {report.lessonsLearned}
              </p>
            ) : (
              <textarea
                rows={3}
                value={report.lessonsLearned}
                onChange={(e) => handleFieldChange('lessonsLearned', e.target.value)}
                className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            )}
          </div>
        </div>

        {/* Section 7: Corrective Action Plan */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            10. Corrective Action Plan & Ownership
          </h3>
          {isPreviewMode ? (
            <p className="text-xs text-slate-300 p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 leading-relaxed">
              {report.correctiveActionPlan}
            </p>
          ) : (
            <textarea
              rows={3}
              value={report.correctiveActionPlan}
              onChange={(e) => handleFieldChange('correctiveActionPlan', e.target.value)}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          )}
        </div>

        {/* Signatures & Certification Block */}
        <div className="pt-8 border-t-2 border-slate-700 grid grid-cols-2 gap-8 text-xs font-mono">
          <div className="space-y-2">
            <div className="border-b border-slate-600 pb-1 text-slate-400">
              LEAD INCIDENT RESPONDER:
            </div>
            <div className="font-bold text-white">{report.incidentMetadata.leadResponder}</div>
            <div className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString()}</div>
          </div>

          <div className="space-y-2">
            <div className="border-b border-slate-600 pb-1 text-slate-400">
              INCIDENT COMMANDER / DIRECTOR SIGNOFF:
            </div>
            <div className="font-bold text-white">{report.incidentMetadata.incidentCommander}</div>
            <div className="text-[10px] text-slate-500">Certified for Capstone Audit</div>
          </div>
        </div>
      </div>
    </div>
  );
};
