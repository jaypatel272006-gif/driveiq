import React from 'react';
import { Vehicle, UserProfile } from '../../types/car';
import { generateWhyThisCarExplanation } from '../../services/whyThisCarEngine';
import { calculateRecommendation } from '../../services/recommendationEngine';
import { ScoreRing } from '../ui/ScoreRing';
import { X, CheckCircle, AlertTriangle, Cpu, ArrowRight, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface WhyThisCarModalProps {
  vehicle: Vehicle | null;
  profile: UserProfile;
  competitor?: Vehicle;
  onClose: () => void;
}

export const WhyThisCarModal: React.FC<WhyThisCarModalProps> = ({
  vehicle,
  profile,
  competitor,
  onClose
}) => {
  if (!vehicle) return null;

  const explanation = generateWhyThisCarExplanation(vehicle, profile, competitor);
  const result = calculateRecommendation(vehicle, profile);
  const { scoreBreakdown } = result;

  const chartData = [
    { fit: 'Budget', score: scoreBreakdown.budgetFit },
    { fit: 'Safety', score: scoreBreakdown.safetyFit },
    { fit: 'Usage', score: scoreBreakdown.usageFit },
    { fit: 'Comfort', score: scoreBreakdown.comfortFit },
    { fit: 'Running', score: scoreBreakdown.runningCostFit },
    { fit: 'Resale', score: scoreBreakdown.resaleFit }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  DriveIQ Signature Personal Intelligence
                </span>
                <h3 className="text-xl font-extrabold text-white">Why {vehicle.name}?</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* User Choice Profile Box */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Evaluated Against Your Active Profile
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {explanation.userSummary}
              </p>
            </div>

            {/* Sub-Score Fit Breakdown Bar Chart */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4" /> Personal Fit Sub-Scores Breakdown
              </h4>
              <div className="h-44 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="fit" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Why Matches You */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
                <CheckCircle className="w-4 h-4" />
                Why This Car Matches You
              </h4>
              <ul className="space-y-2">
                {explanation.matchHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Competitor Analysis */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Competitive Advantage Breakdown
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {explanation.competitorComparison}
              </p>
            </div>

            {/* Trade-offs & Things to Consider */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-4 h-4" />
                Trade-offs & Considerations
              </h4>
              <ul className="space-y-2">
                {explanation.tradeOffs.map((tradeOff, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{tradeOff}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Final AI Verdict */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/40">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1 font-mono">
                Final Personal Match Score: {result.matchPercentage}%
              </h5>
              <p className="text-xs text-slate-200 leading-relaxed">
                {explanation.detailedVerdict}
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">DriveIQ Recommendation Engine v5.0</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20"
            >
              Close Explanation
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
