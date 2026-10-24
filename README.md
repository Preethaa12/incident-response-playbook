# SentinelX AI — Intelligent Incident Response Command Center

> **CSE Capstone 5 Project:** *Incident Response Playbook for a Small Organisation*  
> **Tagline:** *"Detect Faster. Respond Smarter. Recover Stronger."*  
> **Fictional Organisation:** **Northstar Learning Labs** (Educational Computer Laboratory)

---

## 1. Overview & Vision

**SentinelX AI** is a production-grade, responsive cybersecurity command center engineered to demonstrate how artificial intelligence, structured decision support, and standardized response procedures empower small organisations—such as college laboratories, student clubs, and small businesses—to prepare for, detect, contain, recover from, and review cybersecurity incidents.

Small organisations face identical cyber threats to multinational enterprises (ransomware droppers, lost mobile hardware, credential stuffing, and session hijacking) but lack 24/7 dedicated SOC personnel. SentinelX AI bridges this gap with an intuitive interface adhering strictly to the **NIST SP 800-61 Rev. 3** incident response lifecycle:

$$\text{PREPARE} \longrightarrow \text{DETECT} \longrightarrow \text{CONTAIN} \longrightarrow \text{RECOVER} \longrightarrow \text{REVIEW}$$

---

## 2. Key Features & Modules

1. **Executive Command Center & Dashboard:**
   - Real-time KPIs derived directly from live state: Total Incidents, Open Tickets, Priority 1/2 Alerts, Mean Time to Acknowledge (MTTA), Mean Time to Contain (MTTC), and Readiness Score.
   - Interactive Recharts analytics: Incident Trends over time, Severity distribution donuts, Threat category bar charts, and NIST Phase velocity trackers.
   - Recent response timeline activity feed with instant navigation.

2. **Full Incident Management Center:**
   - Comprehensive incident lifecycle tracking across categories: *Lost or Stolen Laptop*, *Malware Alert*, *Account Takeover*, *Phishing*, *Suspicious Login*, and *Data Exposure*.
   - Multi-parameter filtering (Severity, Category, Status, NIST Phase, and full-text keyword search).
   - Dedicated Incident Dossier view with chronological timeline streams, forensic evidence registries, phase progress buttons, and commander signoff dialogs.
   - JSON and CSV export capabilities.

3. **AI Response Copilot (Signature Feature):**
   - Situational analysis workspace evaluating unstructured descriptions into prioritized actions.
   - Clearly distinguished **Deterministic Local Demonstration Engine** adhering to reviewed NIST templates without requiring external paid API keys.
   - Transparent confidence scores, missing information flags, and authoritative source references.
   - Dual-custody safety guardrails prohibiting unilateral destructive actions without human commander authorization.

4. **Interactive Playbook Library:**
   - Three complete standard operating procedures (SOPs):
     1. **Lost or Stolen Laptop:** BitLocker verification, remote device lock, cloud session invalidation, and 24-hour remote wipe gate.
     2. **Malware Alert & Endpoint Isolation:** Host network isolation, volatile RAM preservation (no hard power-offs), golden MDT re-imaging, and perimeter IoC sweeps.
     3. **Account Takeover (ATO):** Refresh token revocation (`Revoke-AzureADUserAllRefreshToken`), out-of-band verification, and mandatory FIDO2 hardware token enrollment.
   - Checkboxes with completed timestamps, progress bars, decision trees, and printable layouts.

5. **Response Checklist & Escalation Contact Tree:**
   - Phased readiness checklist covering preparation through blameless post-mortem.
   - Configurable contact hierarchy with roles, responsibilities, placeholder test contacts, and escalation order.

6. **Tabletop Exercise Simulator:**
   - 3 interactive scenario drills with 4+ attack inject stages.
   - Dilemma options with consequence reveals, points scoring, hints, and facilitator notes.
   - Generates comprehensive **After-Action Reports (AAR)** with readiness grading (A+, B, C) and corrective recommendations.

7. **Incident Report Generator:**
   - Standardized report drafting synthesizing executive summaries, metadata, timeline logs, containment status, root causes, and corrective action plans.
   - Rich live editor with print preview and clean `@media print` stylesheet for browser PDF export.

