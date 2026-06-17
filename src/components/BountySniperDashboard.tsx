'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Zap, Filter, Bell, ToggleLeft, ToggleRight, AlertCircle, RefreshCw } from 'lucide-react';

interface BountyItem {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  title: string;
  reward: number; // in SOL
  taskType: 'Socials' | 'Video' | 'Follow' | 'Creative';
  nsfw: boolean;
  submissions: number;
  timeLabel: string;
  sniped?: boolean;
}

const MOCK_TOKENS = [
  { name: 'GigaChad Sniper', symbol: 'CHAD' },
  { name: 'Solana Bounty Hunter', symbol: 'HUNTER' },
  { name: 'PumpFun Master', symbol: 'PUMP' },
  { name: 'Pepe Go Alert', symbol: 'PEPEGO' },
  { name: 'Solana Sniper Bot', symbol: 'SNIPER' },
  { name: 'Bounty Hunters Clan', symbol: 'CLAN' },
  { name: 'Wif Hat Bounty', symbol: 'WIFGO' },
];

const MOCK_TITLES = [
  'Post a viral tweet tagging us & use our banner',
  'Make a short TikTok/Reels video showing our token page',
  'Join Telegram chat and create a custom sticker pack',
  'Invite 10 active friends to our community Telegram',
  'Create a custom meme image about CHAD token',
  'Design an alternative logo illustration for pump.fun',
];

const TASK_TYPES = ['Socials', 'Video', 'Follow', 'Creative'] as const;

const createRandomBounty = (id: string): BountyItem => {
  const token = MOCK_TOKENS[Math.floor(Math.random() * MOCK_TOKENS.length)];
  const title = MOCK_TITLES[Math.floor(Math.random() * MOCK_TITLES.length)];
  const taskType = TASK_TYPES[Math.floor(Math.random() * TASK_TYPES.length)];
  const reward = parseFloat((0.1 + Math.random() * 2.5).toFixed(2));
  const nsfw = Math.random() < 0.15; // 15% chance NSFW

  return {
    id,
    tokenName: token.name,
    tokenSymbol: token.symbol,
    title,
    reward,
    taskType,
    nsfw,
    submissions: 0, // Sniper targets zero-submission items
    timeLabel: 'Just now'
  };
};

