import {
  Incident,
  Playbook,
  Contact,
  ChecklistItem,
  TabletopScenario,
  TabletopAttempt,
  IncidentReport,
  CommunicationTemplate,
  ResearchSource,
  PromptTemplate,
  VerificationTestCase,
  AutomationRun,
  IncidentPhase,
  IncidentStatus,
  TimelineEvent,
  EvidenceReference
} from '../types';
import {
  INITIAL_INCIDENTS,
  PLAYBOOKS,
  CONTACTS,
  RESPONSE_CHECKLIST_ITEMS,
  TABLETOP_SCENARIOS,
  COMMUNICATION_TEMPLATES,
  RESEARCH_SOURCES,
  PROMPT_TEMPLATES,
  VERIFICATION_TESTS,
} from '../data/seedData';

const STORAGE_KEYS = {
  INCIDENTS: 'sentinelx_incidents',
  PLAYBOOKS: 'sentinelx_playbooks',
  CONTACTS: 'sentinelx_contacts',
  CHECKLIST: 'sentinelx_checklist',
  ATTEMPTS: 'sentinelx_tabletop_attempts',
  REPORTS: 'sentinelx_incident_reports',
  TEMPLATES: 'sentinelx_comm_templates',
  PROMPTS: 'sentinelx_prompts',
  VERIFICATION_TESTS: 'sentinelx_verification_tests',
  AUTOMATIONS: 'sentinelx_automation_runs',
  SETTINGS: 'sentinelx_settings',
};

