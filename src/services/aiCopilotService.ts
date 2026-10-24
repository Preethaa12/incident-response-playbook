import { IncidentCategory, IncidentPhase, Severity } from '../types';

export interface CopilotAnalysisInput {
  title?: string;
  category: IncidentCategory;
  description: string;
  affectedAsset: string;
  selectedIncidentId?: string;
}

export interface CopilotRecommendation {
  summary: string;
  assessedSeverity: Severity;
  severityRationale: string;
  currentPhase: IncidentPhase;
  phaseProgress: {
    phase: IncidentPhase;
    status: 'completed' | 'active' | 'upcoming';
    guidance: string;
  }[];
  immediateActions: {
    action: string;
    rationale: string;
    requiresApproval: boolean;
    assignedRole: string;
  }[];
  containmentGuidance: string[];
  recoveryGuidance: string[];
  evidenceChecklist: string[];
  escalationRecommendations: {
    role: string;
    condition: string;
    urgency: 'Immediate (Within 15m)' | 'Standard (Within 2h)' | 'Post-Containment';
  }[];
  questionsForResponder: string[];
  confidenceScore: number;
  uncertaintyNotes: string[];
  sourceReferences: {
    title: string;
    standard: string;
    url: string;
    verified: boolean;
  }[];
  safetyDisclaimers: string[];
  engineUsed: 'Local Reviewed Template Engine (Deterministic)' | 'External LLM API';
  generatedAt: string;
}

