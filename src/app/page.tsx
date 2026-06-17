import { Target, Zap, Shield, ArrowRight, Terminal, Filter } from 'lucide-react';
import BountyMusicEngine from '../components/BountyMusicEngine';
import BountySniperDashboard from '../components/BountySniperDashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans relative overflow-hidden flex flex-col justify-between selection:bg-neon-green/30 selection:text-white">
      
      {/* Background ambient glow spots */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow"></div>
      <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-solana-purple/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[160px] pointer-events-none -z-10"></div>

      {/* Header bar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between border-b border-white/[0.04] backdrop-blur-md sticky top-0 z-50 bg-[#030712]/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-neon-green to-neon-cyan text-[#030712] shadow-[0_0_20px_rgba(0,255,135,0.25)]">
            <Target size={18} className="font-extrabold" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-white uppercase leading-none">PumpBountyBot</h1>
            <p className="text-[8px] text-neon-cyan font-bold tracking-widest uppercase mt-1">pump.fun GO sniper</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#song" className="hover:text-white transition-colors">Theme Song</a>
          <a href="#playground" className="hover:text-white transition-colors">Sniper Simulator</a>
          <a href="#features" className="hover:text-white transition-colors">Core Features</a>
          <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
        </nav>

        <div className="flex items-center gap-4">
          <a 
            href="https://t.me/pumpbountybot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-green to-neon-cyan hover:brightness-110 text-[#030712] rounded-xl text-xs font-black transition-all shadow-[0_4px_20px_rgba(0,255,135,0.2)] active:scale-98"
          >
            Launch Bot <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl w-full mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center relative z-10">
        
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080d22] border border-white/[0.06] hover:border-neon-cyan/35 text-slate-350 text-xs font-semibold mb-6 tracking-wide shadow-[0_0_15px_rgba(0,229,255,0.05)] transition-colors">
          <Zap size={12} className="text-neon-cyan fill-current" />
          <span>Instant Telegram Notifications for zero-submission bounties</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight mb-4 uppercase">
          Snatch pump.fun GO Rewards <br />
          <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-solana-purple bg-clip-text text-transparent">
            Before Anyone Else
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed mb-8">
          The ultimate bounty sniper utility. Get instant alerts straight to your Telegram DM the split-second a new bounty is posted on pump.fun. Set custom SOL filters, track proof criteria, and secure payouts instantly.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-16 text-center">
          {[
            { label: 'Active Snipers', val: '2,845' },
            { label: 'SOL Claimed', val: '1,429.5 SOL' },
            { label: 'Avg Alert Latency', val: '120ms' },
            { label: 'Success Ratio', val: '98.4%' }
          ].map((s, idx) => (
            <div key={idx} className="bg-[#050814]/40 border border-white/[0.04] p-4 rounded-xl">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">{s.label}</span>
              <span className="text-lg font-black text-white mt-1.5 block font-mono">{s.val}</span>
            </div>
          ))}
        </div>

        {/* Embedded Music Engine (Original Song Requirement) */}
        <div id="song" className="w-full max-w-4xl mb-16">
          <BountyMusicEngine />
        </div>

        {/* Interactive Snipe Playground */}
        <div id="playground" className="w-full max-w-4xl mb-16">
          <BountySniperDashboard />
        </div>

        {/* Features list section */}
        <div id="features" className="w-full text-left max-w-4xl mt-6">
          <h3 className="text-2xl font-extrabold text-white tracking-wide mb-8 uppercase text-center md:text-left">
            Why Sniper Bots Choose PumpBountyBot
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap size={20} className="text-neon-green" />,
                title: "Sub-Second Delivery",
                desc: "Direct RPC websocket subscription bypasses standard browser page fetching, delivering telegram notifications inside the first-mover window."
              },
              {
                icon: <Filter size={20} className="text-neon-cyan" />,
                title: "Customizable Filters",
                desc: "Set thresholds on minimum bounty rewards (SOL), NSFW content tags, allowed task categories, and max target submission caps."
              },
              {
                icon: <Shield size={20} className="text-solana-purple" />,
                title: "Zero Private Key Requirements",
                desc: "Your wallet private keys are never requested. We operate strictly as an offline alert sniper, keeping your crypto funds secure."
              }
            ].map((f, idx) => (
              <div key={idx} className="bg-[#050814]/40 border border-white/[0.04] p-5 rounded-xl hover:border-white/[0.08] transition-all flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#030712] border border-white/[0.05] flex items-center justify-center">
                  {f.icon}
                </div>
                <h4 className="text-sm font-bold text-white tracking-wide">{f.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Docs guide */}
        <div id="docs" className="w-full text-left max-w-4xl mt-16 bg-[#0c1328]/30 border border-white/[0.04] p-6 rounded-2xl">
          <h4 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2 mb-3">
            <Terminal size={16} className="text-neon-cyan" />
            Quick Setup Guide
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Getting set up with PumpBountyBot is completely frictionless. No sign-up, no downloads, no API configuration:
          </p>
          <div className="flex flex-col gap-3 text-xs font-mono text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-neon-green">1.</span>
              <p>Search for <a href="https://t.me/pumpbountybot" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">@pumpbountybot</a> on Telegram and send a <code className="text-toxic-yellow font-bold bg-[#030712] px-1.5 py-0.5 rounded border border-white/[0.03]">/start</code> command.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-neon-green">2.</span>
              <p>Configure filters via command <code className="text-toxic-yellow font-bold bg-[#030712] px-1.5 py-0.5 rounded border border-white/[0.03]">/filters min:0.25 nsfw:false</code>.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-neon-green">3.</span>
              <p>Keep your Telegram chat window open. The bot will automatically send alerts when a zero-submission bounty matches your criteria.</p>
            </div>
          </div>
        </div>

      </section>

      {/* Footer bar */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-10 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 relative z-10">
        <div className="flex items-center gap-2">
          <Shield size={12} className="text-neon-green" />
          <span>PumpBountyBot © {new Date().getFullYear()} — Decentralized Alert Utilities</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://t.me/pumpbountybot" className="hover:text-white transition-colors">Telegram Channel</a>
          <a href="https://x.com/pumpbountybot" className="hover:text-white transition-colors">X (Twitter)</a>
          <a href="https://pump.fun" className="hover:text-white transition-colors">pump.fun platform</a>
        </div>
      </footer>

    </div>
  );
}
