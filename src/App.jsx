import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const App = () => {
  // --- STATE FOR HERO CHAT (Step 07 Prep) ---
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Connection established. How can I assist with your infrastructure today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // --- STATE FOR LEAD CAPTURE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  const handleChat = (e) => {
    e.preventDefault();
    if (!chatInput) return;

    const newMessages = [...messages, { role: 'user', content: chatInput }];
    setMessages(newMessages);
    setChatInput('');
    setIsTyping(true);

    // Simulated Response (To be replaced by Step 07 API)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Request received. Analyzing VPC security parameters for Option B compliance...' 
      }]);
      setIsTyping(false);
    }, 1000);
  };

  // --- LEAD CAPTURE LOGIC (Supabase) ---
  const handleAuditRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(e.target);
    const emailInput = formData.get('auditEmail');
    const nameInput = formData.get('auditName');
    const serviceInput = formData.get('serviceInterest');

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          email: emailInput,
          full_name: nameInput || null,
          message: null,
          service_interest: serviceInput || 'audit',
          source: 'homepage_audit'
        }]);

      if (error) throw error;

      setSubmitStatus('success');
      e.target.reset();
    } catch (error) {
      console.error('Lead capture error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brownstone-white font-sans text-brownstone-gray">
      
      {/* 1. NAVIGATION */}
      <nav className="flex justify-between items-center px-8 py-10 max-w-7xl mx-auto">
        <div className="flex items-center">
    {/* Increased h-12 to h-20 for a commanding presence */}
          <img 
            src="/logo-banner.svg" 
            alt="Brownstone AI & Infrastructure" 
            className="hidden md:block h-20 w-auto transition-all duration-500 hover:brightness-110" 
          />
    {/* Increased h-10 to h-14 for mobile visibility */}
          <img 
            src="/logo-mark.svg" 
            alt="B" 
            className="block md:hidden h-14 w-auto" 
          />
    </div>
  
    <div className="hidden md:flex space-x-8 text-xs font-bold uppercase tracking-[0.3em] text-brownstone-gray/80">
    <a href="#solutions" className="hover:text-brownstone-brown transition">Solutions</a>
    <a href="#infrastructure" className="hover:text-brownstone-brown transition">Infrastructure</a>
    <a href="#audit" className="hover:text-brownstone-brown transition border-b-2 border-brownstone-brown pb-1">Request Audit</a>
    </div>
  </nav>

      {/* 2. HERO SECTION + CHAT INTERFACE */}
      <section className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-7xl font-bold leading-tight text-brownstone-black mb-8 tracking-tighter">
            Secure the <span className="text-brownstone-brown font-light italic">Perimeter.</span><br /> 
            Scale the Vision.
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
            Infrastructure built for the Zero-Trust era. We isolate your proprietary AI in private vaults, keeping your data invisible to the public web.
          </p>
          <div className="flex gap-6">
            <button className="bg-brownstone-black text-white px-10 py-5 rounded-sm font-bold hover:bg-brownstone-brown transition uppercase tracking-widest text-sm">
              Explore the Vault
            </button>
          </div>
        </div>

        {/* --- HERO CHAT COMPONENT (Step 07 Placeholder) --- */}
        <div className="bg-white p-6 rounded-lg shadow-2xl border border-gray-100 flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between mb-4 border-b pb-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">node-alpha.brownstone.local</span>
          </div>
          
          <div className="flex-grow space-y-4 mb-4 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar text-left">
            {messages.map((msg, i) => (
              <div key={i} className={`p-4 rounded-sm text-sm ${msg.role === 'user' ? 'bg-gray-100 ml-12 text-brownstone-black' : 'bg-brownstone-gray text-white mr-12'}`}>
                {msg.content}
              </div>
            ))}
            {isTyping && <div className="text-[10px] text-brownstone-brown animate-pulse uppercase tracking-widest">Encrypting...</div>}
          </div>

          <form onSubmit={handleChat} className="mt-auto relative">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Query the infrastructure..." 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-brownstone-brown text-sm"
            />
            <button type="submit" className="absolute right-4 top-4 text-brownstone-brown font-bold text-xs uppercase tracking-widest">Execute</button>
          </form>
        </div>
      </section>

      {/* 3. THE OUTCOME GRID */}
      <section id="solutions" className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brownstone-brown mb-4">Your Strategic Advantage</h2>
          <p className="text-5xl font-bold text-brownstone-gray tracking-tighter">
            Infrastructure built for your <span className="text-brownstone-black italic">Unfair Advantage.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
          {/* Vault Card */}
          <div className="group p-8 border border-gray-100 hover:border-brownstone-brown transition-all duration-500 bg-white shadow-sm hover:shadow-xl">
            <div className="w-12 h-12 bg-brownstone-gray text-white flex items-center justify-center mb-6 group-hover:bg-brownstone-brown transition-colors">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.119c0 3.891 2.141 7.29 5.39 9.044a11.952 11.952 0 005.42 1.701c.142 0 .283-.002.423-.005a11.962 11.962 0 005.39-9.04c0-2.14-.56-4.15-1.543-5.881A11.947 11.947 0 0012 2.714z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-brownstone-black mb-4 uppercase tracking-wider">The Sovereign Vault</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">Eliminate the liability of traditional VPNs. We deploy ZTNA and Managed XDR to turn your network into a ghost.</p>
            <ul className="text-xs font-bold text-brownstone-brown space-y-2 uppercase tracking-widest">
              <li>+ Zero Trust Access</li>
              <li>+ Compliance Management</li>
            </ul>
          </div>

          {/* AI Card */}
          <div className="group p-8 border border-gray-100 hover:border-brownstone-brown transition-all duration-500 bg-white shadow-sm hover:shadow-xl">
            <div className="w-12 h-12 bg-brownstone-gray text-white flex items-center justify-center mb-6 group-hover:bg-brownstone-brown transition-colors">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-brownstone-black mb-4 uppercase tracking-wider">Autonomous Ops</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">Stop paying for "break-fix" cycles. Our Self-Healing IT uses AI to repair common issues before they hit the ticket queue.</p>
            <ul className="text-xs font-bold text-brownstone-brown space-y-2 uppercase tracking-widest">
              <li>+ AI Tier 1 Help Desk</li>
              <li>+ Predictive RMM</li>
            </ul>
          </div>

          {/* Consulting Card */}
          <div className="group p-8 border border-gray-100 hover:border-brownstone-brown transition-all duration-500 bg-white shadow-sm hover:shadow-xl">
            <div className="w-12 h-12 bg-brownstone-gray text-white flex items-center justify-center mb-6 group-hover:bg-brownstone-brown transition-colors">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0v16.5m0-16.5L12 3m0 0l8.25 3m-8.25-3v13.5m-8.25 1.5L12 18.75m0 0l8.25-3m-8.25 3V6.75" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-brownstone-black mb-4 uppercase tracking-wider">The Boardroom Guide</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">Technology is a line item; strategy is a multiplier. vCIO advisory aligns your infrastructure with your growth roadmap.</p>
            <ul className="text-xs font-bold text-brownstone-brown space-y-2 uppercase tracking-widest">
              <li>+ Digital Transformation</li>
              <li>+ Budget Roadmapping</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. THE TRUST SECTION */}
      <section id="infrastructure" className="bg-brownstone-gray py-24 text-white">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-20 items-center">
          <div className="text-left">
            <h2 className="text-4xl font-bold mb-6 italic tracking-tight">The Ghost Network</h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Under an **Option B Architecture**, we strip away public IP addresses. Your data exists in a logically isolated environment, unreachable from the public internet.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-8 border border-gray-700 bg-black/20 text-left">
                <span className="block text-3xl font-bold text-brownstone-brown mb-2">0.0ms</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Public Exposure</span>
             </div>
             <div className="p-8 border border-gray-700 bg-black/20 text-left">
                <span className="block text-3xl font-bold text-brownstone-brown mb-2">100%</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Data Sovereignty</span>
             </div>
          </div>
        </div>
      </section>

      {/* --- 5. LEAD CAPTURE --- */}
      <section id="audit" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-brownstone-black mb-4 tracking-tighter uppercase">Request a Service Assessment</h2>
          <p className="text-gray-500 mb-12 text-base leading-relaxed">
            Infrastructure audit, AI readiness review, or security assessment — tell us what you need and a vCISO will be in touch within one business day.
          </p>

          {submitStatus === 'success' ? (
            <div className="border border-brownstone-brown bg-brownstone-brown/5 p-10 text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brownstone-brown mb-2">Transmission Confirmed</p>
              <p className="text-xl font-bold text-brownstone-black mb-2">Request Received.</p>
              <p className="text-gray-500 text-sm">Our vCISO team will review your request and respond within one business day. Check your inbox for a confirmation.</p>
            </div>
          ) : (
            <form onSubmit={handleAuditRequest} className="text-left space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Full Name</label>
                  <input
                    name="auditName"
                    type="text"
                    placeholder="Jane Smith"
                    className="w-full p-4 border border-gray-200 focus:border-brownstone-brown outline-none text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Corporate Email <span className="text-brownstone-brown">*</span></label>
                  <input
                    name="auditEmail"
                    type="email"
                    placeholder="jane@company.com"
                    required
                    className="w-full p-4 border border-gray-200 focus:border-brownstone-brown outline-none text-sm bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Service of Interest <span className="text-brownstone-brown">*</span></label>
                <select
                  name="serviceInterest"
                  required
                  className="w-full p-4 border border-gray-200 focus:border-brownstone-brown outline-none text-sm bg-gray-50 text-brownstone-gray"
                >
                  <option value="">Select a service...</option>
                  <option value="ai_audit">AI Security Audit — Adversarial review of AI workflows & agents</option>
                  <option value="ai_readiness">AI Readiness Assessment — Evaluate staff & business AI maturity</option>
                  <option value="infrastructure_audit">Infrastructure Audit — Zero-Trust, ZTNA, compliance review</option>
                  <option value="msp">MSP Services — 24x7 monitoring, helpdesk, managed IT</option>
                  <option value="capstone">Capstone Program — AI implementation program inquiry</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              {submitStatus === 'error' && (
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest">
                  ⚠ Transmission failed. Please try again or email us directly.
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto bg-brownstone-brown text-white px-12 py-5 font-bold uppercase tracking-widest text-sm transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brownstone-black'}`}
              >
                {isSubmitting ? 'Transmitting...' : 'Submit Request →'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em] font-bold">
          © 2026 Brownstone AI & Infrastructure LLC. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;