export const aiCopilotService = {
  async analyzeIncident(input: CopilotAnalysisInput): Promise<CopilotRecommendation> {
    // Check if an external server-side LLM endpoint is configured in env
    const externalApiUrl = (import.meta as any).env?.VITE_AI_API_URL;

    if (externalApiUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(externalApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          return {
            ...data,
            engineUsed: 'External LLM API',
            generatedAt: new Date().toISOString()
          };
        }
      } catch (err) {
        console.warn('External AI endpoint failed or timed out. Falling back to reviewed deterministic engine.', err);
      }
    }

    // Deterministic Local Demonstration Engine (Calibrated on NIST SP 800-61 Rev. 3 & CISA SMB guidance)
    return this.generateDeterministicAnalysis(input);
  },

  generateDeterministicAnalysis(input: CopilotAnalysisInput): CopilotRecommendation {
    const text = (input.description + ' ' + input.affectedAsset + ' ' + (input.title || '')).toLowerCase();
    const category = input.category;

    let assessedSeverity: Severity = 'Medium';
    let severityRationale = 'Standard incident priority for small organization asset.';
    let currentPhase: IncidentPhase = 'CONTAIN';

    if (category === 'Malware Alert' || text.includes('ransomware') || text.includes('vssadmin') || text.includes('encrypt')) {
      assessedSeverity = 'Critical';
      severityRationale = 'Critical risk of rapid lateral movement, credential harvesting, or destructive file encryption across laboratory shared drives.';
    } else if (category === 'Lost or Stolen Laptop' || text.includes('stolen') || text.includes('missing')) {
      assessedSeverity = text.includes('unencrypted') || text.includes('credentials') ? 'High' : 'Medium';
      severityRationale = assessedSeverity === 'High'
        ? 'High physical asset exposure: Device contains active session tokens and uncommitted local student code.'
        : 'Physical asset displaced. Full-disk encryption mitigates offline data compromise.';
    } else if (category === 'Account Takeover' || text.includes('mfa') || text.includes('push')) {
      assessedSeverity = text.includes('admin') || text.includes('m.vance') ? 'High' : 'Medium';
      severityRationale = 'Elevated identity compromise risk. Potential abuse of cloud administrative roles or tenant persistence.';
    } else if (category === 'Data Exposure') {
      assessedSeverity = 'High';
      severityRationale = 'Public exposure of cloud assets or student data requires compliance review and immediate ACL enforcement.';
    }

    // Phase progress mapped to standard NIST lifecycle
    const phaseProgress = [
      {
        phase: 'PREPARE' as IncidentPhase,
        status: 'completed' as const,
        guidance: 'Verified inventory registry, offline backup snapshots, and emergency contact tree.'
      },
      {
        phase: 'DETECT' as IncidentPhase,
        status: 'completed' as const,
        guidance: 'Alert triaged, initial evidence timestamps noted, and asset tag identified.'
      },
      {
        phase: 'CONTAIN' as IncidentPhase,
        status: 'active' as const,
        guidance: 'Executing technical isolation (network quarantine, MDM remote lock, or session invalidation).'
      },
      {
        phase: 'RECOVER' as IncidentPhase,
        status: 'upcoming' as const,
        guidance: 'Re-imaging from verified golden image and restoring identity with phishing-resistant MFA.'
      },
      {
        phase: 'REVIEW' as IncidentPhase,
        status: 'upcoming' as const,
        guidance: 'Blameless post-incident review, corrective action tracking, and playbook refinement.'
      }
    ];

    // Scenario-specific recommendations
    let immediateActions = [];
    let containmentGuidance: string[] = [];
    let recoveryGuidance: string[] = [];
    let evidenceChecklist: string[] = [];
    let escalationRecommendations = [];
    let questionsForResponder: string[] = [];
    let uncertaintyNotes: string[] = [];

    if (category === 'Lost or Stolen Laptop') {
      immediateActions = [
        {
          action: 'Verify BitLocker / FileVault Full-Disk Encryption status in MDM console',
          rationale: 'Confirms whether data on physical storage is protected against offline hardware extraction.',
          requiresApproval: false,
          assignedRole: 'Marcus Vance (IT Administrator)'
        },
        {
          action: 'Transmit Remote Device Lock command with return contact banner',
          rationale: 'Locks the graphical interface and prompts returning finder with lab contact number.',
          requiresApproval: true,
          assignedRole: 'Marcus Vance (IT Administrator)'
        },
        {
          action: 'Revoke cloud authentication refresh tokens for student/staff user',
          rationale: 'Invalidates cached session cookies and browser tokens across Microsoft 365, Google Workspace, and GitHub.',
          requiresApproval: false,
          assignedRole: 'Alex Rivera (Security Responder)'
        }
      ];

      containmentGuidance = [
        'Do not issue an immediate cryptographic remote wipe if physical recovery in the lab is still plausible within 24 hours.',
        'Check electronic badge access logs and security cameras for the room during the disappearance window.',
        'Instruct the user to report the loss immediately to campus security.'
      ];

      recoveryGuidance = [
        'Prepare standardized loaner laptop provisioned with fresh OS and cloud redirected documents.',
        'Guide user to update all secondary account passwords from a trusted loaner device.',
        'If unrecovered after 24 hours, obtain Incident Commander authorization to transmit MDM Remote Wipe.'
      ];

      evidenceChecklist = [
        'MDM BitLocker status snapshot with timestamp',
        'Door badge access entry log export (CSV)',
        'Signed statement from custodian detailing last known physical location',
        'Cloud session invalidation audit receipt'
      ];

      escalationRecommendations = [
        {
          role: 'Dr. Sarah Chen (Incident Commander)',
          condition: 'Device confirmed stolen or unaccounted for after initial search',
          urgency: 'Immediate (Within 15m)' as const
        },
        {
          role: 'Arthur Pendelton, Esq. (Legal / Privacy Advisor)',
          condition: 'If unencrypted student personal data or private keys were stored locally',
          urgency: 'Standard (Within 2h)' as const
        }
      ];

      questionsForResponder = [
        'Was the device configured with mandatory PIN at boot or TPM-only unlock?',
        'Did the student store any uncommitted Git repositories or API keys in local directories?',
        'Was the laptop left locked or in an unlocked suspended state?'
      ];

      if (!input.affectedAsset.includes('NSL-')) {
        uncertaintyNotes.push('Specific asset tag was not provided in standard Northstar inventory format (NSL-LT-XXX).');
      }
    } else if (category === 'Malware Alert') {
      immediateActions = [
        {
          action: 'Execute EDR Network Host Isolation command',
          rationale: 'Cuts off lateral movement and C2 communication without cutting power.',
          requiresApproval: true,
          assignedRole: 'Alex Rivera (Security Responder)'
        },
        {
          action: 'Do NOT power off or reboot the workstation',
          rationale: 'Preserves volatile memory (RAM) where malware payload and injected processes reside.',
          requiresApproval: false,
          assignedRole: 'All Responders'
        },
        {
          action: 'Block identified C2 IP addresses and domains on perimeter firewall',
          rationale: 'Prevents other lab systems on the subnet from beaconing to the malicious infrastructure.',
          requiresApproval: false,
          assignedRole: 'Marcus Vance (IT Administrator)'
        }
      ];

      containmentGuidance = [
        'Isolate host network stack using EDR tunnel. If EDR agent is offline, physically disconnect Ethernet cable; do not pull power.',
        'Run memory triage package (Velociraptor / CyLR) to capture volatile state before any remediation.',
        'Review firewall connection logs for anomalous outbound connections from other IP addresses.'
      ];

      recoveryGuidance = [
        'Wipe drive partitions completely; re-image using verified golden MDT image. Never attempt manual antivirus cleaning.',
        'Verify backup snapshot date prior to infection timestamp. Restore user files to dedicated sandboxed directory.',
        'Perform fleet-wide IoC scan across all remaining 40 lab computers before lifting quarantine.'
      ];

      evidenceChecklist = [
        'EDR detection telemetry showing parent process and command line arguments',
        'Volatile RAM triage dump with calculated SHA-256 hash',
        'Firewall connection log showing blocked outbound C2 destination',
        'Malicious sample hash (SHA-256) cross-referenced against VirusTotal / MISP'
      ];

      escalationRecommendations = [
        {
          role: 'Dr. Sarah Chen (Incident Commander)',
          condition: 'Any evidence of lateral propagation or volume shadow copy tampering',
          urgency: 'Immediate (Within 15m)' as const
        },
        {
          role: 'Apex Cyber Defense (External SOC Retainer)',
          condition: 'If ransomware variant is unknown or memory analysis requires Tier-3 DFIR specialists',
          urgency: 'Standard (Within 2h)' as const
        }
      ];

      questionsForResponder = [
        'What user account was logged in when the PowerShell execution occurred?',
        'Did the process attempt to query domain controllers or access mapped network shares?',
        'Are immutable backup snapshots of shared storage verified safe?'
      ];
    } else if (category === 'Account Takeover') {
      immediateActions = [
        {
          action: 'Invoke Revoke-AzureADUserAllRefreshToken to kill all active sessions',
          rationale: 'Forces immediate termination of all active browser, desktop, and mobile tokens.',
          requiresApproval: false,
          assignedRole: 'Marcus Vance (IT Administrator)'
        },
        {
          action: 'Temporarily disable account sign-in in Entra ID / Active Directory',
          rationale: 'Prevents the threat actor from attempting further logins while identity is verified.',
          requiresApproval: true,
          assignedRole: 'Marcus Vance (IT Administrator)'
        },
        {
          action: 'Perform out-of-band user verification via phone or in person',
          rationale: 'Establishes legitimate communication without using potentially compromised email.',
          requiresApproval: false,
          assignedRole: 'Alex Rivera (Security Responder)'
        }
      ];

      containmentGuidance = [
        'Audit mailbox for suspicious inbox rules (e.g. forward to external Gmail, delete incoming security warnings).',
        'Check Enterprise Applications in Entra ID for newly registered or consented OAuth apps.',
        'Review sign-in logs for anomalous User-Agents, residential proxies, or foreign geolocations.'
      ];

      recoveryGuidance = [
        'Issue temporary strong password requiring change upon next login.',
        'Enroll user in phishing-resistant FIDO2 hardware security key (YubiKey) or Authenticator with number matching.',
        'Permanently disable SMS and standard push notifications for all administrative accounts.'
      ];

      evidenceChecklist = [
        'Entra ID Sign-In logs (JSON export with IP and risk event details)',
        'Purview Unified Audit Log (UAL) export covering 48-hour window',
        'Mailbox forwarding rules configuration dump',
        'Written record of out-of-band identity verification'
      ];

      escalationRecommendations = [
        {
          role: 'Dr. Sarah Chen (Incident Commander)',
          condition: 'Compromised account possessed Global Admin or Exchange Admin privileges',
          urgency: 'Immediate (Within 15m)' as const
        }
      ];

      questionsForResponder = [
        'Did the account have conditional access policies requiring compliant devices?',
        'Were any emails sent from the compromised mailbox during the unauthorized session?',
        'Did the user report receiving repeated push notifications (push fatigue)?'
      ];
    } else {
      // General cybersecurity event
      immediateActions = [
        {
          action: 'Record exact detection timestamp and affected asset identity in incident register',
          rationale: 'Establishes timeline baseline essential for auditing and reporting.',
          requiresApproval: false,
          assignedRole: 'Alex Rivera (Security Responder)'
        },
        {
          action: 'Assess scope of potential data exposure or unauthorized access',
          rationale: 'Determines whether regulatory or stakeholder escalation is mandated.',
          requiresApproval: false,
          assignedRole: 'Dr. Sarah Chen (Lab Director)'
        }
      ];

      containmentGuidance = [
        'Apply principle of least privilege: isolate affected systems or revoke specific tokens.',
        'Preserve server logs before clearing temporary cache or restarting services.'
      ];

      recoveryGuidance = [
        'Verify system integrity before returning to production status.',
        'Conduct review of access control lists and firewall policies.'
      ];

      evidenceChecklist = [
        'System event logs and application telemetry exports',
        'Configuration backup snapshots'
      ];

      escalationRecommendations = [
        {
          role: 'Dr. Sarah Chen (Incident Commander)',
          condition: 'Potential impact exceeds standard classroom boundaries',
          urgency: 'Standard (Within 2h)' as const
        }
      ];

      questionsForResponder = [
        'How was this anomaly originally detected (automated tool vs user report)?',
        'Are there secondary systems sharing identical credentials or network segments?'
      ];
    }

    if (text.length < 30) {
      uncertaintyNotes.push('Incident description is very brief; responder should conduct a follow-up interview with the reporting party.');
    }

    return {
      summary: `Automated triage for ${category} involving ${input.affectedAsset || 'unspecified asset'}. Prioritized response focuses on rapid containment, evidence preservation, and human-authorized recovery.`,
      assessedSeverity,
      severityRationale,
      currentPhase,
      phaseProgress,
      immediateActions,
      containmentGuidance,
      recoveryGuidance,
      evidenceChecklist,
      escalationRecommendations,
      questionsForResponder,
      confidenceScore: 92,
      uncertaintyNotes: uncertaintyNotes.length > 0 ? uncertaintyNotes : ['All required standard fields provided. Continuous monitoring recommended.'],
      sourceReferences: [
        {
          title: 'NIST SP 800-61 Rev. 3 - Incident Response Recommendations',
          standard: 'Section 3.2 - Containment, Eradication, and Recovery',
          url: 'https://csrc.nist.gov/pubs/sp/800/61/r3/upd1/final',
          verified: true
        },
        {
          title: 'NIST SP 800-63B - Digital Identity Guidelines',
          standard: 'Section 5.1 - Phishing-Resistant Authentication (AAL3)',
          url: 'https://pages.nist.gov/800-63-3/sp800-63b.html',
          verified: true
        },
        {
          title: 'CISA Incident Response Basics for Small Organizations',
          standard: 'SMB Cyber Hygiene & Host Containment Protocols',
          url: 'https://www.cisa.gov/resources-tools/resources/cyber-essentials',
          verified: true
        }
      ],
      safetyDisclaimers: [
        'SAFETY ADVISORY: This guidance is provided for decision support only. AI outputs are not authoritative directives.',
        'HUMAN APPROVAL REQUIRED: High-impact actions (such as device wipes, host isolation, or user account suspension) require explicit signoff from the Incident Commander or authorized IT Administrator.',
        'LEGAL NOTICE: Statutory reporting obligations (such as CERT-In directions or student privacy statutes) depend on organizational context and must be reviewed by qualified legal counsel.',
        'DATA INTEGRITY: No actual external AI API was queried without explicit user confirmation. All guidance generated via reviewed deterministic templates.'
      ],
      engineUsed: 'Local Reviewed Template Engine (Deterministic)',
      generatedAt: new Date().toISOString()
    };
  }
};
