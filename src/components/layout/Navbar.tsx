import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  RefreshCw,
  Download,
  Upload,
  User,
  Shield,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCode2
} from 'lucide-react';
import { Incident } from '../../types';

interface NavbarProps {
  collapsed: boolean;
  setMobileOpen: (v: boolean) => void;
  incidents: Incident[];
  onOpenNewIncidentModal: () => void;
  onResetDemoData: () => void;
  onExportData: () => void;
  onImportData: (data: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  collapsed,
  setMobileOpen,
  incidents,
  onOpenNewIncidentModal,
  onResetDemoData,
  onExportData,
  onImportData,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter items for search
  const filteredIncidents = searchQuery.trim()
    ? incidents.filter(
        inc =>
          inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const quickTools = [
    { title: 'AI Response Copilot', path: '/copilot', desc: 'Interactive incident triage & recommendations' },
    { title: 'Playbook: Lost or Stolen Laptop', path: '/playbooks', desc: 'Remote lock & session revocation SOP' },
    { title: 'Playbook: Malware Alert', path: '/playbooks', desc: 'Host isolation & volatile RAM preservation' },
    { title: 'Playbook: Account Takeover', path: '/playbooks', desc: 'MFA fatigue containment & FIDO2 upgrade' },
    { title: 'Tabletop Simulator', path: '/tabletop', desc: 'Scenario drills with consequence trees' },
    { title: 'AI Verification Safety Lab', path: '/safety-lab', desc: 'Audit AI outputs for hallucinations' },
    { title: 'Automation Studio', path: '/automation', desc: 'Trigger automated report workflow' },
  ].filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImportData(content);
          setDemoMenuOpen(false);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-40 h-16 bg-[#080d1a]/90 backdrop-blur-md border-b border-[#1a2947] flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${
        collapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-72'
      }`}
    >
      {/* Left side: Hamburger + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search incidents, playbooks, tools, or SOPs (Press /)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-9 pr-8 py-1.5 bg-[#0e1629] border border-[#1e2f52] rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setSearchFocused(false)}
              />
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#0e1629] border border-cyan-500/40 rounded-xl shadow-2xl p-3 z-20 max-h-96 overflow-y-auto space-y-3">
                {filteredIncidents.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-1.5 px-2 font-semibold">
                      Incidents ({filteredIncidents.length})
                    </div>
                    <div className="space-y-1">
                      {filteredIncidents.map((inc) => (
                        <div
                          key={inc.id}
                          onClick={() => {
                            navigate(`/incidents/${inc.id}`);
                            setSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="p-2 rounded-lg hover:bg-slate-800/70 cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="truncate mr-2">
                            <span className="font-mono text-cyan-400 mr-2">{inc.id}</span>
                            <span className="text-slate-200">{inc.title}</span>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                              inc.severity === 'Critical'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : inc.severity === 'High'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            }`}
                          >
                            {inc.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {quickTools.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-1.5 px-2 font-semibold">
                      Tools & Playbooks
                    </div>
                    <div className="space-y-1">
                      {quickTools.map((t, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            navigate(t.path);
                            setSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="p-2 rounded-lg hover:bg-slate-800/70 cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <div className="font-medium text-slate-200">{t.title}</div>
                            <div className="text-[11px] text-slate-400">{t.desc}</div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredIncidents.length === 0 && quickTools.length === 0 && (
                  <div className="text-center py-4 text-xs text-slate-400">
                    No results found for "{searchQuery}". Try searching for "malware", "laptop", or "copilot".
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side: Demo Indicator, Action Button, Notification, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Demo Data Indicator */}
        <div className="relative">
          <button
            onClick={() => setDemoMenuOpen(!demoMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors shadow-sm"
            title="Click to manage demo data"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">DEMO DATA</span>
          </button>

          {demoMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDemoMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#0e1629] border border-[#1e2f52] rounded-xl shadow-2xl p-3 z-20 space-y-2 text-xs">
                <div className="pb-2 border-b border-slate-700 font-semibold text-slate-200 flex items-center justify-between">
                  <span>Demo State Management</span>
                  <span className="text-[10px] text-cyan-400 font-mono">v1.0</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  SentinelX is running in fully interactive client mode for Northstar Learning Labs. Changes persist in your browser.
                </p>

                <div className="pt-1 space-y-1">
                  <button
                    onClick={() => {
                      onExportData();
                      setDemoMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 text-left transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Application JSON
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 text-left transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" /> Import JSON Backup
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  <button
                    onClick={() => {
                      if (window.confirm('Reset all demo incidents, playbooks, and tabletop attempts to pristine laboratory defaults?')) {
                        onResetDemoData();
                        setDemoMenuOpen(false);
                      }
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-950/60 text-red-400 text-left transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-red-400" /> Reset to Default State
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Create Incident Button */}
        <button
          onClick={onOpenNewIncidentModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-glow-cyan transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Log Incident</span>
        </button>

        {/* Notification Center */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#080d1a]" />
          </button>

          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#0e1629] border border-[#1e2f52] rounded-xl shadow-2xl p-3 z-20 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="font-semibold text-slate-200">Incident Activity Feed</span>
                  <span className="text-[10px] font-mono text-cyan-400">Live Telemetry</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 flex gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-slate-200 font-medium">INC-2026-0401 Missing Laptop</div>
                      <div className="text-[11px] text-slate-400">MDM remote lock dispatched; 24h search gate active.</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">25m ago</div>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 flex gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-slate-200 font-medium">INC-2026-0388 Malware Workstation 07</div>
                      <div className="text-[11px] text-slate-400">Workstation re-imaged from golden MDT image; verified clean.</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">Yesterday</div>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 flex gap-2.5">
                    <FileCode2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-slate-200 font-medium">Automation Pipeline Ran</div>
                      <div className="text-[11px] text-slate-400">Generated report draft REP-INC-2026-0401 for review.</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">2h ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold text-xs">
              SC
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 truncate leading-tight">Dr. Sarah Chen</span>
              <span className="text-[10px] text-cyan-400 truncate leading-tight">Incident Commander</span>
            </div>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#0e1629] border border-[#1e2f52] rounded-xl shadow-2xl p-3 z-20 space-y-2 text-xs">
                <div className="pb-2 border-b border-slate-700">
                  <div className="font-semibold text-slate-200">Dr. Sarah Chen</div>
                  <div className="text-[11px] text-slate-400">schen@northstarlabs.edu.test</div>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Shield className="w-3 h-3" /> Incident Commander / Director
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <div><strong>Organization:</strong> Northstar Learning Labs</div>
                  <div><strong>MFA Status:</strong> FIDO2 Hardware Key Active</div>
                  <div><strong>Authority:</strong> Full Escalation & Remote Wipe</div>
                </div>

                <div className="pt-1 border-t border-slate-700/60">
                  <button
                    onClick={() => {
                      navigate('/checklist');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left text-cyan-400 hover:text-cyan-300 text-xs py-1"
                  >
                    View Contact Directory →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
