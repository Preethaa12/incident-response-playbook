import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  AlertOctagon,
  Bot,
  BookOpen,
  CheckSquare,
  Swords,
  FileText,
  Mail,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Zap,
  BarChart3,
  HelpCircle,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  Database,
  Building2
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  openIncidentCount: number;
  unverifiedTestCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  openIncidentCount,
  unverifiedTestCount,
}) => {
  const location = useLocation();

  const navigationSections = [
    {
      title: 'COMMAND CENTER',
      items: [
        { name: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Incident Management', path: '/incidents', icon: AlertOctagon, badge: openIncidentCount > 0 ? `${openIncidentCount} Open` : undefined, badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
        { name: 'AI Response Copilot', path: '/copilot', icon: Bot, isAi: true },
      ]
    },
    {
      title: 'PLAYBOOKS & RESPONSE',
      items: [
        { name: 'Playbook Library', path: '/playbooks', icon: BookOpen },
        { name: 'Checklist & Contact Tree', path: '/checklist', icon: CheckSquare },
        { name: 'Tabletop Simulator', path: '/tabletop', icon: Swords },
        { name: 'Report Generator', path: '/reports', icon: FileText },
        { name: 'Communications Center', path: '/communications', icon: Mail },
      ]
    },
    {
      title: 'AI SAFETY & GOVERNANCE',
      items: [
        { name: 'AI Safety & Verification', path: '/safety-lab', icon: ShieldCheck, badge: unverifiedTestCount > 0 ? `${unverifiedTestCount} Audit` : undefined, badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
        { name: 'Prompt Laboratory', path: '/prompts', icon: Sparkles },
        { name: 'Automation Studio', path: '/automation', icon: Zap },
        { name: 'Before/After Evaluation', path: '/evaluation', icon: BarChart3 },
      ]
    },
    {
      title: 'RESEARCH & LEARNING',
      items: [
        { name: 'Knowledge & Research', path: '/research', icon: BookMarked },
        { name: 'Incident Response Quiz', path: '/quiz', icon: HelpCircle },
        { name: 'Capstone Docs & Demo', path: '/documentation', icon: GraduationCap },
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#090e1c] border-r border-[#1a2947] flex flex-col transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1a2947]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-glow-cyan">
              <ShieldAlert className="w-5 h-5 text-white" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#090e1c]" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-base tracking-wide text-white truncate flex items-center gap-1.5">
                  SentinelX <span className="text-xs px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-mono border border-cyan-500/30">AI</span>
                </span>
                <span className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-cyan-400 flex-shrink-0" /> Northstar Labs
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-700/50"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed ? (
                <div className="px-3 text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
                  {sec.title}
                </div>
              ) : (
                <div className="h-2" />
              )}

              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/40 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-[#121c33]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-cyan-400'
                          : item.isAi
                          ? 'text-violet-400'
                          : 'text-slate-400 group-hover:text-cyan-300'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate flex-1">{item.name}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}

                    {collapsed && (
                      <div className="absolute left-full ml-2 hidden group-hover:flex px-2 py-1 bg-slate-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 border border-slate-700">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info: Fictional Organization & Demo Mode */}
        <div className="p-3 border-t border-[#1a2947] bg-[#070b16]">
          {!collapsed ? (
            <div className="bg-[#0e1629] border border-cyan-900/40 rounded-lg p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
                  <Database className="w-3 h-3 text-cyan-400 animate-pulse" /> DEMO STORAGE ACTIVE
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Northstar Learning Labs • LocalStorage Mode with deterministic safety guards.
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title="Local Demo Mode Active">
              <span className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
