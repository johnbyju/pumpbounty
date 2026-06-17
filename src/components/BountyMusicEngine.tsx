'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music, Sparkles } from 'lucide-react';

interface LyricLine {
  time: number;
  text: string;
}

const LYRICS: LyricLine[] = [
  { time: 0, text: "🎵 [Synthwave Intro - Synthesizers Warming Up] 🎵" },
  { time: 4, text: "⚡ Snipers online... Targeting pump.fun GO rewards... ⚡" },
  { time: 8, text: "In the depths of the blockchain, where memecoins collide," },
  { time: 14, text: "A sniper is waiting, with nowhere to hide!" },
  { time: 20, text: "Scanning the tickers, looking for the GO sign," },
  { time: 26, text: "Zero submissions... now the bounty is mine!" },
  { time: 31, text: "🔥 (Chorus) PumpBountyBot! Sniper of the night! 🔥" },
  { time: 37, text: "Snatching the reward, keeping it bright!" },
  { time: 43, text: "No keys to expose, no wallet to bind," },
  { time: 49, text: "Claiming the SOL before anyone's behind!" },
  { time: 55, text: "Filter the noise, set the trigger threshold," },
  { time: 61, text: "Watch the Telegram alerts start to unfold!" },
  { time: 67, text: "Instant notifications, flashing on your screen," },
  { time: 73, text: "The fastest sniper claim Solana's ever seen!" },
  { time: 78, text: "🔥 (Chorus) PumpBountyBot! Sniper of the night! 🔥" },
  { time: 84, text: "Snatching the reward, keeping it bright!" },
  { time: 90, text: "PumpBountyBot! Faster than the light!" },
  { time: 96, text: "Snatching the SOL, winning the fight!" },
  { time: 102, text: "🎵 [Outro - Melodic Oscillations Fading Out] 🎵" },
];

