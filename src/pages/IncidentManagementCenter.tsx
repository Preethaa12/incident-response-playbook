import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Download,
  FileSpreadsheet,
  ArrowUpDown,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Incident, IncidentCategory, IncidentPhase, IncidentStatus, Severity } from '../types';

interface IncidentManagementCenterProps {
  incidents: Incident[];
  onOpenNewIncidentModal: () => void;
}

export const IncidentManagementCenter: React.FC<IncidentManagementCenterProps> = ({
  incidents,
  onOpenNewIncidentModal,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters from query params or local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>(searchParams.get('severity') || 'All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || 'All');
  const [selectedPhase, setSelectedPhase] = useState<string>(searchParams.get('phase') || 'All');
  const [sortField, setSortField] = useState<'detectionTime' | 'severity' | 'status'>('detectionTime');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filter logic
  const filtered = useMemo(() => {
    return incidents.filter(inc => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.affectedAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.assignedResponder.toLowerCase().includes(searchQuery.toLowerCase());

      // Severity
      let matchesSeverity = true;
      if (selectedSeverity === 'high-critical') {
        matchesSeverity = inc.severity === 'Critical' || inc.severity === 'High';
      } else if (selectedSeverity !== 'All') {
        matchesSeverity = inc.severity.toLowerCase() === selectedSeverity.toLowerCase();
      }

      // Category
      const matchesCategory = selectedCategory === 'All' || inc.category === selectedCategory;

      // Status
      let matchesStatus = true;
      if (selectedStatus === 'open') {
        matchesStatus = inc.status !== 'Resolved';
      } else if (selectedStatus !== 'All') {
        matchesStatus = inc.status.toLowerCase() === selectedStatus.toLowerCase();
      }

      // Phase
      const matchesPhase = selectedPhase === 'All' || inc.currentPhase === selectedPhase;

      return matchesSearch && matchesSeverity && matchesCategory && matchesStatus && matchesPhase;
    });
  }, [incidents, searchQuery, selectedSeverity, selectedCategory, selectedStatus, selectedPhase]);

  // Sort logic
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortField === 'detectionTime') {
        const timeA = new Date(a.detectionTime).getTime();
        const timeB = new Date(b.detectionTime).getTime();
        return sortAsc ? timeA - timeB : timeB - timeA;
      }
      if (sortField === 'severity') {
        const order: { [key in Severity]: number } = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return sortAsc ? order[a.severity] - order[b.severity] : order[b.severity] - order[a.severity];
      }
      return sortAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
    });
  }, [filtered, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  // Export functions
  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `sentinelx_incidents_${Date.now()}.json`);
    dlAnchor.click();
  };

  const exportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Severity', 'Status', 'Current Phase', 'Asset', 'Detection Time', 'Responder', 'Commander'];
    const rows = filtered.map(i => [
      i.id,
      `"${i.title.replace(/"/g, '""')}"`,
      `"${i.category}"`,
      i.severity,
      i.status,
      i.currentPhase,
      `"${i.affectedAsset.replace(/"/g, '""')}"`,
      i.detectionTime,
      `"${i.assignedResponder}"`,
      `"${i.incidentCommander}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', encodeURI(csvContent));
    dlAnchor.setAttribute('download', `sentinelx_incidents_${Date.now()}.csv`);
    dlAnchor.click();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSeverity('All');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedPhase('All');
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              INCIDENT MANAGEMENT CENTER
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {filtered.length} of {incidents.length} recorded
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Security Incident Register
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Full lifecycle tracking: Detection, Containment, Evidence Preservation, and Review.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={exportJSON}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            title="Export filtered records as JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" /> JSON
          </button>
          <button
            onClick={exportCSV}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            title="Export filtered records as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> CSV
          </button>
          <button
            onClick={onOpenNewIncidentModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan transition-all"
          >
            <Plus className="w-4 h-4" /> Log Incident
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by Incident ID, Title, Asset, or Assigned Responder..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-[#080d1a] border border-[#1e2f52] rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Clear Filter */}
          {(searchQuery || selectedSeverity !== 'All' || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedPhase !== 'All') && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 px-3 py-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 transition-colors whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Severity */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
              Severity
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="high-critical">Critical & High Only</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Categories</option>
              <option value="Lost or Stolen Laptop">Lost or Stolen Laptop</option>
              <option value="Malware Alert">Malware Alert</option>
              <option value="Account Takeover">Account Takeover</option>
              <option value="Phishing">Phishing</option>
              <option value="Suspicious Login">Suspicious Login</option>
              <option value="Data Exposure">Data Exposure</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="open">Active / Open Only</option>
              <option value="New">New</option>
              <option value="Investigating">Investigating</option>
              <option value="Contained">Contained</option>
              <option value="Recovering">Recovering</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Phase */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
              NIST Phase
            </label>
            <select
              value={selectedPhase}
              onChange={(e) => {
                setSelectedPhase(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Phases</option>
              <option value="PREPARE">PREPARE</option>
              <option value="DETECT">DETECT</option>
              <option value="CONTAIN">CONTAIN</option>
              <option value="RECOVER">RECOVER</option>
              <option value="REVIEW">REVIEW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111c35] text-slate-400 font-mono uppercase tracking-wider border-b border-[#1e2f52]">
              <tr>
                <th
                  onClick={() => {
                    if (sortField === 'detectionTime') setSortAsc(!sortAsc);
                    else {
                      setSortField('detectionTime');
                      setSortAsc(false);
                    }
                  }}
                  className="px-4 py-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Incident ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Title & Asset</th>
                <th
                  onClick={() => {
                    if (sortField === 'severity') setSortAsc(!sortAsc);
                    else {
                      setSortField('severity');
                      setSortAsc(false);
                    }
                  }}
                  className="px-4 py-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Severity</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'status') setSortAsc(!sortAsc);
                    else {
                      setSortField('status');
                      setSortAsc(false);
                    }
                  }}
                  className="px-4 py-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5">NIST Phase</th>
                <th className="px-4 py-3.5">Assigned Responder</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#162344]">
              {paginated.length > 0 ? (
                paginated.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => navigate(`/incidents/${inc.id}`)}
                    className="hover:bg-[#121c33] cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-cyan-400 group-hover:underline">
                      {inc.id}
                    </td>

                    <td className="px-4 py-3.5 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                        {inc.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <span className="font-medium text-slate-400">{inc.category}</span>
                        <span>•</span>
                        <span className="truncate">{inc.affectedAsset}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wide border ${
                          inc.severity === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                            : inc.severity === 'High'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : inc.severity === 'Medium'
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          inc.status === 'Resolved'
                            ? 'text-emerald-400'
                            : inc.status === 'Contained'
                            ? 'text-indigo-400'
                            : inc.status === 'Investigating'
                            ? 'text-amber-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inc.status === 'Resolved'
                              ? 'bg-emerald-400'
                              : inc.status === 'Contained'
                              ? 'bg-indigo-400'
                              : 'bg-amber-400 animate-pulse'
                          }`}
                        />
                        {inc.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {inc.currentPhase}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-300">
                      <div className="truncate max-w-[140px]">{inc.assignedResponder}</div>
                      <div className="text-[10px] text-slate-500 truncate">{inc.incidentCommander}</div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/incidents/${inc.id}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600/30 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold inline-flex items-center gap-1 transition-all"
                      >
                        Manage <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">No matching incidents found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your search keywords or resetting filters.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 px-3 py-1.5 bg-slate-800 text-cyan-400 rounded-lg text-xs hover:bg-slate-700"
                    >
                      Reset All Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-[#111c35] border-t border-[#1e2f52] flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-200">{filtered.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-semibold text-slate-200">{Math.min(page * pageSize, filtered.length)}</span> of{' '}
            <span className="font-semibold text-slate-200">{filtered.length}</span> incidents
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-[#080d1a] border border-slate-700 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-[#080d1a] border border-slate-700 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
