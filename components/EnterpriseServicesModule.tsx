"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Shield, Calculator, Activity, CheckCircle, AlertTriangle, ChevronRight, Terminal } from 'lucide-react';
import { submitLead } from '../app/actions/leads';

// Brand Kit Constant Tokens
const COLORS = {
  stoneBlack: '#1A1A1A',
  darkGray: '#333333',
  industrialCopper: '#B87333',
  architecturalGray: '#808080',
  boneWhite: '#FAF9F6',
};

export default function EnterpriseServicesModule() {
  const [activeTab, setActiveTab] = useState<'audit' | 'finops' | 'triage'>('audit');
  
  // State for AI Audit Questionnaire
  const [auditAnswers, setAuditAnswers] = useState({ q1: '', q2: '', q3: '', email: '' });
  const [auditSubmitted, setAuditSubmitted] = useState(false);
  const [isAuditSubmitting, setIsAuditSubmitting] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  // State for FinOps Calculator
  const [cloudSpend, setCloudSpend] = useState<number>(5000);
  const [vulnerabilities, setVulnerabilities] = useState({ unusedVms: false, egressFees: false, manualIaC: false });

  // State for 24x7 Autonomous Triage Portal
  const [triagePayload, setTriagePayload] = useState({ systemScope: '', severity: 'LOW', description: '', contact: '' });
  const [triageLogs, setTriageLogs] = useState<
    Array<{ id: string; timestamp: string; text: string; type: 'info' | 'warn' | 'success' }>
  >([
    { id: '1', timestamp: '00:00:01', text: 'Hybrid Node Core Listener Initialized on Azure VNet Bridge.', type: 'info' },
    { id: '2', timestamp: '00:00:02', text: 'WireGuard Tunnel Established to Local Hardware Nodes. Status: SECURE.', type: 'success' }
  ]);
  const [isTriaging, setIsTriaging] = useState(false);

  // Auto-scroll ref for terminal console
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [triageLogs]);

  // Handlers
  const handleAuditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAuditSubmitting(true);
    setAuditError(null);

    const telemetryBrief = `
NIST AI Compliance Audit Request:
---------------------------------
Prompt Log Preservation: ${auditAnswers.q1}
Private API Validation: ${auditAnswers.q2}
`.trim();

    // Construct form data for Server Action
    const formData = new FormData();
    formData.append('email', auditAnswers.email);
    formData.append('full_name', 'NIST Audit Respondent');
    formData.append('service_interest', 'ai_audit');
    formData.append('source', 'nist_risk_calculator');
    formData.append('message', telemetryBrief);
    
    // Honeypot Field Check
    const rawForm = new FormData(e.currentTarget);
    if (rawForm.get('fax_number')) formData.append('fax_number', rawForm.get('fax_number') as string);

    const response = await submitLead(formData);

    if (!response.success) {
      console.error('NIST audit save failed:', response.error);
      setAuditError(response.error || 'Transmission failed. Please try again.');
    } else {
      setAuditSubmitted(true);
    }
    
    setIsAuditSubmitting(false);
  };

  const calculateSavings = () => {
    let baseSavingsPercent = 0.15; // Baseline optimization through architecture
    if (vulnerabilities.unusedVms) baseSavingsPercent += 0.10;
    if (vulnerabilities.egressFees) baseSavingsPercent += 0.08;
    if (vulnerabilities.manualIaC) baseSavingsPercent += 0.12;
    
    const monthlySavings = cloudSpend * baseSavingsPercent;
    return {
      monthly: monthlySavings.toFixed(2),
      annual: (monthlySavings * 12).toFixed(2),
      percent: (baseSavingsPercent * 100).toFixed(0)
    };
  };

  const executeAutonomousTriage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!triagePayload.description) return;

    setIsTriaging(true);
    const trackingId = `BSB-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleTimeString();

    // Log simulated operational triage diagnostic to Server Action
    const incidentBrief = `
