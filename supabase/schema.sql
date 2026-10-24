-- ==============================================================================
-- SentinelX AI — Intelligent Incident Response Command Center
-- Supabase PostgreSQL Database Schema & Migration Script
-- Organization: Northstar Learning Labs (Educational Lab)
-- Standard: NIST SP 800-61 Rev. 3 & NIST SP 800-63B
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. INCIDENTS TABLE
create table if not exists public.incidents (
  id text primary key,
  title text not null,
  category text not null check (category in (
    'Lost or Stolen Laptop',
    'Malware Alert',
    'Account Takeover',
    'Phishing',
    'Suspicious Login',
    'Data Exposure'
  )),
  severity text not null check (severity in ('Critical', 'High', 'Medium', 'Low')),
  status text not null check (status in ('New', 'Investigating', 'Contained', 'Recovering', 'Resolved')),
  current_phase text not null check (current_phase in ('PREPARE', 'DETECT', 'CONTAIN', 'RECOVER', 'REVIEW')),
  description text not null,
  affected_asset text not null,
  detection_time timestamptz not null default now(),
  acknowledged_time timestamptz,
  contained_time timestamptz,
  resolved_time timestamptz,
  assigned_responder text not null,
  incident_commander text not null,
  actions_taken jsonb not null default '[]'::jsonb,
  evidence_references jsonb not null default '[]'::jsonb,
  containment_status text,
  recovery_status text,
  resolution_summary text,
  lessons_learned text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. TIMELINE EVENTS TABLE
create table if not exists public.incident_timeline_events (
  id text primary key default concat('TL-', gen_random_uuid()),
  incident_id text references public.incidents(id) on delete cascade,
  timestamp timestamptz not null default now(),
  phase text not null,
  action text not null,
  responsible_role text not null,
  outcome text not null,
  notes text,
  created_at timestamptz default now()
);

-- 3. PLAYBOOK STEP PROGRESS TABLE
create table if not exists public.playbook_progress (
  id uuid primary key default uuid_generate_v4(),
  playbook_id text not null,
  step_id text not null,
  is_completed boolean default false,
  completed_at timestamptz,
  completed_by text,
  notes text,
  updated_at timestamptz default now(),
  unique (playbook_id, step_id)
);

-- 4. EMERGENCY CONTACTS TABLE
create table if not exists public.contacts (
  id text primary key,
  role text not null,
  name text not null,
  responsibility text not null,
  email text not null,
  phone text not null,
  contact_method text not null,
  escalation_order integer not null,
  availability_notes text,
  is_external boolean default false,
  created_at timestamptz default now()
);

-- 5. INCIDENT REPORTS TABLE
create table if not exists public.incident_reports (
  id text primary key,
  incident_id text references public.incidents(id) on delete cascade,
  incident_title text not null,
  generated_at timestamptz not null default now(),
  executive_summary text not null,
  incident_metadata jsonb not null,
  detection_and_timeline text not null,
  affected_assets text not null,
  impact_assessment text not null,
  response_actions text not null,
  containment text not null,
  recovery text not null,
  communication_log text,
  evidence_references text,
  root_cause text not null,
  lessons_learned text not null,
  corrective_action_plan text not null,
  status text not null check (status in ('Draft', 'Under Review', 'Approved')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. AUTOMATION EXECUTION RUNS
create table if not exists public.automation_runs (
  id text primary key,
  timestamp timestamptz not null default now(),
  trigger text not null,
  incident_id text references public.incidents(id),
  incident_title text not null,
  status text not null check (status in ('Pending Approval', 'Approved', 'Executed', 'Failed')),
  current_step_index integer not null default 0,
  steps jsonb not null default '[]'::jsonb,
  output_report_preview jsonb,
  requires_human_approval boolean default true,
  approved_by text,
  approved_at timestamptz,
  retry_count integer default 0
);

-- 7. AUDIT LOGGING TABLE (Dual-custody tracking)
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  timestamp timestamptz default now(),
  user_email text not null,
  action text not null,
  target_resource text not null,
  details jsonb,
  ip_address text
);

-- ENABLE ROW LEVEL SECURITY (RLS)
alter table public.incidents enable row level security;
alter table public.incident_timeline_events enable row level security;
alter table public.contacts enable row level security;
alter table public.incident_reports enable row level security;
alter table public.automation_runs enable row level security;
alter table public.audit_logs enable row level security;

-- Sample RLS Policy: Authenticated lab members can read incidents
create policy "Authenticated lab responders can read incidents"
  on public.incidents for select
  to authenticated
  using (true);

-- Sample RLS Policy: Only Incident Commanders can update status to Resolved
create policy "Only commanders can mark incidents resolved"
  on public.incidents for update
  to authenticated
  using (auth.jwt() ->> 'role' = 'incident_commander' or current_phase = 'CONTAIN');
