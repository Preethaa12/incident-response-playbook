import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { CreateIncidentModal } from './components/incidents/CreateIncidentModal';

// Pages
import { OverviewDashboard } from './pages/OverviewDashboard';
import { IncidentManagementCenter } from './pages/IncidentManagementCenter';
import { IncidentDetailPage } from './pages/IncidentDetailPage';
import { AiResponseCopilot } from './pages/AiResponseCopilot';
import { PlaybookLibrary } from './pages/PlaybookLibrary';
import { ChecklistContactTree } from './pages/ChecklistContactTree';
import { TabletopSimulator } from './pages/TabletopSimulator';
import { IncidentReportGenerator } from './pages/IncidentReportGenerator';
import { CommunicationCenter } from './pages/CommunicationCenter';
import { KnowledgeResearchCenter } from './pages/KnowledgeResearchCenter';
import { PromptLaboratory } from './pages/PromptLaboratory';
import { AiVerificationSafetyLab } from './pages/AiVerificationSafetyLab';
import { AutomationStudio } from './pages/AutomationStudio';
import { BeforeAfterEvaluation } from './pages/BeforeAfterEvaluation';
import { QuizLearningCenter } from './pages/QuizLearningCenter';
import { CapstoneDocumentationCenter } from './pages/CapstoneDocumentationCenter';

// Data service
import { dataService } from './services/dataService';
import { Incident, IncidentPhase, IncidentStatus, Contact, Playbook, ChecklistItem, VerificationTestCase, AutomationRun, PromptTemplate, CommunicationTemplate } from './types';

