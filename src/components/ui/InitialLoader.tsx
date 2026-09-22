import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ShieldCheck, Database, Navigation, Sparkles } from 'lucide-react';

interface InitialLoaderProps {
  onComplete?: () => void;
}

const STATUS_MESSAGES = [
  { text: 'INITIALIZING DRIVEIQ OS', icon: Cpu, targetProgress: 20 },
  { text: 'LOADING VEHICLE DATABASE', icon: Database, targetProgress: 45 },
  { text: 'INITIALIZING INTELLIGENCE ENGINE', icon: Sparkles, targetProgress: 70 },
  { text: 'PREPARING VEHICLE DISCOVERY', icon: Navigation, targetProgress: 90 },
  { text: 'SYSTEM READY', icon: ShieldCheck, targetProgress: 100 },
];

export const InitialLoader: React.FC<InitialLoaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    // Smooth progress simulation reflecting actual boot cycle
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }

        const nextProgress = prev + Math.floor(Math.random() * 8) + 4;
        const currentCap = Math.min(nextProgress, 100);

        // Update status text based on current progress
        if (currentCap > 85) setStatusIndex(4);
        else if (currentCap > 65) setStatusIndex(3);
        else if (currentCap > 40) setStatusIndex(2);
        else if (currentCap > 18) setStatusIndex(1);

        return currentCap;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  const CurrentIcon = STATUS_MESSAGES[statusIndex].icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050A15] text-slate-100 overflow-hidden select-none"
        >
          {/* Ambient Background Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0%,rgba(59,130,246,0.06)_45%,transparent_70%)] pointer-events-none" />
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none" />

          {/* Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Central Automotive Tech Radar / Orbit Visualization */}
          <div className="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80 mb-8">
            {/* Outer Orbit Ring 1 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-cyan-500/20 border-t-cyan-400/60 border-r-transparent"
            />

            {/* Orbit Ring 2 (Reverse Spin) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-4 rounded-full border border-blue-500/20 border-b-blue-400/60 border-l-transparent"
            />

            {/* Inner Tech Ring with Segment Dots */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-10 rounded-full border border-dashed border-cyan-400/30"
            />

            {/* Outer Radar Sweep Line */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(6,182,212,0.15)_360deg)] pointer-events-none"
            />

            {/* Orbiting Telemetry Dots */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 flex items-start justify-center pointer-events-none"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
            </motion.div>

            {/* Center Core Glassmorphic Lockup */}
            <div className="relative z-10 flex flex-col items-center justify-center w-48 h-48 sm:w-52 sm:h-52 rounded-full bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
              {/* Inner Pulsing Glow */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-cyan-500/10 pointer-events-none"
              />

              {/* DRIVEIQ Logo Branding */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                DRIVE<span className="text-cyan-400">IQ</span>
              </h1>

              <p className="mt-1 text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-cyan-400/80 uppercase">
                Automotive Intelligence
              </p>
            </div>
          </div>

          {/* Status Text Readout */}
          <div className="w-80 sm:w-96 px-4 flex flex-col items-center">
            {/* Status Indicator */}
            <div className="flex items-center gap-2.5 h-6 mb-3 text-cyan-300 text-xs sm:text-sm font-mono tracking-wider">
              <CurrentIcon className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{STATUS_MESSAGES[statusIndex].text}</span>
            </div>

            {/* Progress Percentage & Bar */}
            <div className="w-full">
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono text-slate-400 mb-1.5 tracking-wider">
                <span>SYSTEM INITIALIZATION</span>
                <span className="text-cyan-400 font-bold">{progress}%</span>
              </div>

              {/* Sleek Segmented Progress Bar Container */}
              <div className="w-full h-1.5 bg-slate-900/90 rounded-full p-0.5 border border-cyan-500/20 overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-300 rounded-full shadow-[0_0_12px_#06b6d4]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Minimal Grid Coordinates Footer */}
            <div className="mt-6 flex items-center gap-4 text-[9px] font-mono text-slate-500/70 tracking-widest uppercase">
              <span>SYS_VER 2.10.0</span>
              <span>•</span>
              <span>NODE_ACTIVE</span>
              <span>•</span>
              <span>LATENCY 12MS</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