// Helper for local storage parsing with fallbacks
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading key "${key}" from localStorage:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing key "${key}" to localStorage:`, e);
  }
}

export const dataService = {
  // --- INCIDENTS ---
  getIncidents(): Incident[] {
    return getStored<Incident[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
  },

  getIncidentById(id: string): Incident | undefined {
    const incidents = this.getIncidents();
    return incidents.find(inc => inc.id === id);
  },

  createIncident(newIncident: Omit<Incident, 'id' | 'timeline' | 'evidenceReferences' | 'actionsTaken'> & { initialAction?: string }): Incident {
    const incidents = this.getIncidents();
    const nextNumber = incidents.length + 1;
    const padNum = String(nextNumber).padStart(4, '0');
    const id = `INC-2026-${padNum}`;

    const created: Incident = {
      ...newIncident,
      id,
      timeline: [
        {
          id: `TL-${Date.now()}-1`,
          timestamp: newIncident.detectionTime || new Date().toISOString(),
          phase: newIncident.currentPhase || 'DETECT',
          action: 'Incident Created & Registered',
          responsibleRole: newIncident.assignedResponder || 'Security Responder',
          outcome: 'Incident ticket initialized in SentinelX Command Center',
          notes: newIncident.initialAction || 'Initial ticket generation'
        }
      ],
      evidenceReferences: [],
      actionsTaken: newIncident.initialAction ? [newIncident.initialAction] : ['Incident logged in command center']
    };

    incidents.unshift(created);
    setStored(STORAGE_KEYS.INCIDENTS, incidents);
    return created;
  },

  updateIncident(id: string, updates: Partial<Incident>): Incident | null {
    const incidents = this.getIncidents();
    const idx = incidents.findIndex(inc => inc.id === id);
    if (idx === -1) return null;

    incidents[idx] = { ...incidents[idx], ...updates };
    setStored(STORAGE_KEYS.INCIDENTS, incidents);
    return incidents[idx];
  },

  deleteIncident(id: string): boolean {
    const incidents = this.getIncidents();
    const filtered = incidents.filter(inc => inc.id !== id);
    if (filtered.length !== incidents.length) {
      setStored(STORAGE_KEYS.INCIDENTS, filtered);
      return true;
    }
    return false;
  },

  addTimelineEvent(incidentId: string, event: Omit<TimelineEvent, 'id'>): TimelineEvent | null {
    const incidents = this.getIncidents();
    const incident = incidents.find(inc => inc.id === incidentId);
    if (!incident) return null;

    const newEvent: TimelineEvent = {
      ...event,
      id: `TL-${Date.now()}`
    };

    incident.timeline.unshift(newEvent);
    if (event.action && !incident.actionsTaken.includes(event.action)) {
      incident.actionsTaken.push(event.action);
    }
    setStored(STORAGE_KEYS.INCIDENTS, incidents);
    return newEvent;
  },

  addEvidence(incidentId: string, evidence: Omit<EvidenceReference, 'id'>): EvidenceReference | null {
    const incidents = this.getIncidents();
    const incident = incidents.find(inc => inc.id === incidentId);
    if (!incident) return null;

    const newEvidence: EvidenceReference = {
      ...evidence,
      id: `EVID-${Date.now()}`
    };

    incident.evidenceReferences.push(newEvidence);
    setStored(STORAGE_KEYS.INCIDENTS, incidents);
    return newEvidence;
  },

  updatePhase(incidentId: string, phase: IncidentPhase, role: string, notes: string): Incident | null {
    const incident = this.getIncidentById(incidentId);
    if (!incident) return null;

    const oldPhase = incident.currentPhase;
    incident.currentPhase = phase;

    // Track containment and resolution timestamps
    if (phase === 'CONTAIN' && !incident.containedTime) {
      incident.containedTime = new Date().toISOString();
    }
    if (phase === 'REVIEW' && !incident.resolvedTime) {
      incident.resolvedTime = new Date().toISOString();
      incident.status = 'Resolved';
    }

    this.addTimelineEvent(incidentId, {
      timestamp: new Date().toISOString(),
      phase,
      action: `Response Phase Transition: ${oldPhase} → ${phase}`,
      responsibleRole: role,
      outcome: `Phase updated to ${phase}`,
      notes: notes || `Operational state progressed to ${phase}`
    });

    return this.updateIncident(incidentId, incident);
  },

  updateStatus(incidentId: string, status: IncidentStatus, role: string, notes: string): Incident | null {
    const incident = this.getIncidentById(incidentId);
    if (!incident) return null;

    const oldStatus = incident.status;
    incident.status = status;

    if (status === 'Resolved' && !incident.resolvedTime) {
      incident.resolvedTime = new Date().toISOString();
      incident.currentPhase = 'REVIEW';
    }

    this.addTimelineEvent(incidentId, {
      timestamp: new Date().toISOString(),
      phase: incident.currentPhase,
      action: `Status Transition: ${oldStatus} → ${status}`,
      responsibleRole: role,
      outcome: `Incident status updated to ${status}`,
      notes: notes || `Status changed to ${status}`
    });

    return this.updateIncident(incidentId, incident);
  },

  // --- PLAYBOOKS ---
  getPlaybooks(): Playbook[] {
    return getStored<Playbook[]>(STORAGE_KEYS.PLAYBOOKS, PLAYBOOKS);
  },

  getPlaybookById(id: string): Playbook | undefined {
    return this.getPlaybooks().find(pb => pb.id === id);
  },

  togglePlaybookStep(playbookId: string, stepId: string, completedBy?: string, notes?: string): Playbook | null {
    const playbooks = this.getPlaybooks();
    const playbook = playbooks.find(pb => pb.id === playbookId);
    if (!playbook) return null;

    const step = playbook.steps.find(s => s.id === stepId);
    if (!step) return null;

    step.isCompleted = !step.isCompleted;
    step.completedAt = step.isCompleted ? new Date().toISOString() : undefined;
    step.completedBy = step.isCompleted ? (completedBy || 'Current Responder') : undefined;
    if (notes) step.notes = notes;

    setStored(STORAGE_KEYS.PLAYBOOKS, playbooks);
    return playbook;
  },

  resetPlaybook(playbookId: string): Playbook | null {
    const original = PLAYBOOKS.find(pb => pb.id === playbookId);
    if (!original) return null;

    const playbooks = this.getPlaybooks().map(pb => {
      if (pb.id === playbookId) {
        return JSON.parse(JSON.stringify(original));
      }
      return pb;
    });

    setStored(STORAGE_KEYS.PLAYBOOKS, playbooks);
    return original;
  },

  // --- RESPONSE CHECKLIST ---
  getChecklist(): ChecklistItem[] {
    return getStored<ChecklistItem[]>(STORAGE_KEYS.CHECKLIST, RESPONSE_CHECKLIST_ITEMS);
  },

  toggleChecklistItem(id: string): ChecklistItem[] {
    const items = this.getChecklist();
    const item = items.find(i => i.id === id);
    if (item) {
      item.isCompleted = !item.isCompleted;
      setStored(STORAGE_KEYS.CHECKLIST, items);
    }
    return items;
  },

  resetChecklist(): ChecklistItem[] {
    setStored(STORAGE_KEYS.CHECKLIST, RESPONSE_CHECKLIST_ITEMS);
    return RESPONSE_CHECKLIST_ITEMS;
  },

  // --- CONTACTS ---
  getContacts(): Contact[] {
    return getStored<Contact[]>(STORAGE_KEYS.CONTACTS, CONTACTS);
  },

  saveContact(contact: Contact): Contact {
    const contacts = this.getContacts();
    const idx = contacts.findIndex(c => c.id === contact.id);
    if (idx !== -1) {
      contacts[idx] = contact;
    } else {
      contacts.push(contact);
    }
    setStored(STORAGE_KEYS.CONTACTS, contacts);
    return contact;
  },

  deleteContact(id: string): boolean {
    const contacts = this.getContacts();
    const filtered = contacts.filter(c => c.id !== id);
    setStored(STORAGE_KEYS.CONTACTS, filtered);
    return filtered.length !== contacts.length;
  },

  // --- TABLETOP EXERCISES ---
  getScenarios(): TabletopScenario[] {
    return TABLETOP_SCENARIOS;
  },

  getScenarioById(id: string): TabletopScenario | undefined {
    return TABLETOP_SCENARIOS.find(s => s.id === id);
  },

  getAttempts(): TabletopAttempt[] {
    return getStored<TabletopAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
  },

  saveAttempt(attempt: TabletopAttempt): void {
    const attempts = this.getAttempts();
    const idx = attempts.findIndex(a => a.scenarioId === attempt.scenarioId);
    if (idx !== -1) {
      attempts[idx] = attempt;
    } else {
      attempts.push(attempt);
    }
    setStored(STORAGE_KEYS.ATTEMPTS, attempts);
  },

  // --- INCIDENT REPORTS ---
  getReports(): IncidentReport[] {
    return getStored<IncidentReport[]>(STORAGE_KEYS.REPORTS, []);
  },

  getReportById(id: string): IncidentReport | undefined {
    return this.getReports().find(r => r.id === id);
  },

  saveReport(report: IncidentReport): IncidentReport {
    const reports = this.getReports();
    const idx = reports.findIndex(r => r.id === report.id);
    if (idx !== -1) {
      reports[idx] = report;
    } else {
      reports.unshift(report);
    }
    setStored(STORAGE_KEYS.REPORTS, reports);
    return report;
  },

  generateReportDraft(incidentId: string): IncidentReport | null {
    const incident = this.getIncidentById(incidentId);
    if (!incident) return null;

    const timelineSummary = incident.timeline
      .map(t => `- [${new Date(t.timestamp).toLocaleTimeString()}] ${t.phase}: ${t.action} (${t.responsibleRole}) - ${t.notes}`)
      .join('\n');

    const actionsSummary = incident.actionsTaken.map(a => `1. ${a}`).join('\n');

    const evidenceSummary = incident.evidenceReferences.length > 0
      ? incident.evidenceReferences.map(e => `- ${e.name} (${e.type}) | Hash: ${e.hashOrNote} | Collected by: ${e.collectedBy}`).join('\n')
      : 'No formal digital evidence artifacts registered yet. Marked as Not Yet Assessed.';

    const draft: IncidentReport = {
      id: `REP-${incident.id}-${Date.now().toString().slice(-4)}`,
      incidentId: incident.id,
      incidentTitle: incident.title,
      generatedAt: new Date().toISOString(),
      executiveSummary: `On ${new Date(incident.detectionTime).toLocaleDateString()}, Northstar Learning Labs response team responded to a ${incident.severity}-severity ${incident.category} event affecting ${incident.affectedAsset}. The incident is currently ${incident.status} in phase ${incident.currentPhase}.`,
      incidentMetadata: {
        category: incident.category,
        severity: incident.severity,
        status: incident.status,
        detectionTime: incident.detectionTime,
        containedTime: incident.containedTime,
        resolvedTime: incident.resolvedTime,
        leadResponder: incident.assignedResponder,
        incidentCommander: incident.incidentCommander,
      },
      detectionAndTimeline: timelineSummary || 'Timeline logged in SentinelX incident management log.',
      affectedAssets: incident.affectedAsset || 'Asset details documented in registry.',
      impactAssessment: `Severity rated ${incident.severity}. Operational impact contained within educational laboratory boundaries. No public leak detected.`,
      responseActions: actionsSummary || '1. Initial triage completed.',
      containment: incident.containmentStatus || 'Host containment verified.',
      recovery: incident.recoveryStatus || 'Baseline re-image procedure staged.',
      communicationLog: `Notified Incident Commander (${incident.incidentCommander}) and Lead Responder (${incident.assignedResponder}). Stakeholder briefings staged.`,
      evidenceReferences: evidenceSummary,
      rootCause: incident.category === 'Malware Alert'
        ? 'User opened deceptive macro-enabled research document bypassing initial email heuristic filters.'
        : incident.category === 'Lost or Stolen Laptop'
        ? 'Physical asset unattended in open educational workshop venue.'
        : incident.category === 'Account Takeover'
        ? 'Repeated MFA push-fatigue attack targeting administrative identity.'
        : 'Root cause determination in progress. Preliminary evidence preserved.',
      lessonsLearned: incident.lessonsLearned || '1. Implement mandatory technical guardrails over human vigilance alone.\n2. Review out-of-band communication procedures regularly.',
      correctiveActionPlan: '1. Update group policy and endpoint configurations within 7 business days.\n2. Convene mandatory tabletop review session for lab assistants.\n3. Verify automated backup snapshots.',
      status: 'Draft'
    };

    return this.saveReport(draft);
  },

  // --- COMMUNICATION TEMPLATES ---
  getTemplates(): CommunicationTemplate[] {
    return getStored<CommunicationTemplate[]>(STORAGE_KEYS.TEMPLATES, COMMUNICATION_TEMPLATES);
  },

  getTemplateById(id: string): CommunicationTemplate | undefined {
    return this.getTemplates().find(t => t.id === id);
  },

  updateTemplate(template: CommunicationTemplate): void {
    const templates = this.getTemplates();
    const idx = templates.findIndex(t => t.id === template.id);
    if (idx !== -1) {
      templates[idx] = template;
      setStored(STORAGE_KEYS.TEMPLATES, templates);
    }
  },

  // --- RESEARCH SOURCES ---
  getSources(): ResearchSource[] {
    return RESEARCH_SOURCES;
  },

  // --- PROMPT LABORATORY ---
  getPrompts(): PromptTemplate[] {
    return getStored<PromptTemplate[]>(STORAGE_KEYS.PROMPTS, PROMPT_TEMPLATES);
  },

  savePrompt(prompt: PromptTemplate): void {
    const prompts = this.getPrompts();
    const idx = prompts.findIndex(p => p.id === prompt.id);
    if (idx !== -1) {
      prompts[idx] = prompt;
    } else {
      prompts.push(prompt);
    }
    setStored(STORAGE_KEYS.PROMPTS, prompts);
  },

  // --- VERIFICATION SAFETY LAB ---
  getVerificationTests(): VerificationTestCase[] {
    return getStored<VerificationTestCase[]>(STORAGE_KEYS.VERIFICATION_TESTS, VERIFICATION_TESTS);
  },

  updateManualReview(testId: string, review: VerificationTestCase['manualReview']): void {
    const tests = this.getVerificationTests();
    const test = tests.find(t => t.id === testId);
    if (test) {
      test.manualReview = review;
      test.status = (review.factualAccuracy && review.operationalSafety && review.sourceValidity) ? 'Passed' : 'Failed';
      setStored(STORAGE_KEYS.VERIFICATION_TESTS, tests);
    }
  },

  runAutomatedChecks(testId: string): VerificationTestCase | null {
    const tests = this.getVerificationTests();
    const test = tests.find(t => t.id === testId);
    if (!test) return null;

    test.executedAt = new Date().toISOString();
    // Automated heuristic evaluation
    const hasUnsafePower = /unplug|power cord|pull the plug/i.test(test.aiOutputSnippet);
    const hasHallucinatedStandard = /NIST SP 800-999|RFC 99999/i.test(test.aiOutputSnippet);
    const hasHumanApproval = /Requires Commander Signoff|Approval Required|human approval/i.test(test.aiOutputSnippet);

    test.automatedChecks.forEach(check => {
      if (check.name.includes('Volatile Memory')) {
        check.passed = !hasUnsafePower;
      } else if (check.name.includes('NIST') || check.name.includes('Corpus')) {
        check.passed = !hasHallucinatedStandard;
      } else if (check.name.includes('Human Approval')) {
        check.passed = hasHumanApproval;
      }
    });

    const anyFail = test.automatedChecks.some(c => !c.passed);
    test.status = anyFail ? 'Failed' : 'Passed';
    setStored(STORAGE_KEYS.VERIFICATION_TESTS, tests);
    return test;
  },

  runAllVerificationChecks(): VerificationTestCase[] {
    const tests = this.getVerificationTests();
    tests.forEach(t => this.runAutomatedChecks(t.id));
    return this.getVerificationTests();
  },

  // --- AUTOMATION STUDIO ---
  getAutomations(): AutomationRun[] {
    return getStored<AutomationRun[]>(STORAGE_KEYS.AUTOMATIONS, [
      {
        id: 'AUTO-2026-001',
        timestamp: '2026-10-23T19:05:00Z',
        trigger: 'Incident Form Submission (INC-2026-0401)',
        incidentId: 'INC-2026-0401',
        incidentTitle: 'Lab Laptop #14 Missing After Weekend Robotics Workshop',
        status: 'Executed',
        currentStepIndex: 5,
        steps: [
          { name: '1. Incident Form Submission', status: 'completed', timestamp: '19:05:01Z', details: 'Form payload validated against Zod schema' },
          { name: '2. Input Sanitization & Classification', status: 'completed', timestamp: '19:05:02Z', details: 'Assessed severity High, category Lost or Stolen Laptop' },
          { name: '3. Incident Record Creation', status: 'completed', timestamp: '19:05:03Z', details: 'Created record INC-2026-0401 in repository' },
          { name: '4. Structured Incident Report Synthesis', status: 'completed', timestamp: '19:05:05Z', details: 'Generated draft report REP-INC-2026-0401' },
          { name: '5. Human Approval Checkpoint', status: 'completed', timestamp: '19:10:00Z', details: 'Approved by Dr. Sarah Chen (Incident Commander)' },
          { name: '6. Report Export & Distribution Staging', status: 'completed', timestamp: '19:10:05Z', details: 'Prepared audit JSON and PDF print layout' }
        ],
        requiresHumanApproval: true,
        approvedBy: 'Dr. Sarah Chen (Lab Director)',
        approvedAt: '2026-10-23T19:10:00Z',
        retryCount: 0
      }
    ]);
  },

  triggerAutomation(incidentId: string): AutomationRun {
    const incident = this.getIncidentById(incidentId);
    const title = incident ? incident.title : 'Manual Automation Run';

    const newRun: AutomationRun = {
      id: `AUTO-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      trigger: `Automated Pipeline Triggered for ${incidentId}`,
      incidentId,
      incidentTitle: title,
      status: 'Pending Approval',
      currentStepIndex: 3,
      steps: [
        { name: '1. Incident Form Submission', status: 'completed', timestamp: new Date().toLocaleTimeString(), details: 'Input payload verified' },
        { name: '2. Input Sanitization & Classification', status: 'completed', timestamp: new Date().toLocaleTimeString(), details: 'Classified using deterministic IR rule engine' },
        { name: '3. Incident Record Creation', status: 'completed', timestamp: new Date().toLocaleTimeString(), details: `Persisted to state registry (${incidentId})` },
        { name: '4. Structured Report Synthesis', status: 'completed', timestamp: new Date().toLocaleTimeString(), details: 'Synthesized executive summary and timeline' },
        { name: '5. Human Approval Checkpoint', status: 'pending', details: 'Awaiting Incident Commander review and signature' },
        { name: '6. Report Export & Dispatch', status: 'pending', details: 'Will generate export bundle once approved' }
      ],
      outputReportPreview: incident ? {
        incidentId: incident.id,
        incidentTitle: incident.title,
        executiveSummary: `Automated draft generated for ${incident.title}. Asset: ${incident.affectedAsset}.`,
        impactAssessment: `Calculated severity: ${incident.severity}. Response phase: ${incident.currentPhase}.`
      } : undefined,
      requiresHumanApproval: true,
      retryCount: 0
    };

    const automations = this.getAutomations();
    automations.unshift(newRun);
    setStored(STORAGE_KEYS.AUTOMATIONS, automations);
    return newRun;
  },

  approveAutomation(runId: string, approverName: string): AutomationRun | null {
    const automations = this.getAutomations();
    const run = automations.find(r => r.id === runId);
    if (!run) return null;

    run.status = 'Executed';
    run.approvedBy = approverName || 'Dr. Sarah Chen (Lab Director)';
    run.approvedAt = new Date().toISOString();
    run.currentStepIndex = 5;

    run.steps[4].status = 'completed';
    run.steps[4].timestamp = new Date().toLocaleTimeString();
    run.steps[4].details = `Approved by ${run.approvedBy}`;

    run.steps[5].status = 'completed';
    run.steps[5].timestamp = new Date().toLocaleTimeString();
    run.steps[5].details = 'Export bundle ready for download and distribution';

    setStored(STORAGE_KEYS.AUTOMATIONS, automations);
    return run;
  },

  // --- SYSTEM UTILITIES ---
  resetAllDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
    localStorage.removeItem(STORAGE_KEYS.PLAYBOOKS);
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.CHECKLIST);
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
    localStorage.removeItem(STORAGE_KEYS.PROMPTS);
    localStorage.removeItem(STORAGE_KEYS.VERIFICATION_TESTS);
    localStorage.removeItem(STORAGE_KEYS.AUTOMATIONS);
  },

  exportAllDataJSON(): string {
    const bundle = {
      exportedAt: new Date().toISOString(),
      organization: 'Northstar Learning Labs',
      system: 'SentinelX AI Command Center',
      version: '1.0.0',
      incidents: this.getIncidents(),
      playbooks: this.getPlaybooks(),
      contacts: this.getContacts(),
      checklist: this.getChecklist(),
      reports: this.getReports(),
      automations: this.getAutomations(),
      verificationTests: this.getVerificationTests(),
    };
    return JSON.stringify(bundle, null, 2);
  },

  importDataJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.incidents) setStored(STORAGE_KEYS.INCIDENTS, data.incidents);
      if (data.playbooks) setStored(STORAGE_KEYS.PLAYBOOKS, data.playbooks);
      if (data.contacts) setStored(STORAGE_KEYS.CONTACTS, data.contacts);
      if (data.checklist) setStored(STORAGE_KEYS.CHECKLIST, data.checklist);
      if (data.reports) setStored(STORAGE_KEYS.REPORTS, data.reports);
      return true;
    } catch (e) {
      console.error('Failed to parse imported JSON data:', e);
      return false;
    }
  }
};
