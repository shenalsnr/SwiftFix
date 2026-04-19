import React, { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════
   EMBEDDED STYLES — all scoped to .sf-home wrapper
   ═══════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  .sf-home * { box-sizing: border-box; margin: 0; padding: 0; }
  .sf-home { font-family: 'Inter', system-ui, sans-serif; color: #0f172a; }

  /* ── Navbar ── */
  .sf-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 5%;
    transition: background 0.35s ease, box-shadow 0.35s ease;
  }
  .sf-nav.scrolled {
    background: rgba(8, 15, 35, 0.92);
    backdrop-filter: blur(14px);
    box-shadow: 0 1px 0 rgba(255,255,255,0.06);
  }
  .sf-nav-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; cursor: pointer;
  }
  .sf-nav-logo-icon {
    width: 36px; height: 36px; border-radius: 9px;
    background: linear-gradient(135deg, #2563eb, #6366f1);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 900; color: #fff;
    box-shadow: 0 4px 14px rgba(37,99,235,0.45);
  }
  .sf-nav-brand {
    font-size: 1.25rem; font-weight: 800;
    color: #fff; letter-spacing: -0.02em;
  }
  .sf-nav-brand span { color: #60a5fa; }
  .sf-nav-links { display: flex; align-items: center; gap: 6px; }
  .sf-nav-link {
    background: none; border: none; cursor: pointer;
    padding: 8px 16px; border-radius: 8px;
    font-size: 0.9rem; font-weight: 500;
    color: rgba(255,255,255,0.75);
    transition: all 0.2s ease; font-family: inherit;
  }
  .sf-nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }
  .sf-nav-login {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    border: none; cursor: pointer;
    padding: 9px 22px; border-radius: 9px;
    font-size: 0.88rem; font-weight: 600; color: #fff;
    box-shadow: 0 4px 14px rgba(37,99,235,0.4);
    transition: all 0.25s ease; font-family: inherit;
    margin-left: 6px;
  }
  .sf-nav-login:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(37,99,235,0.55);
    background: linear-gradient(135deg, #1d4ed8, #4338ca);
  }

  /* ── Hero ── */
  .sf-hero {
    min-height: 100vh;
    background: linear-gradient(145deg, #060c1f 0%, #0f1f4a 40%, #060c1f 75%, #0a1628 100%);
    background-size: 300% 300%;
    animation: sfGradShift 14s ease infinite;
    position: relative; overflow: hidden;
    display: flex; align-items: center;
    padding: 100px 5% 80px;
  }
  @keyframes sfGradShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  .sf-hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none;
  }
  .sf-orb {
    position: absolute; border-radius: 50%;
    filter: blur(90px); opacity: 0.15; pointer-events: none;
    animation: sfOrbFloat 9s ease-in-out infinite alternate;
  }
  .sf-orb1 { width: 550px; height: 550px; background: #3b82f6; top: -180px; left: -100px; }
  .sf-orb2 { width: 400px; height: 400px; background: #6366f1; bottom: -100px; right: 8%; animation-delay: -4s; }
  .sf-orb3 { width: 280px; height: 280px; background: #06b6d4; top: 35%; left: 55%; animation-delay: -7s; }
  @keyframes sfOrbFloat {
    from { transform: translateY(0) scale(1); }
    to   { transform: translateY(28px) scale(1.06); }
  }
  .sf-hero-content { position: relative; z-index: 1; max-width: 1120px; margin: 0 auto; width: 100%; }
  .sf-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.3);
    border-radius: 999px; padding: 5px 16px;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #93c5fd; margin-bottom: 28px;
  }
  .sf-pulse { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; animation: sfPulse 2s ease-in-out infinite; }
  @keyframes sfPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
  .sf-hero h1 {
    font-size: clamp(2.6rem, 6.5vw, 4.5rem); font-weight: 900;
    line-height: 1.08; letter-spacing: -0.03em; margin-bottom: 24px;
    background: linear-gradient(135deg, #fff 0%, #93c5fd 50%, #a5b4fc 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sf-hero p {
    font-size: clamp(1rem, 2.2vw, 1.2rem); color: #94a3b8;
    max-width: 560px; line-height: 1.8; margin-bottom: 44px;
  }
  .sf-hero-btns { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 72px; }
  .sf-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 11px;
    font-size: 0.95rem; font-weight: 600; color: #fff;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    box-shadow: 0 8px 28px rgba(37,99,235,0.4);
    border: none; cursor: pointer; font-family: inherit;
    transition: all 0.25s ease; text-decoration: none;
  }
  .sf-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(37,99,235,0.55); }
  .sf-btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: 11px;
    font-size: 0.95rem; font-weight: 600; color: #e2e8f0;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.18);
    cursor: pointer; font-family: inherit; transition: all 0.25s ease;
    backdrop-filter: blur(6px);
  }
  .sf-btn-outline:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); color: #fff; }
  .sf-stats {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;
  }
  .sf-stat {
    background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 16px; padding: 22px 20px; text-align: center;
    backdrop-filter: blur(10px); transition: all 0.3s ease;
  }
  .sf-stat:hover { background: rgba(255,255,255,0.08); transform: translateY(-3px); border-color: rgba(99,102,241,0.35); }
  .sf-stat-num { font-size: 2.1rem; font-weight: 800; color: #fff; line-height: 1; }
  .sf-stat-lbl { font-size: 0.8rem; color: #94a3b8; margin-top: 6px; font-weight: 500; }

  /* ── Section shared ── */
  .sf-section { padding: 96px 5%; }
  .sf-section-center { text-align: center; margin-bottom: 60px; }
  .sf-section-tag {
    display: inline-block; font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 4px 14px; border-radius: 999px; margin-bottom: 14px;
  }
  .sf-section h2 {
    font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
    letter-spacing: -0.025em; margin-bottom: 16px;
  }
  .sf-section-sub { font-size: 1.05rem; line-height: 1.7; max-width: 520px; margin: 0 auto; }

  /* ── About section ── */
  .sf-about { background: #f8fafc; }
  .sf-about-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px; max-width: 1120px; margin: 0 auto;
  }
  .sf-about-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 20px;
    padding: 36px 30px; position: relative; overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .sf-about-card:hover { transform: translateY(-6px); box-shadow: 0 20px 56px rgba(37,99,235,0.1); border-color: rgba(99,102,241,0.28); }
  .sf-about-card-top {
    position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 20px 20px 0 0;
  }
  .sf-about-icon {
    width: 54px; height: 54px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; margin-bottom: 20px;
  }
  .sf-about-card h3 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
  .sf-about-card p { font-size: 0.9rem; color: #64748b; line-height: 1.75; }

  /* ── Contact section ── */
  .sf-contact { background: #0f172a; }
  .sf-contact-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 22px; max-width: 1120px; margin: 0 auto 32px;
  }
  .sf-contact-card {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 36px 26px; text-align: center;
    transition: all 0.3s ease;
  }
  .sf-contact-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-4px); border-color: rgba(99,102,241,0.32); }
  .sf-contact-icon {
    width: 56px; height: 56px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; font-size: 1.5rem;
  }
  .sf-contact-card h3 { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .sf-contact-card p { font-size: 0.83rem; color: #94a3b8; line-height: 1.65; margin-bottom: 12px; }
  .sf-contact-card a { text-decoration: none; font-weight: 600; font-size: 0.92rem; }
  .sf-hours-bar {
    max-width: 1120px; margin: 0 auto;
    background: linear-gradient(135deg, rgba(37,99,235,0.14), rgba(99,102,241,0.09));
    border: 1px solid rgba(99,102,241,0.22); border-radius: 16px;
    padding: 26px 36px; display: flex; align-items: center;
    justify-content: space-between; flex-wrap: wrap; gap: 18px;
  }
  .sf-hours-info { display: flex; align-items: center; gap: 14px; }
  .sf-hours-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(99,102,241,0.18);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    font-size: 1.2rem;
  }
  .sf-hours-title { font-weight: 700; color: #fff; font-size: 0.95rem; }
  .sf-hours-sub { color: #94a3b8; font-size: 0.82rem; margin-top: 3px; }

  /* ── Footer ── */
  .sf-footer {
    background: #060c1f; border-top: 1px solid rgba(255,255,255,0.06);
    padding: 32px 5%; text-align: center;
  }
  .sf-footer p { font-size: 0.8rem; color: #475569; margin-bottom: 4px; }

  /* ── Fade in animation ── */
  @keyframes sfFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sf-fade { animation: sfFadeUp 0.6s ease both; }
  .sf-d1 { animation-delay: 0.08s; }
  .sf-d2 { animation-delay: 0.18s; }
  .sf-d3 { animation-delay: 0.3s; }
  .sf-d4 { animation-delay: 0.44s; }
  .sf-d5 { animation-delay: 0.58s; }

  /* ── Modal ── */
  .sf-modal-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(4, 9, 24, 0.85);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: sfFadeIn 0.3s ease;
  }
  @keyframes sfFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .sf-modal {
    background: #fff; width: 100%; max-width: 500px;
    border-radius: 24px; overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    animation: sfScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes sfScaleUp { from { transform: scale(0.9) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
  .sf-modal-header {
    background: linear-gradient(135deg, #0f172a, #1e293b);
    padding: 24px 32px; display: flex; align-items: center; justify-content: space-between;
    color: #fff;
  }
  .sf-modal-header h2 { font-size: 1.25rem; font-weight: 800; margin: 0; }
  .sf-modal-close {
    background: rgba(255,255,255,0.1); border: none; color: #fff;
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
  }
  .sf-modal-close:hover { background: rgba(255,255,255,0.2); transform: rotate(90deg); }
  .sf-modal-body { padding: 32px; }
  .sf-form-group { margin-bottom: 20px; }
  .sf-form-group label {
    display: block; font-size: 0.88rem; font-weight: 600;
    color: #475569; margin-bottom: 8px;
  }
  .sf-form-input {
    width: 100%; padding: 12px 16px; border-radius: 12px;
    border: 1px solid #e2e8f0; font-family: inherit; font-size: 0.95rem;
    transition: all 0.2s; background: #f8fafc;
  }
  .sf-form-input:focus {
    outline: none; border-color: #3b82f6; background: #fff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
  .sf-form-textarea { height: 120px; resize: none; }
  .sf-success-state { text-align: center; padding: 20px 0; }
  .sf-success-icon {
    width: 64px; height: 64px; background: #dcfce7; color: #16a34a;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; font-size: 2rem;
  }

  /* ── Rating ── */
  .sf-rating-group {
    display: flex; gap: 8px; justify-content: center; margin-bottom: 24px;
    padding: 12px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;
  }
  .sf-star-btn {
    background: none; border: none; cursor: pointer; padding: 4px;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    color: #e2e8f0;
  }
  .sf-star-btn:hover { transform: scale(1.2); }
  .sf-star-btn.active { color: #f59e0b; }
  .sf-star-btn.hover { color: #fbbf24; }
  .sf-rating-label {
    text-align: center; font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8;
    margin-bottom: 8px;
  }
`;

/* ══════════════════════════════════════════════════
   ICONS — inline SVG (no external library needed)
   ══════════════════════════════════════════════════ */
const Icon = {
  Zap: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Phone: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.36 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.86-1.85a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Mail: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Chat: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  ArrowR: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  ChevR: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  GradCap: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Check: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Star: ({ filled }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

/* ══════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════ */
const ABOUT_CARDS = [
  {
    icon: <Icon.Zap />,
    iconBg: 'linear-gradient(135deg,#dbeafe,#eff6ff)',
    iconColor: '#2563eb',
    accentBg: 'linear-gradient(90deg,#2563eb,#6366f1)',
    title: 'Instant Reservations',
    desc: `Book lecture halls, labs, meeting rooms, and outdoor spaces in seconds. Real-time conflict detection means you'll never face a double-booking.`,
  },
  {
    icon: <Icon.Shield />,
    iconBg: 'linear-gradient(135deg,#ede9fe,#f5f3ff)',
    iconColor: '#7c3aed',
    accentBg: 'linear-gradient(90deg,#7c3aed,#a78bfa)',
    title: 'Admin Oversight',
    desc: 'Facility managers get a dedicated approval dashboard to review, approve or decline every request — with full audit trails and status history.',
  },
  {
    icon: <Icon.Users />,
    iconBg: 'linear-gradient(135deg,#d1fae5,#ecfdf5)',
    iconColor: '#059669',
    accentBg: 'linear-gradient(90deg,#059669,#10b981)',
    title: 'Built for Everyone',
    desc: 'Students, teaching staff, and admin personnel all benefit from a unified platform that eliminates paperwork and reduces scheduling conflicts.',
  },
  {
    icon: <Icon.BarChart />,
    iconBg: 'linear-gradient(135deg,#fef3c7,#fffbeb)',
    iconColor: '#d97706',
    accentBg: 'linear-gradient(90deg,#d97706,#f59e0b)',
    title: 'Usage Analytics',
    desc: 'Gain actionable insights into resource utilisation rates and peak booking periods to make smarter, data-driven campus infrastructure decisions.',
  },
];

const CONTACT_CARDS = [
  {
    icon: <Icon.Phone />,
    iconBg: 'linear-gradient(135deg,#1e40af,#3b82f6)',
    shadow: 'rgba(37,99,235,0.35)',
    title: 'Phone',
    sub: 'Mon – Fri, 8 AM – 5 PM',
    link: 'tel:+94112345678',
    linkText: '+94 11 234 5678',
    linkColor: '#60a5fa',
  },
  {
    icon: <Icon.Mail />,
    iconBg: 'linear-gradient(135deg,#059669,#10b981)',
    shadow: 'rgba(5,150,105,0.35)',
    title: 'Email',
    sub: 'We reply within 24 hours',
    link: 'mailto:support@swiftfix.campus',
    linkText: 'support@swiftfix.campus',
    linkColor: '#34d399',
  },
  {
    icon: <Icon.MapPin />,
    iconBg: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
    shadow: 'rgba(124,58,237,0.35)',
    title: 'Campus Location',
    sub: 'Facility Management Office\nMain Building, New Wing\nSLIIT Malabe Campus, Malabe',
    link: 'https://maps.google.com',
    linkText: 'View on Map',
    linkColor: '#c4b5fd',
    external: true,
  },
  {
    icon: <Icon.Chat />,
    iconBg: 'linear-gradient(135deg,#d97706,#f59e0b)',
    shadow: 'rgba(217,119,6,0.35)',
    title: 'Feedback',
    sub: 'Your suggestions help us improve SwiftFix for everyone.',
    link: 'mailto:feedback@swiftfix.campus',
    linkText: 'Student Feedback',
    linkColor: '#fcd34d',
    isModal: true,
  },
];

/* ══════════════════════════════════════════════════
   ANIMATED COUNTER
   ══════════════════════════════════════════════════ */
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return [count, ref];
}

function StatBox({ value, suffix, label }) {
  const [n, ref] = useCounter(value);
  return (
    <div className="sf-stat" ref={ref}>
      <div className="sf-stat-num">{n}{suffix}</div>
      <div className="sf-stat-lbl">{label}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sf-home">
      <style>{STYLES}</style>

      {/* ─── NAVIGATION BAR ─── */}
      <nav className={`sf-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="sf-nav-logo" onClick={() => scrollTo('sf-hero')}>
          <div className="sf-nav-logo-icon">
            <Icon.GradCap />
          </div>
          <span className="sf-nav-brand">Swift<span>Fix</span></span>
        </div>

        <div className="sf-nav-links">
          <button
            className="sf-nav-link"
            id="nav-home"
            onClick={() => scrollTo('sf-hero')}
          >
            Home
          </button>
          <button
            className="sf-nav-link"
            id="nav-about"
            onClick={() => scrollTo('sf-about')}
          >
            About
          </button>
          <button
            className="sf-nav-link"
            id="nav-contact"
            onClick={() => scrollTo('sf-contact')}
          >
            Contact
          </button>
          <button
            className="sf-nav-login"
            id="nav-login"
            type="button"
          >
            Login
          </button>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="sf-hero" id="sf-hero">
        <div className="sf-orb sf-orb1" />
        <div className="sf-orb sf-orb2" />
        <div className="sf-orb sf-orb3" />
        <div className="sf-hero-grid" />

        <div className="sf-hero-content">
          <div className="sf-fade sf-d1">
            <div className="sf-badge">
              <span className="sf-pulse" />
              Smart Campus Operations Hub
            </div>
          </div>

          <h1 className="sf-fade sf-d2">
            Book Campus Resources<br />
            Instantly &amp; Effortlessly
          </h1>

          <p className="sf-fade sf-d3">
            SwiftFix is a purpose-built reservation platform for universities. Browse
            available facilities, submit booking requests, and receive instant
            confirmations — all in one conflict-aware system.
          </p>

          <div className="sf-hero-btns sf-fade sf-d4">
            <button
              className="sf-btn-primary"
              id="hero-get-started"
              onClick={() => scrollTo('sf-about')}
            >
              Explore SwiftFix <Icon.ArrowR />
            </button>
            <button
              className="sf-btn-outline"
              id="hero-contact"
              onClick={() => scrollTo('sf-contact')}
            >
              Contact Us <Icon.ChevR />
            </button>
          </div>

          <div className="sf-stats sf-fade sf-d5">
            <StatBox value={120} suffix="+" label="Campus Resources" />
            <StatBox value={5000} suffix="+" label="Bookings Completed" />
            <StatBox value={98}  suffix="%" label="Satisfaction Rate" />
            <StatBox value={24}  suffix="/7" label="System Uptime" />
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section className="sf-section sf-about" id="sf-about">
        <div className="sf-section-center">
          <span
            className="sf-section-tag"
            style={{ background: '#eff6ff', color: '#2563eb' }}
          >
            About SwiftFix
          </span>
          <h2 style={{ color: '#0f172a' }}>
            A Smarter Way to Manage<br />Campus Resources
          </h2>
          <p className="sf-section-sub" style={{ color: '#64748b' }}>
            SwiftFix eliminates the inefficiencies of manual booking systems, giving
            every student, lecturer, and administrator a seamless digital experience.
          </p>
        </div>

        <div className="sf-about-grid">
          {ABOUT_CARDS.map((card, i) => (
            <div key={i} className="sf-about-card">
              <div className="sf-about-card-top" style={{ background: card.accentBg }} />
              <div
                className="sf-about-icon"
                style={{ background: card.iconBg, color: card.iconColor }}
              >
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Mission statement */}
        <div
          style={{
            maxWidth: 1120, margin: '48px auto 0',
            background: 'linear-gradient(135deg,#1e3a8a 0%,#312e81 100%)',
            borderRadius: 20, padding: '48px 40px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 28,
          }}
        >
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a5b4fc', marginBottom: 12 }}>
              Our Mission
            </div>
            <h3 style={{ fontSize: 'clamp(1.3rem,3vw,2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 14 }}>
              Zero Scheduling Conflicts.<br />100% Campus Efficiency.
            </h3>
            <p style={{ color: '#c7d2fe', fontSize: '0.93rem', lineHeight: 1.75, maxWidth: 460 }}>
              We believe every campus deserves a booking system that works as hard as its students.
              SwiftFix was designed from the ground up to handle the real complexity of university
              facility management — without the paperwork, phone calls, or spreadsheets.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 220 }}>
            {[
              ['⚡', 'No more email chains'],
              ['✅', 'Instant approval workflow'],
              ['🔒', 'Secure & role-based access'],
              ['📊', 'Live availability dashboard'],
            ].map(([em, txt], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#e0e7ff', fontSize: '0.88rem', fontWeight: 500 }}>
                <span style={{ fontSize: '1.1rem' }}>{em}</span> {txt}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section className="sf-section sf-contact" id="sf-contact">
        <div className="sf-section-center">
          <span
            className="sf-section-tag"
            style={{ background: 'rgba(59,130,246,0.14)', color: '#93c5fd' }}
          >
            Get in Touch
          </span>
          <h2 style={{ color: '#fff' }}>Contact &amp; Support</h2>
          <p className="sf-section-sub" style={{ color: '#94a3b8' }}>
            Have a question or need help with a booking? Our facility team is always
            ready to assist you.
          </p>
        </div>

        <div className="sf-contact-grid">
          {CONTACT_CARDS.map((c, i) => (
            <div key={i} className="sf-contact-card">
              <div
                className="sf-contact-icon"
                style={{ background: c.iconBg, color: '#fff', boxShadow: `0 6px 20px ${c.shadow}` }}
              >
                {c.icon}
              </div>
              <h3>{c.title}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{c.sub}</p>
              {c.badge ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#fcd34d', fontWeight: 600, fontSize: '0.88rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'sfPulse 2s ease-in-out infinite' }} />
                  Available Now
                </span>
              ) : c.isModal ? (
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  id={`contact-${c.title.toLowerCase().replace(/\s/g, '-')}`}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: c.linkColor, fontWeight: 600, fontSize: '0.92rem', padding: 0,
                    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4,
                    margin: '0 auto'
                  }}
                >
                  {c.linkText}
                </button>
              ) : (
                <a
                  href={c.link}
                  id={`contact-${c.title.toLowerCase().replace(/\s/g, '-')}`}
                  style={{ color: c.linkColor }}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {c.linkText}
                  {c.external && (
                    <span style={{ marginLeft: 4, verticalAlign: 'middle', display: 'inline-flex' }}>
                      <Icon.ExternalLink />
                    </span>
                  )}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Support hours bar */}
        <div className="sf-hours-bar">
          <div className="sf-hours-info">
            <div className="sf-hours-icon" style={{ color: '#a5b4fc' }}>
              <Icon.Clock />
            </div>
            <div>
              <div className="sf-hours-title">Support Hours</div>
              <div className="sf-hours-sub">
                Monday – Friday &nbsp;|&nbsp; 8:00 AM – 5:00 PM &nbsp;|&nbsp; Saturday 9:00 AM – 1:00 PM
              </div>
            </div>
          </div>
          <button
            className="sf-btn-primary"
            id="contact-scroll-top"
            onClick={() => scrollTo('sf-hero')}
            style={{ fontSize: '0.88rem', padding: '11px 24px' }}
          >
            Back to Top <Icon.ArrowR />
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="sf-footer">
        <p>SwiftFix &bull; Smart Campus Operations Hub</p>
        <p>&copy; 2026 SwiftFix. All rights reserved.</p>
      </footer>

      {/* ─── FEEDBACK MODAL ─── */}
      {showFeedbackModal && (
        <div className="sf-modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="sf-modal" onClick={e => e.stopPropagation()}>
            <FeedbackForm onClose={() => setShowFeedbackModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════
   FEEDBACK FORM COMPONENT
   ══════════════════════════════════════════════════ */
const FeedbackForm = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please provide a star rating!");
      return;
    }
    setLoading(true);

    const formData = new FormData(e.target);
    const newFeedback = {
      id: `FB-${Date.now()}`,
      studentId: e.target.studentId.value,
      department: e.target.dept.value,
      rating: rating,
      message: e.target.msg.value,
      date: new Date().toISOString().split('T')[0],
      isReal: true // flag to distinguish from mock data
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('swiftfix_feedback') || '[]');
    localStorage.setItem('swiftfix_feedback', JSON.stringify([newFeedback, ...existing]));

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => onClose(), 2500);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="sf-modal-body sf-success-state">
        <div className="sf-success-icon"><Icon.Check /></div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Thank You!</h2>
        <p style={{ color: '#64748b', lineHeight: 1.6 }}>Your feedback has been submitted successfully. We appreciate your input!</p>
      </div>
    );
  }

  return (
    <>
      <div className="sf-modal-header">
        <h2>Student Feedback</h2>
        <button className="sf-modal-close" onClick={onClose} aria-label="Close modal">
          <Icon.Close />
        </button>
      </div>
      <div className="sf-modal-body">
        <form onSubmit={handleSubmit}>
          <div className="sf-form-group">
            <label htmlFor="studentId">Student ID</label>
            <input required type="text" id="studentId" className="sf-form-input" placeholder="e.g. IT21004455" />
          </div>
          <div className="sf-form-group">
            <label htmlFor="dept">Department</label>
            <input required type="text" id="dept" className="sf-form-input" placeholder="e.g. Computing" />
          </div>

          <div className="sf-rating-label">Rate your experience</div>
          <div className="sf-rating-group">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`sf-star-btn ${rating >= star ? 'active' : ''} ${hover >= star ? 'hover' : ''}`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              >
                <Icon.Star filled={star <= (hover || rating)} />
              </button>
            ))}
          </div>

          <div className="sf-form-group">
            <label htmlFor="msg">Your Feedback</label>
            <textarea required id="msg" className="sf-form-input sf-form-textarea" placeholder="How can we improve SwiftFix?"></textarea>
          </div>
          <button 
            type="submit" 
            className="sf-btn-primary" 
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
          >
            {loading ? 'Sending...' : 'Send Feedback'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Home;
