import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  ShieldAlert,
  Layers,
  Cpu,
  Bot,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Code2,
  FileText,
  Sliders,
  CheckSquare
} from 'lucide-react';

export const CapstoneDocumentationCenter: React.FC = () => {
  const navigate = useNavigate();

  // Evaluator Interactive Walkthrough Checklist
  const [tourSteps, setTourSteps] = useState([
    {
      id: 1,
      title: 'Review Overview Dashboard Metrics',
      desc: 'Inspect MTTA (14m), MTTC (48m), Readiness score (96%), and active NIST phase distribution.',
      path: '/',
      completed: true
    },
    {
      id: 2,
      title: 'Triage an Incident in Management Center',
      desc: 'Filter incidents by category or severity, inspect INC-2026-0401 dossier, and view timeline events.',
      path: '/incidents',
      completed: true
    },
    {
      id: 3,
      title: 'Generate Guidance via AI Response Copilot',
      desc: 'Enter an asset scenario, evaluate deterministic containment advice, and review uncertainty flags.',
      path: '/copilot',
      completed: false
    },
    {
      id: 4,
      title: 'Execute an Interactive Playbook SOP',
      desc: 'Check off actions in PB-01 (Lost Laptop) or PB-02 (Malware), observing Commander approval gates.',
      path: '/playbooks',
      completed: false
    },
    {
      id: 5,
      title: 'Conduct a Tabletop Simulation Drill',
      desc: 'Walk through 4 attack inject stages, choose optimal vs. unsafe actions, and view the After-Action Report.',
      path: '/tabletop',
      completed: false
    },
    {
      id: 6,
      title: 'Synthesize Audit-Ready Incident Report',
      desc: 'Generate formal report for INC-2026-0401 with forensic hashes and corrective action ownership.',
      path: '/reports',
      completed: false
    },
    {
      id: 7,
      title: 'Audit AI Output in Safety & Verification Lab',
      desc: 'Execute automated checks on hallucinated citations and unsafe hard power-off recommendations.',
      path: '/safety-lab',
      completed: false
    },
    {
      id: 8,
      title: 'Trigger Working Automation Studio Pipeline',
      desc: 'Run intake-to-report automation pipeline and execute dual-custody Commander approval checkpoint.',
      path: '/automation',
      completed: false
    }
  ]);

  const toggleTourStep = (id: number) => {
    setTourSteps(prev =>
      prev.map(s => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const completedCount = tourSteps.filter(s => s.completed).length;

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c152a] via-[#101b38] to-[#0d162d] border border-[#1e2f52] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> CSE CAPSTONE 5 PROJECT DOSSIER
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Academic Year 2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Incident Response Playbook for a Small Organisation
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Demonstrating how AI decision support empowers small educational computer laboratories and non-profits to prepare, detect, contain, recover, and review cybersecurity incidents responsibly.
            </p>
          </div>

          <div className="bg-[#080d1a] border border-cyan-900/50 p-4 rounded-xl text-right font-mono text-xs">
            <div className="text-cyan-400 font-bold">Fictional Entity:</div>
            <div className="text-white font-semibold">Northstar Learning Labs</div>
            <div className="text-slate-500 text-[10px]">Educational Computer Facility</div>
          </div>
        </div>
      </div>

      {/* Evaluator Guided Tour Walkthrough */}
      <div className="bg-[#0e1629] border border-cyan-500/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-400" /> Evaluator Demonstration Checklist
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any milestone to jump directly into the feature module and test live functionality.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full">
            {completedCount} / {tourSteps.length} Milestones Tested
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tourSteps.map((step) => (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                step.completed
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-[#090e1c] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">
                    STEP 0{step.id}
                  </span>
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => toggleTourStep(step.id)}
                    className="w-4 h-4 rounded text-cyan-600 bg-slate-800 border-slate-700 cursor-pointer"
                  />
                </div>
                <h3 className="text-xs font-bold text-slate-100">{step.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
              </div>

              <button
                onClick={() => navigate(step.path)}
                className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between"
              >
                <span>Launch View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Core Project Narrative Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Problem Statement */}
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-lg space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" /> 1. Problem Statement
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Small organizations, educational computer labs, and student clubs face severe cybersecurity risks comparable to enterprise networks, but lack the resources to maintain full-time 24/7 Security Operations Centers (SOCs) or dedicated Tier-3 incident response retainers.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            When incidents occur (such as missing laptops, malware alerts, or student account takeovers), response actions are frequently ad-hoc, panic-driven, or damaging—such as pulling power cords and obliterating volatile forensic memory, failing to revoke cloud session tokens, or skipping formal lessons-learned reviews.
          </p>
        </div>

        {/* Section 2: Proposed Solution */}
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-lg space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" /> 2. SentinelX AI Solution Architecture
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            SentinelX AI bridges this capability gap by providing an intelligent, lightweight incident response command center grounded in the <strong>NIST SP 800-61 Rev. 3</strong> lifecycle: <em>PREPARE → DETECT → CONTAIN → RECOVER → REVIEW</em>.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            The platform combines interactive standardized SOP playbooks, real-time metrics tracking, tabletop scenario drills, dual-custody human approval checkpoints, and an AI Verification Safety Lab to prevent dangerous advice.
          </p>
        </div>
      </div>

      {/* Section 3: Technical Stack & Architecture */}
      <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-violet-400" /> 3. Technical Implementation & Architecture
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
          <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block font-mono">Frontend Core</strong>
            <p className="text-slate-400">React 19 + TypeScript + Vite for instant hot-reload and strict type safety.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block font-mono">Visual Design</strong>
            <p className="text-slate-400">Tailwind CSS dark cybersecurity palette with subtle glowing accents and print styles.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block font-mono">Analytics & Icons</strong>
            <p className="text-slate-400">Recharts for interactive velocity charts; Lucide React for consistent UI iconography.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block font-mono">Persistence & Storage</strong>
            <p className="text-slate-400">Robust LocalStorage repository layer with full JSON import/export and reset capability.</p>
          </div>
        </div>
      </div>

      {/* Section 4: Ethical AI & Safety Principles */}
      <div className="bg-[#0e1629] border border-violet-900/40 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-violet-400" /> 4. Responsible AI & Ethical Safety Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
            <strong className="text-violet-300 font-bold block text-sm">Human-in-the-Loop</strong>
            <p className="text-slate-400 leading-relaxed">
              AI provides decision support and synthesized recommendations, never authoritative unilateral action. Consequential commands (such as remote device wipes or account bans) strictly require Incident Commander signoff.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
            <strong className="text-violet-300 font-bold block text-sm">Privacy & Zero Data Leaks</strong>
            <p className="text-slate-400 leading-relaxed">
              Sensitive internal incident details or personal user records are never transmitted to public external AI providers. Deterministic local template engines provide rich offline guidance without network egress.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-2">
            <strong className="text-violet-300 font-bold block text-sm">Auditable Hallucination Checks</strong>
            <p className="text-slate-400 leading-relaxed">
              SentinelX incorporates the AI Verification Safety Lab to actively test outputs against known malicious patterns (e.g. hard power-offs) and verify citations against official NIST and CISA corpora.
            </p>
          </div>
        </div>
      </div>

      {/* Section 5: Limitations and Future Scope */}
      <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-6 shadow-xl space-y-3 text-xs text-slate-300">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          5. Project Limitations & Future Enhancements
        </h2>
        <ul className="space-y-1.5 list-disc pl-4 leading-relaxed text-slate-300">
          <li><strong>Simulated Telemetry:</strong> All demonstrated alerts, devices, and user logs are synthetic educational assets for Northstar Learning Labs.</li>
          <li><strong>Legal Advisory:</strong> Regulatory reporting guidance (e.g. CERT-In, FERPA, DPDP) represents structured procedural preparation and does not replace formal counsel.</li>
          <li><strong>Future Scope:</strong> Direct API connectors for Microsoft Defender for Endpoint, Intune Graph API, and Supabase Row-Level Security (RLS) backend synchronization.</li>
        </ul>
      </div>
    </div>
  );
};