8. **Communication Template Center:**
   - 6 standardized crisis templates (IR Alert, Executive Briefing, IT Technical Dispatch, Lab Notice, Resolution Notice, PIR Invitation) with dynamic placeholder interpolation.

9. **Authoritative Knowledge & Research Center:**
   - Official citations and verified links to NIST SP 800-61 Rev. 3, CISA SMB Cyber Essentials, NIST SP 800-63B, and CERT-In directions.
   - Clear statutory advisory distinguishing organizational legal obligations from software suggestions.

10. **Prompt Laboratory:**
    - Documentation of all system prompts used to build and evaluate the system, with expected output formats, safety constraints, test statuses, and version histories.

11. **AI Verification & Safety Lab (Key Project Differentiator):**
    - Automated heuristic screening engine checking for hallucinated citations (e.g. non-existent NIST SP 800-999) and dangerous destructive advice (such as pulling power during ransomware).
    - Dual-custody human reviewer signoffs for factual accuracy, operational safety, and policy compliance.

12. **Automation Studio:**
    - Real, working local automation pipeline: Form Submission $\to$ Validation $\to$ Incident Creation $\to$ Report Draft $\to$ Preview $\to$ **Human Approval Checkpoint** $\to$ Export.
    - Architectural integration guide for external Zapier / Make webhooks.

13. **Before-and-After Workflow Evaluation:**
    - Quantitative benchmarking comparing ad-hoc manual documentation against the SentinelX AI workflow, demonstrating an 86% time savings and 100% approval gate compliance.

14. **Quiz & Learning Center:**
    - 10-question multiple-choice interactive quiz with single-question stepping, score calculation, and educational answer explanations.

15. **Capstone Documentation & Evaluator Demo Tour:**
    - Full academic dossier with problem statements, architecture diagrams, ethical AI principles, and an interactive 8-step evaluator checklist.

---

## 3. Technology Stack

- **Core:** React 19, TypeScript 5.7, Vite 6.2
- **Styling:** Vanilla Tailwind CSS with custom midnight dark cyber tokens and print stylesheets
- **Icons:** Lucide React
- **Analytics & Visualizations:** Recharts (Area, Donut, and Bar charts)
- **Routing:** React Router DOM (v7)
- **Persistence:** LocalStorage repository layer with automatic seeding, import/export, and reset features
- **Database (Optional):** Supabase PostgreSQL schema with Row-Level Security (`supabase/schema.sql`)

---

## 4. Getting Started Locally

### Prerequisites
- Node.js (v18 or newer; tested on Node.js v24)
- npm

### Installation & Launch
```bash
# 1. Clone or navigate to the workspace
cd sentinelx

# 2. Dependencies are already installed; to reinstall if needed:
npm install --legacy-peer-deps

# 3. Start the local Vite development server
npm run dev

# 4. Open in browser:
http://localhost:5173
```

### Production Build Validation
```bash
npm run build
```
*(Transpiles via TypeScript and bundles with Vite Rollup with zero type errors).*

---

## 5. Configuration & Demo Mode

SentinelX AI is configured to run **100% out of the box** without requiring paid external API keys:
- All data is stored in the browser's `localStorage` and seeded with realistic scenarios for Northstar Learning Labs.
- Clicking the **"DEMO DATA"** badge in the navigation bar allows resetting to default state, exporting a JSON backup, or importing custom test data.
- An `.env.example` file is provided for optional server-side LLM proxies or Supabase database synchronization.

---

## 6. Ethical AI & Safety Architecture

1. **Human-in-the-Loop Authority:** AI produces recommendations, not unilateral execution. Consequential actions (host isolation, credential revocation, remote wipes) require human commander signoff.
2. **Zero In-Band Credential Exposure:** Secrets, API keys, and sensitive incident telemetry are never transmitted to unverified public LLMs.
3. **Volatile Memory Preservation Policy:** All models and playbooks enforce network isolation rather than hard power cuts during ransomware triage.

---

## 7. Fictional Disclaimer

*All incidents, IP addresses, email addresses (`*.test`), hardware serial numbers, and individuals mentioned in SentinelX AI are fictional constructs representing the educational computer laboratory **Northstar Learning Labs**. Never use real breach data or personal information in demonstrations.*
