import React, { useState } from 'react';
import {
  BookMarked,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileText,
  AlertTriangle,
  Scale,
  Search,
  Filter,
  CheckCircle2,
  Info
} from 'lucide-react';
import { ResearchSource } from '../types';

interface KnowledgeResearchCenterProps {
  sources: ResearchSource[];
}

export const KnowledgeResearchCenter: React.FC<KnowledgeResearchCenterProps> = ({ sources }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredSources = sources.filter(src => {
    const matchesSearch =
      !searchQuery.trim() ||
      src.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.relevance.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || src.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              AUTHORITATIVE RESEARCH CORPUS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              100% Official Citations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Knowledge & Authoritative Research Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Verified standards from NIST, CISA, and CERT-In underpinning the SentinelX AI playbook architecture.
          </p>
        </div>
      </div>

      {/* Statutory Guidance Advisory Banner for CERT-In */}
      <div className="bg-[#101428] border border-amber-500/40 rounded-2xl p-5 text-xs text-slate-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Statutory & Regulatory Reporting Notice (CERT-In / DPDP Guidelines)</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Statutory reporting obligations under CERT-In Directions (Sub-Section (6) of Section 70B of the Information Technology Act, 2000) and applicable data protection statutes depend on the exact nature of the incident, affected data types, and organizational structure. In SentinelX AI, mandatory external notifications must always be verified and formally authorized by the designated <strong>Incident Commander</strong> and <strong>Legal Counsel</strong>.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search standards (e.g. NIST SP 800-61, CISA, FIDO2, CERT-In)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#080d1a] border border-[#1e2f52] rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['All', 'Framework', 'Regulatory', 'Federal Guidance', 'Technical Standard'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-[#080d1a] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Research Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSources.map((src) => (
          <div
            key={src.id}
            className="bg-[#0e1629] border border-[#1e2f52] hover:border-cyan-500/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.2 rounded">
                      {src.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {src.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {src.title}
                  </h3>
                </div>

                <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                <strong>Publisher:</strong> {src.publisher} • <strong>Date:</strong> {src.revisionDate}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {src.summary}
              </p>

              <div className="p-3 rounded-xl bg-[#090e1c] border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                  Relevance to SentinelX AI Project:
                </span>
                <p className="text-slate-300 leading-relaxed">{src.relevance}</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200 space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                  Compliance Considerations:
                </span>
                <p className="text-[11px] leading-relaxed text-slate-300">{src.complianceNotes}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">Official Government/Standard Source</span>
              <a
                href={src.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Access Source Document <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
