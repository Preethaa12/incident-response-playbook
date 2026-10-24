export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'New' | 'Investigating' | 'Contained' | 'Recovering' | 'Resolved';
export type IncidentPhase = 'PREPARE' | 'DETECT' | 'CONTAIN' | 'RECOVER' | 'REVIEW';

export type IncidentCategory =
  | 'Lost or Stolen Laptop'
  | 'Malware Alert'
  | 'Account Takeover'
  | 'Phishing'
  | 'Suspicious Login'
  | 'Data Exposure';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  phase: IncidentPhase;
  action: string;
  responsibleRole: string;
  outcome: string;
  notes: string;
}

export interface EvidenceReference {
  id: string;
  name: string;
  type: string;
  timestamp: string;
  hashOrNote: string;
  collectedBy: string;
}

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: Severity;
  status: IncidentStatus;
  currentPhase: IncidentPhase;
  description: string;
  affectedAsset: string;
  detectionTime: string; // ISO String
  acknowledgedTime?: string;
  containedTime?: string;
  resolvedTime?: string;
  assignedResponder: string;
  incidentCommander: string;
  actionsTaken: string[];
  evidenceReferences: EvidenceReference[];
  containmentStatus: string;
  recoveryStatus: string;
  resolutionSummary?: string;
  lessonsLearned?: string;
  timeline: TimelineEvent[];
}

export interface PlaybookStep {
  id: string;
  stepNumber: number;
  phase: IncidentPhase;
  title: string;
  description: string;
  procedureType: 'general' | 'approval_required';
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

export interface PlaybookDecisionPoint {
  id: string;
  question: string;
  options: {
    label: string;
    action: string;
    recommendation: string;
    escalate?: boolean;
  }[];
}

export interface Playbook {
  id: string;
  title: string;
  category: IncidentCategory;
  description: string;
  purpose: string;
  scope: string;
  triggerConditions: string[];
  severityCriteria: string;
  responsibleRoles: string[];
  steps: PlaybookStep[];
  decisionPoints: PlaybookDecisionPoint[];
  evidenceChecklist: string[];
  escalationConditions: string[];
  recoveryValidation: string[];
  communicationRequirements: string[];
  closureCriteria: string[];
  lessonsLearned: string[];
}

export interface Contact {
  id: string;
  role: string;
  name: string;
  responsibility: string;
  email: string;
  phone: string;
  contactMethod: string;
  escalationOrder: number;
  availabilityNotes: string;
  isExternal?: boolean;
}

export interface ChecklistItem {
  id: string;
  phase: IncidentPhase;
  title: string;
  description: string;
  isCompleted: boolean;
  requiresApproval: boolean;
  assignedRole: string;
}

export interface TabletopOption {
  id: string;
  text: string;
  consequences: string;
  points: number;
  feedbackType: 'optimal' | 'acceptable' | 'unsafe';
  rationale: string;
}

export interface TabletopStage {
  id: string;
  stageNumber: number;
  title: string;
  inject: string;
  timestamp: string;
  expectedActions: string[];
  discussionQuestions: string[];
  options: TabletopOption[];
  hint: string;
  facilitatorNotes: string;
}

export interface TabletopScenario {
  id: string;
  title: string;
  category: IncidentCategory;
  summary: string;
  targetAudience: string;
  estimatedDuration: string;
  facilitatorOverview: string;
  stages: TabletopStage[];
  scoringRubric: {
    maxPoints: number;
    thresholds: {
      min: number;
      grade: string;
      title: string;
      assessment: string;
      recommendations: string[];
    }[];
  };
}

export interface TabletopAttempt {
  scenarioId: string;
  currentStageIndex: number;
  selectedOptions: { stageId: string; optionId: string; points: number }[];
  totalScore: number;
  isFinished: boolean;
  startedAt: string;
  completedAt?: string;
  notes: string;
}

export interface IncidentReport {
  id: string;
  incidentId: string;
  incidentTitle: string;
  generatedAt: string;
  executiveSummary: string;
  incidentMetadata: {
    category: IncidentCategory;
    severity: Severity;
    status: IncidentStatus;
    detectionTime: string;
    containedTime?: string;
    resolvedTime?: string;
    leadResponder: string;
    incidentCommander: string;
  };
  detectionAndTimeline: string;
  affectedAssets: string;
  impactAssessment: string;
  responseActions: string;
  containment: string;
  recovery: string;
  communicationLog: string;
  evidenceReferences: string;
  rootCause: string;
  lessonsLearned: string;
  correctiveActionPlan: string;
  status: 'Draft' | 'Under Review' | 'Approved';
}

export interface CommunicationTemplate {
  id: string;
  title: string;
  subject: string;
  audience: string;
  purpose: string;
  body: string;
  placeholders: string[];
  guidance: string;
}

export interface ResearchSource {
  id: string;
  title: string;
  publisher: string;
  revisionDate: string;
  isVerified: boolean;
  summary: string;
  relevance: string;
  officialUrl: string;
  complianceNotes: string;
  category: 'Framework' | 'Regulatory' | 'Federal Guidance' | 'Technical Standard';
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: 'Triage' | 'Playbook' | 'Reporting' | 'Simulation' | 'Verification' | 'Ethics';
  objective: string;
  promptText: string;
  expectedOutputFormat: string;
  safetyConstraints: string;
  testStatus: 'Verified Safe' | 'Needs Review' | 'Flagged';
  observedLimitations: string;
  versionHistory: { version: string; date: string; change: string }[];
}

export interface VerificationCheck {
  id: string;
  name: string;
  category: string;
  passed: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}

export interface VerificationTestCase {
  id: string;
  title: string;
  category:
    | 'Hallucinated Sources'
    | 'Unsupported Claims'
    | 'Outdated Guidance'
    | 'Unsafe Containment'
    | 'Missing Escalation'
    | 'Privacy Risk'
    | 'Incomplete Recovery'
    | 'Missing Approval'
    | 'Overconfident Output';
  description: string;
  sampleInput: string;
  aiOutputSnippet: string;
  automatedChecks: VerificationCheck[];
  manualReview: {
    factualAccuracy: boolean | null;
    sourceValidity: boolean | null;
    operationalSafety: boolean | null;
    policyCompliance: boolean | null;
    notes: string;
    reviewedBy?: string;
  };
  status: 'Passed' | 'Failed' | 'Warning' | 'Pending Review';
  executedAt: string;
}

export interface AutomationStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp?: string;
  details: string;
}

export interface AutomationRun {
  id: string;
  timestamp: string;
  trigger: string;
  incidentId: string;
  incidentTitle: string;
  status: 'Pending Approval' | 'Approved' | 'Executed' | 'Failed';
  currentStepIndex: number;
  steps: AutomationStep[];
  outputReportPreview?: Partial<IncidentReport>;
  requiresHumanApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  retryCount: number;
}

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}