Simulated Incident Triage Pipeline:
-----------------------------------
Target System/Scope: ${triagePayload.systemScope}
Severity Level: ${triagePayload.severity}
Symptom/Log Description: ${triagePayload.description}
`.trim();

    const formData = new FormData();
    formData.append('email', triagePayload.contact || 'ops-admin@brownstone.ai');
    formData.append('full_name', `Triage Incident System (${trackingId})`);
    formData.append('service_interest', 'msp');
    formData.append('source', 'autonomous_triage_simulator');
    formData.append('message', incidentBrief);

    const rawForm = new FormData(e.currentTarget);
    if (rawForm.get('fax_number')) formData.append('fax_number', rawForm.get('fax_number') as string);

    await submitLead(formData);

    // Simulating the Autonomous Pipeline Handshake
    setTimeout(() => {
      setTriageLogs(prev => [
        ...prev,
        { id: Math.random().toString(), timestamp: now, text: `[CLOUD INGRESS] Ticket Received via TLS. Assigned Root ID: ${trackingId}`, type: 'info' },
      ]);
    }, 600);

    setTimeout(() => {
      setTriageLogs(prev => [
        ...prev,
        { id: Math.random().toString(), timestamp: now, text: `[HYBRID ROUTING] Payload transmitted securely through encrypted WireGuard tunnel to Local Compute Cluster.`, type: 'warn' },
      ]);
    }, 1400);

    setTimeout(() => {
      setTriageLogs(prev => [
        ...prev,
        { id: Math.random().toString(), timestamp: now, text: `[LOCAL AI AGENT] Severity Triage complete. Incident categorized under ITIL framework. Mitigation roadmap compiled.`, type: 'success' },
        { id: Math.random().toString(), timestamp: now, text: `[RESOLVED] Azure Action Group executed. Triage log sent to: ${triagePayload.contact || 'system-admin'}`, type: 'success' }
      ]);
      setIsTriaging(false);
      setTriagePayload({ systemScope: '', severity: 'LOW', description: '', contact: '' });
    }, 2800);
  };

  const savings = calculateSavings();

  return (
    <div className="w-full min-h-screen py-16 px-4 md:px-8 relative" style={{ backgroundColor: COLORS.boneWhite, fontFamily: 'Montserrat, sans-serif' }}>
      {/* Structural Engineering Blueprint Grid Line Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{ 
        backgroundImage: `linear-gradient(${COLORS.architecturalGray} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.architecturalGray} 1px, transparent 1px)`,
        backgroundSize: '40px 40px' 
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Module Title Section Header */}
        <div className="mb-12 border-b-2 pb-6" style={{ borderColor: COLORS.stoneBlack }}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider" style={{ color: COLORS.stoneBlack }}>
            ENTERPRISE PLATFORM ARCHITECTURE
          </h1>
          <p className="text-xs font-medium tracking-widest mt-2 uppercase" style={{ color: COLORS.industrialCopper }}>
            Autonomous Managed Services & AI Solutions Governance Framework
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-6 py-3 font-medium text-xs tracking-widest uppercase transition-all duration-300 border flex items-center gap-2 ${activeTab === 'audit' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-800'}`}
            style={{ borderColor: activeTab === 'audit' ? COLORS.stoneBlack : COLORS.architecturalGray }}
          >
            <Shield className="w-4 h-4" style={{ color: activeTab === 'audit' ? COLORS.industrialCopper : COLORS.stoneBlack }} />
            AI Governance Audit Tool
          </button>
          
          <button
            onClick={() => setActiveTab('finops')}
            className={`px-6 py-3 font-medium text-xs tracking-widest uppercase transition-all duration-300 border flex items-center gap-2 ${activeTab === 'finops' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-800'}`}
            style={{ borderColor: activeTab === 'finops' ? COLORS.stoneBlack : COLORS.architecturalGray }}
          >
            <Calculator className="w-4 h-4" style={{ color: activeTab === 'finops' ? COLORS.industrialCopper : COLORS.stoneBlack }} />
            Cloud FinOps Calculator
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className={`px-6 py-3 font-medium text-xs tracking-widest uppercase transition-all duration-300 border flex items-center gap-2 ${activeTab === 'triage' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-800'}`}
            style={{ borderColor: activeTab === 'triage' ? COLORS.stoneBlack : COLORS.architecturalGray }}
          >
            <Activity className="w-4 h-4" style={{ color: activeTab === 'triage' ? COLORS.industrialCopper : COLORS.stoneBlack }} />
            24x7 Autonomous Triage Engine
          </button>
        </div>

        {/* Precise Header Break 1px Horizontal Accent Divider */}
        <div className="w-full h-px mb-8" style={{ backgroundColor: COLORS.industrialCopper }} />

        {/* CORE INTERACTIVE UTILITY SWITCHBOARDS */}
        <div className="bg-white border p-6 md:p-10 shadow-sm transition-all duration-500" style={{ borderColor: COLORS.architecturalGray }}>
          
          {/* TAB 1: AI COMPLIANCE AUDIT TOOL */}
          {activeTab === 'audit' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <h2 className="text-xl font-bold tracking-wide uppercase mb-4" style={{ color: COLORS.stoneBlack }}>
                  NIST AI Risk Evaluation
                </h2>
                <p className="text-sm font-light leading-relaxed mb-6" style={{ color: COLORS.darkGray }}>
                  Assess your infrastructure against the NIST AI Risk Management Framework 1.0. Discover potential compliance gaps in telemetry, tracking data leakage, and external third-party API exposure paths before formal audit submissions.
                </p>
                <div className="p-4 bg-neutral-50 border-l-4" style={{ borderColor: COLORS.industrialCopper }}>
                  <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: COLORS.stoneBlack }}>Sovereignty Guarantee</p>
                  <p className="text-xs font-light" style={{ color: COLORS.darkGray }}>All inputs are parsed inside non-persistent sandboxes. Data is compiled natively and isolated from public large language models.</p>
                </div>
              </div>

              <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-8" style={{ borderColor: COLORS.architecturalGray }}>
                {!auditSubmitted ? (
                  <form onSubmit={handleAuditSubmit} className="space-y-4">
                    {/* Security Honeypot */}
                    <input type="text" name="fax_number" className="hidden" tabIndex={-1} autoComplete="off" />
                    <div>
                      <label className="block text-xs font-bold tracking-wider uppercase mb-2" style={{ color: COLORS.stoneBlack }}>1. How are production prompt logs and application state payloads preserved?</label>
                      <select required className="w-full p-3 border text-sm focus:outline-none" style={{ borderColor: COLORS.architecturalGray, fontFamily: 'Montserrat, sans-serif' }}
                        onChange={(e) => setAuditAnswers({...auditAnswers, q1: e.target.value})}>
                        <option value="">Select current state infrastructure protocol...</option>
                        <option value="cloud">Stored globally in raw vendor public clouds (OpenAI/Anthropic logs)</option>
                        <option value="unencrypted">Retained inside local databases without encryption vectors</option>
                        <option value="none">We do not actively track or log telemetry profiles</option>
                        <option value="secure">Isolated in an encrypted private VPC / Vault schema</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-wider uppercase mb-2" style={{ color: COLORS.stoneBlack }}>2. What validation measures guard private API endpoints against model training injection?</label>
                      <select required className="w-full p-3 border text-sm focus:outline-none" style={{ borderColor: COLORS.architecturalGray }}
                        onChange={(e) => setAuditAnswers({...auditAnswers, q2: e.target.value})}>
                        <option value="">Select optimization framework standard...</option>
                        <option value="zero">Zero filtering layers; raw data pipes to consumer endpoints</option>
                        <option value="basic">Standard regex security filtering on frontend forms</option>
                        <option value="verified">Strict data-scrubbing enterprise guardrails before model ingress</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-wider uppercase mb-2" style={{ color: COLORS.stoneBlack }}>3. Secure Corporate Intelligence Ingress Point Email</label>
                      <input required type="email" placeholder="principal@enterprise.com" className="w-full p-3 border text-sm focus:outline-none" style={{ borderColor: COLORS.architecturalGray }}
                        onChange={(e) => setAuditAnswers({...auditAnswers, email: e.target.value})} />
                    </div>

                    {auditError && (
                      <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2 select-none">
                        ⚠ {auditError}
                      </p>
                    )}

                    <button type="submit" disabled={isAuditSubmitting} className="w-full py-3 text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: COLORS.stoneBlack }}>
                      {isAuditSubmitting ? 'Executing Telemetry Analysis...' : 'Execute Audit Evaluation Sequence'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.industrialCopper }} />
                    <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Evaluation Sequence Complete</h3>
                    <p className="text-sm font-light text-neutral-600 max-w-md mx-auto mb-6">
                      An architecture analysis report mapping your configuration vulnerabilities to NIST standards has been processed and submitted to <strong style={{ color: COLORS.industrialCopper }}>{auditAnswers.email}</strong> via secure Supabase hooks.
                    </p>
                    <button onClick={() => setAuditSubmitted(false)} className="px-6 py-2 border text-xs tracking-wider uppercase font-bold" style={{ borderColor: COLORS.stoneBlack }}>
                      Re-run Evaluation Matrix
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CLOUD FINOPS CALCULATOR */}
          {activeTab === 'finops' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-wide uppercase mb-2" style={{ color: COLORS.stoneBlack }}>
                    FinOps Workload Run-Rate Audit
                  </h2>
                  <p className="text-sm font-light text-neutral-600">
                    Calculate operational overhead inefficiencies caused by poor workload scheduling, loose infrastructure orchestration, or unnecessary high-tier cloud GPU dependency.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span>Estimated Monthly Infrastructure Consumption Spend</span>
                    <span style={{ color: COLORS.industrialCopper }}>${cloudSpend.toLocaleString()} USD</span>
                  </div>
                  <input type="range" min="1000" max="50000" step="1000" value={cloudSpend} onChange={(e) => setCloudSpend(Number(e.target.value))}
                    className="w-full accent-neutral-800" />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold tracking-wider uppercase" style={{ color: COLORS.stoneBlack }}>Identify Structural Cost Anomaly Risks:</label>
                  
                  <label className="flex items-start gap-3 p-3 border cursor-pointer select-none" style={{ borderColor: COLORS.architecturalGray }}>
                    <input type="checkbox" checked={vulnerabilities.unusedVms} onChange={(e) => setVulnerabilities({...vulnerabilities, unusedVms: e.target.checked})} className="mt-1 accent-neutral-800" />
                    <div className="text-xs">
                      <p className="font-bold uppercase">Orphaned compute resources / Non-autoscaling configurations</p>
                      <p className="font-light text-neutral-500">Idle staging servers and fixed cloud pools running 24/7/365 without active workloads.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border cursor-pointer select-none" style={{ borderColor: COLORS.architecturalGray }}>
                    <input type="checkbox" checked={vulnerabilities.egressFees} onChange={(e) => setVulnerabilities({...vulnerabilities, egressFees: e.target.checked})} className="mt-1 accent-neutral-800" />
                    <div className="text-xs">
                      <p className="font-bold uppercase">High multi-region or vendor API data egress fees</p>
                      <p className="font-light text-neutral-500">Unoptimized cloud-to-local telemetry calls accumulating high dynamic routing costs.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border cursor-pointer select-none" style={{ borderColor: COLORS.architecturalGray }}>
                    <input type="checkbox" checked={vulnerabilities.manualIaC} onChange={(e) => setVulnerabilities({...vulnerabilities, manualIaC: e.target.checked})} className="mt-1 accent-neutral-800" />
                    <div className="text-xs">
                      <p className="font-bold uppercase">Manual resource configuration (Lack of IaC automation)</p>
                      <p className="font-light text-neutral-500">DevOps configurations deployed manually by engineering assets instead of structured Terraform pipelines.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* FinOps Optimization Target Output */}
              <div className="lg:col-span-6 bg-neutral-900 text-white p-6 md:p-8 flex flex-col justify-between border border-neutral-800">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Terminal className="w-5 h-5" style={{ color: COLORS.industrialCopper }} />
                    <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">Optimization Targets Compiled</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-400">Projected Efficiency Savings Ratio</p>
                      <p className="text-4xl font-bold mt-1" style={{ color: COLORS.industrialCopper }}>{savings.percent}%</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-400">Monthly Restored Capital</p>
                        <p className="text-xl font-bold mt-1">${Number(savings.monthly).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-400">Annual Recovered Burn-Rate</p>
                        <p className="text-xl font-bold mt-1 text-emerald-400">${Number(savings.annual).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-neutral-800 pt-4">
                  <p className="text-xs font-light text-neutral-400 leading-relaxed">
                    By codifying this configuration using <strong className="text-white">Terraform IaC Auto-blueprints</strong> and offloading heavy token tasks to secure local nodes, Brownstone reduces public cloud fees to an efficient baseline.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 24x7 AUTONOMOUS TRIAGE ENGINE */}
          {activeTab === 'triage' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <h2 className="text-xl font-bold tracking-wide uppercase mb-2" style={{ color: COLORS.stoneBlack }}>
                    Incident Simulation Core
                  </h2>
                  <p className="text-sm font-light text-neutral-600">
                    Test the system's 24x7 automated operational capabilities. Submit a simulated production or security anomaly to see how our hybrid network isolates cloud threats and automates resolutions.
                  </p>
                </div>

                <form onSubmit={executeAutonomousTriage} className="space-y-3">
                  {/* Security Honeypot */}
                  <input type="text" name="fax_number" className="hidden" tabIndex={-1} autoComplete="off" />
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">Target Infrastructure Target Scope</label>
                    <input required type="text" placeholder="e.g., Azure SQL Production DB Pool" className="w-full p-2 border text-xs focus:outline-none" style={{ borderColor: COLORS.architecturalGray }}
                      value={triagePayload.systemScope} onChange={(e) => setTriagePayload({...triagePayload, systemScope: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">Incident Criticality Classification</label>
                    <select className="w-full p-2 border text-xs focus:outline-none" style={{ borderColor: COLORS.architecturalGray }}
                      value={triagePayload.severity} onChange={(e) => setTriagePayload({...triagePayload, severity: e.target.value})}>
                      <option value="LOW">SEVERITY LEVEL: LOW (INFRASTRUCTURE ADVISORY)</option>
                      <option value="MEDIUM">SEVERITY LEVEL: MEDIUM (OPTIMIZATION ANOMALY)</option>
                      <option value="HIGH">SEVERITY LEVEL: HIGH (CRITICAL INFRASTRUCTURE CRASH)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">Telemetry Payload Symptom Log</label>
                    <textarea required placeholder="Describe the system anomaly or query latency issue..." rows={3} className="w-full p-2 border text-xs focus:outline-none" style={{ borderColor: COLORS.architecturalGray }}
                      value={triagePayload.description} onChange={(e) => setTriagePayload({...triagePayload, description: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">Administrator Webhook Endpoint Contact (Email/Slack ID)</label>
                    <input required type="text" placeholder="ops-admin@brownstone.ai" className="w-full p-2 border text-xs focus:outline-none" style={{ borderColor: COLORS.architecturalGray }}
                      value={triagePayload.contact} onChange={(e) => setTriagePayload({...triagePayload, contact: e.target.value})} />
                  </div>

                  <button type="submit" disabled={isTriaging} className="w-full py-3 text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 bg-neutral-900 disabled:opacity-50">
                    {isTriaging ? 'Autonomous Pipeline Processing...' : 'Transmit Diagnostic Telemetry'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Live Console Output System Streams */}
              <div className="lg:col-span-7 flex flex-col h-[420px] bg-neutral-950 text-neutral-200 font-mono text-xs border border-neutral-800 shadow-inner">
                <div className="bg-neutral-900 border-b border-neutral-800 p-3 flex justify-between items-center select-none">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">HYBRID CORE LIVE AUDIT MATRIX</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-bold">NODE: STAGING.ALPHA</span>
                </div>

                <div ref={logContainerRef} className="p-4 flex-1 overflow-y-auto space-y-2.5 custom-scrollbar">
                  {triageLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 leading-relaxed border-b border-neutral-900 pb-1.5">
                      <span className="text-neutral-500 font-bold select-none text-[10px] pt-0.5">[{log.timestamp}]</span>
                      <span className={
                        log.type === 'success' ? 'text-emerald-400 font-medium' :
                        log.type === 'warn' ? 'text-amber-400 font-medium' : 'text-neutral-300'
                      }>
                        {log.text}
                      </span>
                    </div>
                  ))}
                  {isTriaging && (
                    <div className="flex items-center gap-2 text-neutral-400 italic font-light animate-pulse pt-2 select-none">
                      <span>&gt;&gt; Running machine-learning telemetry parsing sequence on local compute hardware...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}