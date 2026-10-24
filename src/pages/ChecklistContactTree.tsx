import React, { useState } from 'react';
import {
  CheckSquare,
  Users,
  Shield,
  Phone,
  Mail,
  Clock,
  Plus,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle2,
  Check,
  Building2,
  ExternalLink,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { ChecklistItem, Contact, IncidentPhase } from '../types';

interface ChecklistContactTreeProps {
  checklist: ChecklistItem[];
  contacts: Contact[];
  onToggleChecklist: (id: string) => void;
  onResetChecklist: () => void;
  onSaveContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
}

export const ChecklistContactTree: React.FC<ChecklistContactTreeProps> = ({
  checklist,
  contacts,
  onToggleChecklist,
  onResetChecklist,
  onSaveContact,
  onDeleteContact,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'contacts'>('checklist');
  const [phaseFilter, setPhaseFilter] = useState<string>('All');

  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [escalationOrder, setEscalationOrder] = useState(3);
  const [availabilityNotes, setAvailabilityNotes] = useState('');

  const completedCount = checklist.filter(c => c.isCompleted).length;
  const checklistPercent = Math.round((completedCount / Math.max(1, checklist.length)) * 100);

  const filteredChecklist = checklist.filter(item => {
    return phaseFilter === 'All' || item.phase === phaseFilter;
  });

  const sortedContacts = [...contacts].sort((a, b) => a.escalationOrder - b.escalationOrder);

  const openAddContactModal = () => {
    setEditingContact(null);
    setRole('');
    setName('');
    setEmail('');
    setPhone('');
    setResponsibility('');
    setContactMethod('Phone / Signal');
    setEscalationOrder(3);
    setAvailabilityNotes('Standard operating hours');
    setShowContactModal(true);
  };

  const openEditContactModal = (contact: Contact) => {
    setEditingContact(contact);
    setRole(contact.role);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
    setResponsibility(contact.responsibility);
    setContactMethod(contact.contactMethod);
    setEscalationOrder(contact.escalationOrder);
    setAvailabilityNotes(contact.availabilityNotes);
    setShowContactModal(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    onSaveContact({
      id: editingContact ? editingContact.id : `CNT-${Date.now().toString().slice(-4)}`,
      role: role.trim(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      responsibility: responsibility.trim(),
      contactMethod: contactMethod.trim(),
      escalationOrder: Number(escalationOrder),
      availabilityNotes: availabilityNotes.trim(),
    });

    setShowContactModal(false);
  };

  const exportContactsCSV = () => {
    const headers = ['Escalation Tier', 'Role', 'Name', 'Email', 'Phone', 'Contact Method', 'Responsibilities', 'Availability Notes'];
    const rows = sortedContacts.map(c => [
      c.escalationOrder,
      `"${c.role.replace(/"/g, '""')}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      c.email,
      c.phone,
      `"${c.contactMethod}"`,
      `"${c.responsibility.replace(/"/g, '""')}"`,
      `"${c.availabilityNotes.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', encodeURI(csvContent));
    dlAnchor.setAttribute('download', `northstar_ir_contact_tree_${Date.now()}.csv`);
    dlAnchor.click();
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              OPERATIONAL READINESS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Small Org IR Framework
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Response Checklist & Escalation Contact Tree
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Phased readiness checks and authorized personnel hierarchy for Northstar Learning Labs.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 bg-[#080d1a] border border-[#1e2f52] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'checklist'
                ? 'bg-cyan-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" /> Response Checklist
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'contacts'
                ? 'bg-cyan-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Contact Tree ({contacts.length})
          </button>
        </div>
      </div>

      {/* CHECKLIST VIEW */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {/* Progress Banner */}
          <div className="bg-[#0e1629] border border-[#1e2f52] rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                Checklist Completion Velocity
              </span>
              <div className="text-xl font-black text-white">
                {completedCount} of {checklist.length} Verified Actions ({checklistPercent}%)
              </div>
              <p className="text-xs text-slate-400">
                Covers NIST SP 800-61 Preparation through Blameless Post-Mortem.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onResetChecklist}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset All
              </button>
            </div>
          </div>

          {/* Phase Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'PREPARE', 'DETECT', 'CONTAIN', 'RECOVER', 'REVIEW'].map((p) => (
              <button
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border ${
                  phaseFilter === p
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-[#0e1629] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleChecklist(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  item.isCompleted
                    ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                    : item.requiresApproval
                    ? 'bg-[#12162a] border-amber-500/40 hover:border-amber-500 text-slate-200'
                    : 'bg-[#0e1629] border-[#1e2f52] hover:border-cyan-500/50 text-slate-200'
                }`}
              >
                <div className="pt-0.5 flex-shrink-0">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      item.isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-600 bg-slate-800'
                    }`}
                  >
                    {item.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {item.title}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {item.phase}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 pt-1">
                    <span>Role: {item.assignedRole}</span>
                    {item.requiresApproval && (
                      <span className="text-amber-400 font-bold uppercase">Approval Required</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTACT TREE VIEW */}
      {activeTab === 'contacts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Escalation order defines primary notification chain. Placeholder records are safe for demonstration.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={exportContactsCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1629] border border-[#1e2f52] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" /> Export CSV
              </button>
              <button
                onClick={openAddContactModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-glow-cyan transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Contact
              </button>
            </div>
          </div>

          {/* Contact Cards in Escalation Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  contact.isExternal
                    ? 'bg-[#121226] border-violet-500/40 shadow-glow-violet'
                    : contact.escalationOrder === 1
                    ? 'bg-[#141d33] border-cyan-500/50 shadow-glow-cyan'
                    : 'bg-[#0e1629] border-[#1e2f52]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-cyan-300 border border-slate-700">
                        Tier {contact.escalationOrder} Escalation
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5">{contact.name}</h3>
                      <div className="text-xs text-cyan-400 font-medium">{contact.role}</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditContactModal(contact)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                        title="Edit Contact"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete contact ${contact.name}?`)) {
                            onDeleteContact(contact.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-950/40 text-slate-400 hover:text-red-400"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {contact.responsibility}
                  </p>

                  <div className="space-y-1 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="font-mono text-[11px] truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="font-mono text-[11px]">{contact.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>{contact.contactMethod}</span>
                  <span className="text-slate-500">{contact.availabilityNotes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit / Add Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0d1527] border border-[#1e2f52] rounded-2xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">
                {editingContact ? 'Edit Contact Record' : 'Add Emergency Contact'}
              </h3>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Organizational Role</label>
                <input
                  type="text"
                  placeholder="e.g. Incident Commander / Lab Director"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email Address (Test)</label>
                  <input
                    type="email"
                    placeholder="user@northstarlabs.edu.test"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Escalation Tier (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={escalationOrder}
                    onChange={(e) => setEscalationOrder(Number(e.target.value))}
                    className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Primary Contact Method</label>
                  <input
                    type="text"
                    placeholder="e.g. Phone / Signal"
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Responsibilities & Authority</label>
                <textarea
                  rows={2}
                  placeholder="Summary of incident duties..."
                  value={responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Availability Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 24/7 on-call for Critical incidents"
                  value={availabilityNotes}
                  onChange={(e) => setAvailabilityNotes(e.target.value)}
                  className="w-full bg-[#080d1a] border border-[#1e2f52] rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-glow-cyan"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