export default function BountySniperDashboard() {
  const [bounties, setBounties] = useState<BountyItem[]>([]);
  const [minReward, setMinReward] = useState(0.2);
  const [allowNsfw, setAllowNsfw] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['Socials', 'Video', 'Follow', 'Creative']);
  const [autoSnipe, setAutoSnipe] = useState(true);
  const [logs, setLogs] = useState<string[]>([
    '[System] Initializing connection to Solana Mainnet RPC...',
    '[System] Subscribing to pump.fun program logs...',
    '[System] Filters configured. Sniper is active.'
  ]);
  const [totalClaimed, setTotalClaimed] = useState(14.85);

  // Initialize bounties only on the client-side to prevent SSR hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setBounties(Array.from({ length: 4 }).map((_, idx) => createRandomBounty(`init-${idx}`)));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Auto-generate new bounties in real-time
  useEffect(() => {
    let idCounter = 0;
    const interval = setInterval(() => {
      idCounter++;
      const newBounty = createRandomBounty(`bounty-${idCounter}`);

      setBounties(prev => {
        const updated = [newBounty, ...prev.slice(0, 7)];
        return updated;
      });

      // Log notification
      setLogs(prev => [
        `[Scanner] Detected new bounty: ${newBounty.tokenSymbol} - ${newBounty.reward} SOL`,
        ...prev.slice(0, 15)
      ]);

      // Check if matches filters for auto-sniping simulation
      const matchesFilter = 
        newBounty.reward >= minReward &&
        (!newBounty.nsfw || allowNsfw) &&
        activeFilters.includes(newBounty.taskType);

      if (matchesFilter && autoSnipe) {
        setTimeout(() => {
          setBounties(current => 
            current.map(b => b.id === newBounty.id ? { ...b, sniped: true } : b)
          );
          setTotalClaimed(prev => parseFloat((prev + newBounty.reward).toFixed(2)));
          setLogs(prev => [
            `[🎯 SNIPED] Successfully alerted on ${newBounty.tokenSymbol}! Reward: ${newBounty.reward} SOL. 0 submissions.`,
            ...prev.slice(0, 15)
          ]);
        }, 800);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [minReward, allowNsfw, activeFilters, autoSnipe]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleClearLogs = () => {
    setLogs(['[System] Console cleared. Listening for new block logs...']);
  };

  return (
    <div className="w-full bg-[#050814]/40 border border-white/[0.05] rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={14} className="text-neon-green" />
            <span className="text-[10px] text-neon-green font-bold tracking-widest uppercase">Sniper Simulator Dashboard</span>
          </div>
          <h3 className="text-lg font-bold text-white">Live Bounty Alert Stream</h3>
          <p className="text-xs text-slate-400 mt-0.5">Configure your custom filters to simulate telegram alert notifications.</p>
        </div>

        {/* Claimed Stat Card */}
        <div className="bg-[#0c1328]/60 border border-white/[0.04] px-4 py-2.5 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center text-neon-green">
            <Zap size={16} />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block leading-none">Simulated Claims</span>
            <span className="text-sm font-extrabold text-white mt-1 block font-mono">{totalClaimed} SOL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Filter Sidebar */}
        <div className="lg:col-span-4 bg-[#030712]/50 border border-white/[0.04] p-5 rounded-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"><Filter size={12} className="text-neon-cyan" /> Filters Settings</span>
            <span className="text-[9px] text-[#00ff87] bg-[#00ff87]/5 border border-[#00ff87]/15 px-2 py-0.5 rounded uppercase font-bold">Active</span>
          </div>

          {/* Min Reward slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-350 font-medium">Min Reward</span>
              <span className="text-neon-cyan font-bold font-mono">{minReward} SOL</span>
            </div>
            <input 
              type="range"
              min={0.1}
              max={3.0}
              step={0.1}
              value={minReward}
              onChange={(e) => setMinReward(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
          </div>

          {/* Task Category select */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Task Types</label>
            <div className="grid grid-cols-2 gap-2 text-xxs font-semibold">
              {['Socials', 'Video', 'Follow', 'Creative'].map(type => {
                const isSelected = activeFilters.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                      isSelected 
                        ? 'bg-neon-cyan/10 border-neon-cyan/35 text-neon-cyan' 
                        : 'bg-transparent border-white/[0.04] text-slate-500 hover:text-slate-300 hover:border-white/[0.08]'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* NSFW toggle */}
          <div className="flex items-center justify-between border-t border-white/[0.03] pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-slate-300">Allow NSFW</span>
              <span className="text-[9px] text-slate-500">Enable explicit bounty content alerts</span>
            </div>
            <button 
              onClick={() => setAllowNsfw(n => !n)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {allowNsfw ? (
                <ToggleRight size={28} className="text-neon-cyan" />
              ) : (
                <ToggleLeft size={28} className="text-slate-650" />
              )}
            </button>
          </div>

          {/* Auto Snipe toggle */}
          <div className="flex items-center justify-between border-t border-white/[0.03] pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-slate-300">Simulate Telegram Alert</span>
              <span className="text-[9px] text-slate-500">Auto-ping matching bounty rewards</span>
            </div>
            <button 
              onClick={() => setAutoSnipe(n => !n)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {autoSnipe ? (
                <ToggleRight size={28} className="text-neon-green" />
              ) : (
                <ToggleLeft size={28} className="text-slate-650" />
              )}
            </button>
          </div>
        </div>

        {/* Center/Right Column: Live Stream & Log Console */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Live alerts console logs */}
          <div className="bg-[#030712] border border-white/[0.03] p-4 rounded-xl flex flex-col gap-2 font-mono">
            <div className="flex justify-between items-center text-[9px] text-slate-500 border-b border-white/[0.03] pb-2">
              <span className="flex items-center gap-1.5 font-bold uppercase"><Terminal size={12} /> Log Console</span>
              <button onClick={handleClearLogs} className="hover:text-white text-[8px] tracking-wider uppercase font-bold flex items-center gap-1">
                <RefreshCw size={8} /> Clear Logs
              </button>
            </div>
            <div className="h-[90px] overflow-y-auto flex flex-col gap-1 text-[10.5px] leading-relaxed custom-scrollbar text-slate-400 pr-1">
              {logs.map((log, idx) => (
                <div key={idx} className={
                  log.startsWith('[🎯') ? 'text-neon-green font-bold' :
                  log.startsWith('[System]') ? 'text-neon-cyan/90' : 'text-slate-500'
                }>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Live Bounty Stream Items */}
          <div className="flex-1 flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {bounties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                <AlertCircle size={24} className="text-slate-600 animate-pulse mb-2" />
                <p className="text-xs">Connecting to Solana stream. Waiting for block data...</p>
              </div>
            ) : (
              bounties.map(b => (
                <div
                  key={b.id}
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 rounded-xl border transition-all ${
                    b.sniped
                      ? 'bg-[#00ff87]/5 border-[#00ff87]/20 shadow-[0_0_12px_rgba(0,255,135,0.04)]'
                      : 'bg-[#030712]/40 border-white/[0.04] hover:bg-[#030712]/60 hover:border-white/[0.06]'
                  }`}
                >
                  <div className="flex gap-3 items-center min-w-0 pr-4">
                    <div className="w-9 h-9 rounded-lg bg-[#070c22] border border-white/[0.05] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-neon-cyan font-mono">{b.tokenSymbol.substring(0, 2)}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{b.tokenName}</span>
                        <span className="text-[8px] font-black font-mono text-neon-cyan bg-neon-cyan/5 px-1.5 py-0.5 rounded border border-neon-cyan/15 uppercase tracking-wide shrink-0">
                          {b.tokenSymbol}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{b.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto mt-3 sm:mt-0 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-white font-mono block leading-none">{b.reward} SOL</span>
                      <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase block leading-none tracking-wider">{b.taskType}</span>
                    </div>

                    <div className="flex items-center justify-center shrink-0">
                      {b.sniped ? (
                        <span className="text-[9px] font-black text-[#030712] bg-neon-green shadow-sm shadow-neon-green/20 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Bell size={9} /> Sniped
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-500 bg-white/[0.02] border border-white/[0.04] px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Monitoring
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