export default function BountyMusicEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(115);
  const [synthType, setSynthType] = useState<'sawtooth' | 'square' | 'triangle'>('sawtooth');
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const nextNoteTimeRef = useRef(0);
  const stepRef = useRef(0);
  const timerIdRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const songStartedTimeRef = useRef<number | null>(null);

  // Synthesize Snare Noise Buffer
  const makeNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 0.25; // 0.25 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  const initAudio = () => {
    if (audioContextRef.current) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    const mainGain = ctx.createGain();
    mainGain.gain.value = 0.3; // Default master volume

    analyser.connect(mainGain);
    mainGain.connect(ctx.destination);

    audioContextRef.current = ctx;
    analyserRef.current = analyser;
    mainGainRef.current = mainGain;
  };

  // Play Kick Drum Note
  const playKick = (ctx: AudioContext, destination: AudioNode, time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(destination);

    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.3);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

    osc.start(time);
    osc.stop(time + 0.35);
  };

  // Play Snare Drum Note
  const playSnare = (ctx: AudioContext, destination: AudioNode, time: number) => {
    const noise = ctx.createBufferSource();
    noise.buffer = makeNoiseBuffer(ctx);

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destination);

    // Add snap sound
    const snapOsc = ctx.createOscillator();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(180, time);

    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(0.5, time);
    snapGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

    snapOsc.connect(snapGain);
    snapGain.connect(destination);

    noise.start(time);
    noise.stop(time + 0.25);
    snapOsc.start(time);
    snapOsc.stop(time + 0.1);
  };

  // Play Bassline synth note
  const playBass = (ctx: AudioContext, destination: AudioNode, time: number, freq: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, time);
    filter.Q.value = 4;

    gain.gain.setValueAtTime(0.8, time);
    gain.gain.linearRampToValueAtTime(0.6, time + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  };

  // Play Lead Arpeggio Synth Note
  const playLead = (ctx: AudioContext, destination: AudioNode, time: number, freq: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const delay = ctx.createDelay();
    const delayGain = ctx.createGain();

    osc.type = synthType;
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    // Echo / Delay loop
    delay.delayTime.value = 0.2;
    delayGain.gain.value = 0.4; // Feedback amount

    osc.connect(gain);
    gain.connect(destination);

    gain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(delay); // Feedback node
    delayGain.connect(destination);

    osc.start(time);
    osc.stop(time + duration + 0.4);
  };

  // Chord Progression Mapping
  // A minor -> C major -> G major -> F major
  const getNotes = (step: number) => {
    const chordIdx = Math.floor(step / 16) % 4;
    
    // Bass note frequencies
    const bassRoots = [55.00, 65.41, 49.00, 43.65]; // A1, C2, G1, F1
    const bassNote = bassRoots[chordIdx];

    // Melodic arpeggio patterns
    const leadPatterns = [
      [220.00, 261.63, 329.63, 392.00], // Am (A3, C4, E4, G4)
      [261.63, 329.63, 392.00, 523.25], // C (C4, E4, G4, C5)
      [196.00, 246.94, 293.66, 392.00], // G (G3, B3, D4, G4)
      [174.61, 220.00, 261.63, 349.23], // F (F3, A3, C4, F4)
    ];

    const noteIdx = Math.floor(step / 2) % 4;
    const leadNote = leadPatterns[chordIdx][noteIdx] * 1.5; // Shift lead higher

    return { bassNote, leadNote };
  };

  // Audio scheduler looping 16th steps
  const scheduleNextStep = () => {
    const ctx = audioContextRef.current!;
    const analyser = analyserRef.current!;

    const secondsPerStep = 60.0 / bpm / 4.0; // 16th note length

    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      const time = nextNoteTimeRef.current;
      const currentStep = stepRef.current;

      const { bassNote, leadNote } = getNotes(currentStep);

      // 1. Kick on 1 and 3 (step 0, 8, etc.)
      if (currentStep % 8 === 0 || currentStep % 8 === 6) {
        playKick(ctx, analyser, time);
      }

      // 2. Snare on 2 and 4 (step 4, 12, etc.)
      if (currentStep % 8 === 4) {
        playSnare(ctx, analyser, time);
      }

      // 3. Bassline plays on steps 0, 2, 4, 6, 8, 10, 12, 14
      if (currentStep % 2 === 0) {
        playBass(ctx, analyser, time, bassNote, secondsPerStep * 1.5);
      }

      // 4. Arpeggiator plays on odd/every-other steps
      if (currentStep % 4 !== 0) {
        playLead(ctx, analyser, time, leadNote, secondsPerStep * 0.8);
      }

      nextNoteTimeRef.current += secondsPerStep;
      stepRef.current = (currentStep + 1) % 64; // Cycle 4 bars (64 steps)
    }

    timerIdRef.current = window.setTimeout(scheduleNextStep, 25);
  };

  const startSong = async () => {
    initAudio();
    const ctx = audioContextRef.current!;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    songStartedTimeRef.current = ctx.currentTime - currentTime;
    nextNoteTimeRef.current = ctx.currentTime;
    stepRef.current = 0;
    
    setIsPlaying(true);
    scheduleNextStep();
    drawVisualizer();
  };

  const stopSong = () => {
    setIsPlaying(false);
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopSong();
    } else {
      startSong();
    }
  };

  const handleReset = () => {
    stopSong();
    setCurrentTime(0);
    setCurrentLyricIndex(0);
    stepRef.current = 0;
    if (audioContextRef.current) {
      songStartedTimeRef.current = audioContextRef.current.currentTime;
    }
  };

  // Sync timeline clock and highlight lyrics
  useEffect(() => {
    let interval: number;
    if (isPlaying && audioContextRef.current) {
      interval = window.setInterval(() => {
        const elapsed = audioContextRef.current!.currentTime - (songStartedTimeRef.current || 0);
        setCurrentTime(elapsed);

        // Find current lyric index
        const idx = LYRICS.findIndex(
          (l, i) => elapsed >= l.time && (i === LYRICS.length - 1 || elapsed < LYRICS[i + 1].time)
        );
        if (idx !== -1 && idx !== currentLyricIndex) {
          setCurrentLyricIndex(idx);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentLyricIndex]);

  // Visualizer loop drawing on canvas
  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isPlaying) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(3, 7, 18, 0.2)'; // Clear canvas with slight trailing
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 0.7;

        // Custom neon cyan and green visual color gradient
        const red = i * 4;
        const green = 255 - i * 2;
        const blue = 150 + i * 2;
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };

    draw();
  };

  // Cleanup audio nodes on unmount
  useEffect(() => {
    return () => {
      stopSong();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const formatTime = (timeSecs: number) => {
    const mins = Math.floor(timeSecs / 60);
    const secs = Math.floor(timeSecs % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full bg-[#070c22]/60 border border-white/[0.05] rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col gap-6">
      
      {/* Background ambient neon circle glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Music size={16} className="text-neon-cyan animate-pulse" />
            <span className="text-[10px] text-neon-cyan font-bold tracking-widest uppercase">Live Synthesis Song Player</span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
            PumpBounty Theme Song <Sparkles size={14} className="text-toxic-yellow animate-spin" />
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Synthesized programmatically on your GPU/CPU via Web Audio API. 100% serverless, zero external widgets required.
          </p>
        </div>

        {/* BPM & Synth Dials */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Tempo (BPM)</span>
            <input 
              type="range" 
              min={90} 
              max={140} 
              value={bpm} 
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-24 accent-neon-green h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Synth Lead</span>
            <select
              value={synthType}
              onChange={(e: any) => setSynthType(e.target.value)}
              className="bg-[#030712] border border-white/[0.06] rounded-md text-[10px] text-slate-350 py-1 px-2 focus:outline-none focus:border-neon-cyan"
            >
              <option value="sawtooth">Retro (Saw)</option>
              <option value="square">Cyber (Square)</option>
              <option value="triangle">Melodic (Tri)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Player Controls & Visualizer Canvas */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-[#030712]/50 border border-white/[0.04] p-5 rounded-xl justify-between">
          <div className="flex flex-col gap-3">
            {/* Visualizer Canvas */}
            <div className="w-full h-32 rounded-lg bg-[#030712] border border-white/[0.03] overflow-hidden relative flex items-center justify-center">
              <canvas 
                ref={canvasRef} 
                className="w-full h-full object-cover"
                width={300}
                height={128}
              />
              {!isPlaying && (
                <div className="absolute text-[10px] font-mono text-slate-600 flex flex-col items-center gap-1.5 uppercase select-none">
                  <RotateCcw size={16} className="animate-spin duration-3000" />
                  <span>Click Play to Generate Audio</span>
                </div>
              )}
            </div>

            {/* Time progress bar */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>1:45</span>
            </div>
          </div>

          {/* Action Row Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayToggle}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-98 ${
                isPlaying 
                  ? 'bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-950/30' 
                  : 'bg-gradient-to-r from-neon-green to-neon-cyan text-[#030712] hover:brightness-110 shadow-neon-green/10'
              }`}
            >
              {isPlaying ? (
                <><Pause size={14} className="fill-current" /> Pause Song</>
              ) : (
                <><Play size={14} className="fill-current" /> Play Song</>
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-3 border border-white/[0.06] hover:bg-white/[0.03] text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Reset Track"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Synced Karaoke Scrolling Lyrics */}
        <div className="lg:col-span-7 border border-white/[0.04] bg-[#030712]/30 p-5 rounded-xl flex flex-col justify-center min-h-[180px]">
          <div className="flex flex-col gap-2 font-mono text-center">
            
            {/* Previous Line */}
            <div className="text-[10px] text-slate-600 truncate opacity-60">
              {currentLyricIndex > 0 ? LYRICS[currentLyricIndex - 1].text : '...'}
            </div>

            {/* Current Highlighted Line */}
            <div className="text-sm md:text-base font-extrabold text-white leading-normal glow-cyan py-2.5 border-y border-white/[0.03] px-3 my-1">
              <span className="bg-gradient-to-r from-neon-cyan via-neon-green to-neon-cyan bg-clip-text text-transparent">
                {LYRICS[currentLyricIndex]?.text || 'Loading sequence...'}
              </span>
            </div>

            {/* Next Line */}
            <div className="text-[10px] text-slate-500 truncate opacity-80">
              {currentLyricIndex < LYRICS.length - 1 ? LYRICS[currentLyricIndex + 1].text : '...'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
