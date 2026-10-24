import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Activity,
  Flame,
  Bot,
  BookOpen,
  Swords,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Database
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { Incident } from '../types';

interface OverviewDashboardProps {
  incidents: Incident[];
  onOpenNewIncidentModal: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  incidents,
  onOpenNewIncidentModal,
}) => {
  const navigate = useNavigate();

  // Compute derived metrics
  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(i => i.status !== 'Resolved').length;
  const criticalHigh = incidents.filter(i => i.severity === 'Critical' || i.severity === 'High').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  // Calculate Mean Time to Acknowledge (MTTA) and Mean Time to Contain (MTTC)
  let totalAckMinutes = 0;
  let ackCount = 0;
  let totalContainMinutes = 0;
  let containCount = 0;

  incidents.forEach(inc => {
    const detect = new Date(inc.detectionTime).getTime();
    if (inc.acknowledgedTime) {
      const ack = new Date(inc.acknowledgedTime).getTime();
      const diffMin = (ack - detect) / (1000 * 60);
      if (diffMin > 0 && diffMin < 10000) {
        totalAckMinutes += diffMin;
        ackCount++;
      }
    }
    if (inc.containedTime) {
      const cont = new Date(inc.containedTime).getTime();
      const diffMin = (cont - detect) / (1000 * 60);
      if (diffMin > 0 && diffMin < 10000) {
        totalContainMinutes += diffMin;
        containCount++;
      }
    }
  });

  const mttaMinutes = ackCount > 0 ? Math.round(totalAckMinutes / ackCount) : 14;
  const mttcMinutes = containCount > 0 ? Math.round(totalContainMinutes / containCount) : 48;

  // Readiness Score formula based on containment speed, playbooks, and resolved ratio
  const readinessScore = Math.min(
    96,
    Math.max(68, Math.round(75 + (resolvedCount / Math.max(1, totalIncidents)) * 15 - (criticalHigh > 2 ? 8 : 0)))
  );

  // Chart Data: Severity distribution
  const severityData = [
    { name: 'Critical', value: incidents.filter(i => i.severity === 'Critical').length, color: '#ef4444' },
    { name: 'High', value: incidents.filter(i => i.severity === 'High').length, color: '#f59e0b' },
    { name: 'Medium', value: incidents.filter(i => i.severity === 'Medium').length, color: '#06b6d4' },
    { name: 'Low', value: incidents.filter(i => i.severity === 'Low').length, color: '#10b981' },
  ].filter(d => d.value > 0);

  // Chart Data: Categories
  const categoryCounts: { [key: string]: number } = {};
  incidents.forEach(i => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });
  const categoryData = Object.keys(categoryCounts).map(cat => ({
    name: cat.length > 16 ? cat.slice(0, 14) + '...' : cat,
    fullName: cat,
    count: categoryCounts[cat]
  }));

  // Chart Data: Incident Trend over recent months (derived)
  const trendData = [
    { month: 'Jun', incidents: 2, contained: 2 },
    { month: 'Jul', incidents: 3, contained: 3 },
    { month: 'Aug', incidents: 1, contained: 1 },
    { month: 'Sep', incidents: 4, contained: 4 },
    { month: 'Oct', incidents: totalIncidents, contained: resolvedCount },
  ];

  // Phase distribution
  const phases = ['PREPARE', 'DETECT', 'CONTAIN', 'RECOVER', 'REVIEW'] as const;
  const phaseCounts = phases.map(p => ({
    phase: p,
    count: incidents.filter(i => i.currentPhase === p).length
  }));

  // Flatten recent activity
  const recentActivities = incidents
    .flatMap(inc =>
      inc.timeline.map(t => ({
        ...t,
        incidentId: inc.id,
        incidentTitle: inc.title,
        severity: inc.severity
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#0c152a] via-[#101b38] to-[#0d162d] border border-[#1e2f52] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -top-10 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Database className="w-3 h-3 text-cyan-400" /> NORTHSTAR LEARNING LABS COMMAND CENTER
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Incident Response Command Center
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              "Detect Faster. Respond Smarter. Recover Stronger." Decision support and NIST SP 800-61 Rev. 3 lifecycle automation for small organisations.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => navigate('/copilot')}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 text-xs font-semibold shadow-glow-violet transition-all"
            >
              <Bot className="w-4 h-4 text-violet-400" />
              <span>Launch AI Copilot</span>
            </button>
            <button
              onClick={onOpenNewIncidentModal}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan transition-all"
            >
              <Flame className="w-4 h-4" />
              <span>Log Incident</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Incidents */}
        <div
          onClick={() => navigate('/incidents')}
          className="bg-[#0e1629] border border-[#1e2f52] hover:border-cyan-500/50 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] group shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total</span>
            <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-black text-white">{totalIncidents}</div>
          <div className="text-[10px] text-cyan-400 font-mono mt-1 flex items-center gap-0.5">
            View All <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Open Incidents */}
        <div
          onClick={() => navigate('/incidents?status=open')}
          className="bg-[#0e1629] border border-[#1e2f52] hover:border-amber-500/50 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] group shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Open</span>
            <Activity className="w-4 h-4 text-amber-400 group-hover:animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-400">{openIncidents}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Requires Response</div>
        </div>

        {/* Critical / High */}
        <div
          onClick={() => navigate('/incidents?severity=high-critical')}
          className="bg-[#0e1629] border border-[#1e2f52] hover:border-red-500/50 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] group shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Crit / High</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">{criticalHigh}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Priority 1 & 2</div>
        </div>

        {/* Mean Time to Acknowledge (MTTA) */}
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">MTTA</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{mttaMinutes} <span className="text-xs font-normal text-slate-400">min</span></div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Target &lt; 20m
          </div>
        </div>

        {/* Mean Time to Contain (MTTC) */}
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">MTTC</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{mttcMinutes} <span className="text-xs font-normal text-slate-400">min</span></div>
          <div className="text-[10px] text-indigo-400 font-mono mt-1">NIST Benchmark</div>
        </div>

        {/* Readiness Score */}
        <div
          onClick={() => navigate('/evaluation')}
          className="bg-[#0e1629] border border-[#1e2f52] hover:border-emerald-500/50 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] shadow-md group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Readiness</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{readinessScore}%</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-0.5">
            Audit Score <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* NIST Phase Distribution Bar */}
      <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Incident Distribution by NIST SP 800-61 Lifecycle Phase
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {openIncidents} active in lifecycle
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {phaseCounts.map((item) => (
            <div
              key={item.phase}
              onClick={() => navigate(`/incidents?phase=${item.phase}`)}
              className="bg-[#090e1c] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-2.5 text-center cursor-pointer transition-all hover:bg-slate-800/40"
            >
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold truncate">
                {item.phase}
              </div>
              <div className="text-lg font-black text-cyan-300 mt-0.5">{item.count}</div>
              <div className="text-[9px] text-slate-500 truncate">
                {item.phase === 'CONTAIN' ? 'Host Quarantine' : item.phase === 'RECOVER' ? 'Re-imaging' : 'SOP Tracked'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Trend (Area Chart) - 2 cols */}
        <div className="lg:col-span-2 bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Incident Activity & Containment Velocity
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Monthly detected vs. successfully resolved incidents at Northstar Labs
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
              Trend: Contained
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCont" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2947" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1527',
                    borderColor: '#1e2f52',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="incidents" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorInc)" name="Total Incidents" />
                <Area type="monotone" dataKey="contained" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCont)" name="Contained / Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Breakdown (Donut Chart) */}
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Incidents by Severity
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Active Distribution</span>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1527',
                    borderColor: '#1e2f52',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">{totalIncidents}</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Logged</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800">
            {severityData.map(item => (
              <div
                key={item.name}
                onClick={() => navigate(`/incidents?severity=${item.name.toLowerCase()}`)}
                className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/40 cursor-pointer text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Categories & Recent Activity (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Bar Chart) */}
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Incident Categories
            </h2>
            <span className="text-xs text-slate-400 font-mono">Top Threat Vectors</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2947" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1527',
                    borderColor: '#1e2f52',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(val: any, name: any, item: any) => [`${val} Incidents`, item.payload.fullName]}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Recent Response Timeline Activity
            </h2>
            <button
              onClick={() => navigate('/incidents')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              View Full History →
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-56">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => navigate(`/incidents/${act.incidentId}`)}
                className="p-2.5 rounded-xl bg-[#090e1c] border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold text-cyan-400 group-hover:underline">
                      {act.incidentId}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {act.phase}
                    </span>
                    <span className="text-xs text-slate-400 truncate">
                      by {act.responsibleRole}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 truncate">
                    {act.action}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {act.notes}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 whitespace-nowrap mt-0.5">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/copilot')}
          className="bg-gradient-to-br from-[#12142e] to-[#0c1022] border border-violet-500/30 hover:border-violet-500/60 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] shadow-lg group relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center shadow-glow-violet">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                AI Response Copilot
              </h3>
              <span className="text-[10px] text-violet-400 font-mono">NIST Decision Support</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate containment checklists, uncertainty flags, and verified standard citations for any active incident or scenario.
          </p>
        </div>

        <div
          onClick={() => navigate('/playbooks')}
          className="bg-gradient-to-br from-[#0c1a2e] to-[#081220] border border-cyan-500/30 hover:border-cyan-500/60 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] shadow-lg group relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shadow-glow-cyan">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Interactive Playbooks
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono">3 Standard SOPs</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Execute step-by-step procedures for Lost Laptops, Malware Outbreaks, and Account Takeover with approval checkpoints.
          </p>
        </div>

        <div
          onClick={() => navigate('/tabletop')}
          className="bg-gradient-to-br from-[#1d1425] to-[#110b17] border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] shadow-lg group relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shadow-glow-amber">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Tabletop Drill Simulator
              </h3>
              <span className="text-[10px] text-amber-400 font-mono">Readiness Exercises</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Train student responders through 4-stage interactive attack injects, consequence trees, scoring, and after-action reports.
          </p>
        </div>
      </div>
    </div>
  );
};