export function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Core State
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [verificationTests, setVerificationTests] = useState<VerificationTestCase[]>([]);
  const [automations, setAutomations] = useState<AutomationRun[]>([]);
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Load from Data Service
  const refreshAllState = () => {
    setIncidents(dataService.getIncidents());
    setPlaybooks(dataService.getPlaybooks());
    setChecklist(dataService.getChecklist());
    setContacts(dataService.getContacts());
    setVerificationTests(dataService.getVerificationTests());
    setAutomations(dataService.getAutomations());
    setPrompts(dataService.getPrompts());
    setTemplates(dataService.getTemplates());
  };

  useEffect(() => {
    refreshAllState();
  }, []);

  // --- Handlers ---
  const handleCreateIncident = (newIncidentData: any) => {
    const created = dataService.createIncident(newIncidentData);
    setIncidents(dataService.getIncidents());
    showToast(`Registered ${created.id}: ${created.title.slice(0, 24)}...`);
  };

  const handleUpdatePhase = (incidentId: string, phase: IncidentPhase, role: string, notes: string) => {
    dataService.updatePhase(incidentId, phase, role, notes);
    setIncidents(dataService.getIncidents());
    showToast(`Updated ${incidentId} Phase to ${phase}`);
  };

  const handleUpdateStatus = (incidentId: string, status: IncidentStatus, role: string, notes: string) => {
    dataService.updateStatus(incidentId, status, role, notes);
    setIncidents(dataService.getIncidents());
    showToast(`Updated ${incidentId} Status to ${status}`);
  };

  const handleAddTimelineEvent = (incidentId: string, event: any) => {
    dataService.addTimelineEvent(incidentId, event);
    setIncidents(dataService.getIncidents());
    showToast(`Added timeline entry to ${incidentId}`);
  };

  const handleAddEvidence = (incidentId: string, evidence: any) => {
    dataService.addEvidence(incidentId, evidence);
    setIncidents(dataService.getIncidents());
    showToast(`Registered evidence artifact in ${incidentId}`);
  };

  const handleTogglePlaybookStep = (playbookId: string, stepId: string, notes?: string) => {
    dataService.togglePlaybookStep(playbookId, stepId, 'Alex Rivera', notes);
    setPlaybooks(dataService.getPlaybooks());
  };

  const handleResetPlaybook = (playbookId: string) => {
    dataService.resetPlaybook(playbookId);
    setPlaybooks(dataService.getPlaybooks());
    showToast('Playbook SOP steps reset to default');
  };

  const handleToggleChecklist = (id: string) => {
    const updated = dataService.toggleChecklistItem(id);
    setChecklist([...updated]);
  };

  const handleResetChecklist = () => {
    const reset = dataService.resetChecklist();
    setChecklist([...reset]);
    showToast('Response checklist reset');
  };

  const handleSaveContact = (contact: Contact) => {
    dataService.saveContact(contact);
    setContacts(dataService.getContacts());
    showToast(`Saved contact: ${contact.name}`);
  };

  const handleDeleteContact = (id: string) => {
    dataService.deleteContact(id);
    setContacts(dataService.getContacts());
    showToast('Contact removed');
  };

  const handleUpdateManualReview = (testId: string, review: any) => {
    dataService.updateManualReview(testId, review);
    setVerificationTests(dataService.getVerificationTests());
    showToast('Manual audit review saved');
  };

  const handleRunAutomatedCheck = (testId: string) => {
    dataService.runAutomatedChecks(testId);
    setVerificationTests(dataService.getVerificationTests());
    showToast('Automated heuristic scan completed');
  };

  const handleRunAllChecks = () => {
    const updated = dataService.runAllVerificationChecks();
    setVerificationTests([...updated]);
    showToast('Executed safety audit across all benchmark test cases');
  };

  const handleTriggerAutomation = (incidentId: string) => {
    const newRun = dataService.triggerAutomation(incidentId);
    setAutomations(dataService.getAutomations());
    showToast(`Triggered automation pipeline ${newRun.id}`);
    return newRun;
  };

  const handleApproveAutomation = (runId: string, approverName: string) => {
    dataService.approveAutomation(runId, approverName);
    setAutomations(dataService.getAutomations());
    showToast(`Automation ${runId} approved and executed`);
  };

  const handleSavePrompt = (prompt: PromptTemplate) => {
    dataService.savePrompt(prompt);
    setPrompts(dataService.getPrompts());
    showToast(`Saved prompt: ${prompt.name}`);
  };

  const handleUpdateTemplate = (template: CommunicationTemplate) => {
    dataService.updateTemplate(template);
    setTemplates(dataService.getTemplates());
    showToast(`Updated template: ${template.title}`);
  };

  const handleResetDemoData = () => {
    dataService.resetAllDemoData();
    refreshAllState();
    showToast('All laboratory records reset to pristine defaults.');
  };

  const handleExportData = () => {
    const json = dataService.exportAllDataJSON();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(json);
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `sentinelx_backup_${Date.now()}.json`);
    dlAnchor.click();
    showToast('Application state exported as JSON');
  };

  const handleImportData = (content: string) => {
    const success = dataService.importDataJSON(content);
    if (success) {
      refreshAllState();
      showToast('Successfully restored data backup!');
    } else {
      showToast('Error: Failed to parse backup file');
    }
  };

  const openIncidentsCount = incidents.filter(i => i.status !== 'Resolved').length;
  const unverifiedTestCount = verificationTests.filter(t => t.status === 'Failed' || t.manualReview.factualAccuracy === null).length;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          openIncidentCount={openIncidentsCount}
          unverifiedTestCount={unverifiedTestCount}
        />

        {/* Top Navbar */}
        <Navbar
          collapsed={collapsed}
          setMobileOpen={setMobileOpen}
          incidents={incidents}
          onOpenNewIncidentModal={() => setIsCreateModalOpen(true)}
          onResetDemoData={handleResetDemoData}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 pt-20 px-4 sm:px-8 max-w-7xl w-full mx-auto ${
            collapsed ? 'lg:pl-28' : 'lg:pl-80'
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={
                <OverviewDashboard
                  incidents={incidents}
                  onOpenNewIncidentModal={() => setIsCreateModalOpen(true)}
                />
              }
            />
            <Route
              path="/incidents"
              element={
                <IncidentManagementCenter
                  incidents={incidents}
                  onOpenNewIncidentModal={() => setIsCreateModalOpen(true)}
                />
              }
            />
            <Route
              path="/incidents/:id"
              element={
                <IncidentDetailPage
                  incidents={incidents}
                  onUpdatePhase={handleUpdatePhase}
                  onUpdateStatus={handleUpdateStatus}
                  onAddTimelineEvent={handleAddTimelineEvent}
                  onAddEvidence={handleAddEvidence}
                />
              }
            />
            <Route
              path="/copilot"
              element={<AiResponseCopilot incidents={incidents} />}
            />
            <Route
              path="/playbooks"
              element={
                <PlaybookLibrary
                  playbooks={playbooks}
                  onToggleStep={handleTogglePlaybookStep}
                  onResetPlaybook={handleResetPlaybook}
                />
              }
            />
            <Route
              path="/checklist"
              element={
                <ChecklistContactTree
                  checklist={checklist}
                  contacts={contacts}
                  onToggleChecklist={handleToggleChecklist}
                  onResetChecklist={handleResetChecklist}
                  onSaveContact={handleSaveContact}
                  onDeleteContact={handleDeleteContact}
                />
              }
            />
            <Route
              path="/tabletop"
              element={
                <TabletopSimulator
                  scenarios={dataService.getScenarios()}
                  attempts={dataService.getAttempts()}
                  onSaveAttempt={(attempt) => dataService.saveAttempt(attempt)}
                />
              }
            />
            <Route
              path="/reports"
              element={<IncidentReportGenerator incidents={incidents} />}
            />
            <Route
              path="/communications"
              element={
                <CommunicationCenter
                  templates={templates}
                  incidents={incidents}
                  onUpdateTemplate={handleUpdateTemplate}
                />
              }
            />
            <Route
              path="/research"
              element={<KnowledgeResearchCenter sources={dataService.getSources()} />}
            />
            <Route
              path="/prompts"
              element={
                <PromptLaboratory
                  prompts={prompts}
                  onSavePrompt={handleSavePrompt}
                />
              }
            />
            <Route
              path="/safety-lab"
              element={
                <AiVerificationSafetyLab
                  tests={verificationTests}
                  onUpdateManualReview={handleUpdateManualReview}
                  onRunAutomatedCheck={handleRunAutomatedCheck}
                  onRunAllChecks={handleRunAllChecks}
                />
              }
            />
            <Route
              path="/automation"
              element={
                <AutomationStudio
                  automations={automations}
                  incidents={incidents}
                  onTriggerAutomation={handleTriggerAutomation}
                  onApproveAutomation={handleApproveAutomation}
                />
              }
            />
            <Route
              path="/evaluation"
              element={<BeforeAfterEvaluation />}
            />
            <Route
              path="/quiz"
              element={<QuizLearningCenter />}
            />
            <Route
              path="/documentation"
              element={<CapstoneDocumentationCenter />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Create Incident Modal */}
        <CreateIncidentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateIncident}
        />

        {/* Toast Notification Container */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0e1629] border border-cyan-500/50 text-cyan-300 px-4 py-2.5 rounded-xl shadow-glow-cyan text-xs font-semibold flex items-center gap-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}
export default App;
