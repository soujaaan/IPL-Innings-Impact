import React from 'react';
import { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  return (
    <div className="h-full flex flex-col p-12 gap-12 bg-slate-950/30 border-r border-white/5 act-active">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-[1px] bg-indigo-500/50"></div>
          <h3 className="text-indigo-400 text-[9px] font-black tracking-[0.5em] uppercase">Control Plane</h3>
        </div>
        <p className="text-white text-4xl font-serif-italic italic tracking-tight leading-tight">Personalize the lens.</p>
      </div>

      <div className="space-y-12">
        {/* Volume Threshold */}
        <div className="space-y-5 group">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] font-bold text-slate-500 group-hover:text-sky-400 transition-colors uppercase tracking-widest">Volume Threshold</label>
            <span className="text-3xl font-black text-white tabular-nums tracking-tighter">
              {filters.minRuns}<span className="text-[10px] text-slate-600 font-sans ml-1 uppercase tracking-normal">runs</span>
            </span>
          </div>
          <input
            type="range" min="0" max="100" step="5" value={filters.minRuns}
            onChange={(e) => setFilters(prev => ({ ...prev, minRuns: parseInt(e.target.value) }))}
            className="accent-sky-500"
          />
        </div>

        {/* Consequence Floor */}
        <div className="space-y-5 group">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">Consequence Floor</label>
            <span className="text-3xl font-black text-indigo-400 tabular-nums tracking-tighter">
              {filters.minImpact}<span className="text-[10px] text-indigo-900 font-sans ml-1 uppercase tracking-normal">pts</span>
            </span>
          </div>
          <input
            type="range" min="0" max="150" step="10" value={filters.minImpact}
            onChange={(e) => setFilters(prev => ({ ...prev, minImpact: parseInt(e.target.value) }))}
            className="accent-indigo-500"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4 pt-10 border-t border-white/5">
        <ToggleButton 
          active={filters.showZone} 
          label="Value Anchor Zone" 
          color="#10b981"
          onClick={() => setFilters(prev => ({ ...prev, showZone: !prev.showZone }))} 
        />
        <ToggleButton 
          active={filters.showTop100} 
          label="Elite Tier (Top 100)" 
          color="#6366f1"
          onClick={() => setFilters(prev => ({ ...prev, showTop100: !prev.showTop100 }))} 
        />
        <ToggleButton 
          active={filters.revealNames} 
          label="Reveal Player Labels" 
          color="#f8fafc"
          onClick={() => setFilters(prev => ({ ...prev, revealNames: !prev.revealNames }))} 
        />
      </div>

      <div className="mt-auto opacity-30">
        <p className="text-[8px] leading-relaxed text-slate-500 uppercase font-black tracking-[0.2em]">
          Derived from ball-by-ball win-probability shifts across 17 seasons of IPL competition data.
        </p>
      </div>
    </div>
  );
};

const ToggleButton = ({ active, label, onClick, color }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex justify-between items-center px-6 py-5 rounded-sm border transition-all duration-500 ${
      active 
        ? 'bg-white/5 border-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
        : 'bg-transparent border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/[0.02]'
    }`}
  >
    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
    <div className="relative flex items-center justify-center w-4 h-4">
      <div className={`absolute inset-0 rounded-full blur-[6px] opacity-40 transition-all ${active ? 'scale-150' : 'scale-0'}`} style={{ backgroundColor: color }}></div>
      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${active ? 'scale-125' : 'scale-75'}`} style={{ backgroundColor: active ? color : '#1e293b' }}></div>
    </div>
  </button>
);

export default Filters;