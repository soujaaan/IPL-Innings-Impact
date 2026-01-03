import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Cell,
} from 'recharts';
import { InningsData, FilterState, StoryAct } from '../types';

interface InningsChartProps {
  data: InningsData[];
  filters: FilterState;
  act: StoryAct;
}

const CustomTooltip = ({ active, payload, revealNames }: any) => {
  if (active && payload && payload.length) {
    const data: InningsData = payload[0].payload;
    const isAnchor = data.runs >= 25 && data.runs <= 55 && data.impact >= 65;
    return (
      <div className="bg-slate-950/95 border border-white/10 p-6 shadow-2xl backdrop-blur-3xl rounded-none ring-1 ring-white/10">
        {revealNames && (
          <div className="mb-4 border-b border-white/5 pb-3">
            <p className={`text-[9px] font-bold uppercase tracking-[0.4em] leading-none mb-2 ${isAnchor ? 'text-emerald-400' : 'text-sky-400'}`}>
              {isAnchor ? 'Impact Anchor' : 'Profile Identified'}
            </p>
            <p className="text-2xl font-black text-white leading-none uppercase tracking-tighter">{data.batter}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-[10px] uppercase tracking-widest">
          <div>
            <span className="text-slate-500 block mb-1">Volume</span>
            <span className="text-white font-bold text-xl leading-none tracking-tighter">{data.runs} <span className="text-slate-600 text-xs">({data.balls})</span></span>
          </div>
          <div>
            <span className={`${isAnchor ? 'text-emerald-500' : 'text-indigo-400'} block mb-1`}>Impact</span>
            <span className={`${isAnchor ? 'text-emerald-400' : 'text-indigo-300'} font-bold text-xl leading-none tracking-tighter`}>{data.impact.toFixed(1)}</span>
          </div>
          <div className="col-span-2 pt-3 border-t border-white/5 flex justify-between items-end">
            <span className="text-slate-500 block">Leverage Ratio</span>
            <span className="text-white font-bold text-sm font-sans tracking-tight">{data.avg_pressure.toFixed(2)}x</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const InningsChart: React.FC<InningsChartProps> = ({ data, filters, act }) => {
  const zone = { x1: 25, x2: 55, y1: 65, y2: 180 };

  const processedData = useMemo(() => {
    if (act === 1) return data.filter((_, i) => i % 2 === 0);
    if (act === 2) {
      return data.filter(d => 
        (d.runs >= 29 && d.runs <= 31) || 
        (d.runs >= 49 && d.runs <= 51) || 
        (d.runs >= 98 && d.runs <= 102)
      );
    }
    if (act >= 5) {
      let filtered = data.filter(d => d.runs >= filters.minRuns && d.impact >= filters.minImpact);
      if (filters.showTop100) {
        return [...filtered].sort((a, b) => b.impact - a.impact).slice(0, 100);
      }
      return filtered;
    }
    return data;
  }, [data, act, filters]);

  const getPointStyle = (entry: InningsData) => {
    const isAnchor = entry.runs >= zone.x1 && entry.runs <= zone.x2 && entry.impact >= zone.y1;
    
    switch (act) {
      case 1:
        return { fill: '#334155', opacity: 0.1, radius: 2 };
      case 2:
        return { fill: '#6366f1', opacity: 0.6, radius: 2.5 };
      case 3:
        // Monochromatic Red Gradient as previously requested for Resistance
        const normP = Math.min(entry.avg_pressure / 2.5, 1);
        const r = Math.floor(244 + (127 - 244) * normP);
        const g = Math.floor(63 + (29 - 63) * normP);
        const b = Math.floor(94 + (29 - 94) * normP);
        return { 
          fill: `rgb(${r}, ${g}, ${b})`, 
          opacity: 0.5 + (0.4 * normP), 
          radius: 2.5 + (1.5 * normP)
        };
      case 4:
        if (isAnchor) {
          // Green Gradient for Value Zone
          const p = Math.min(entry.avg_pressure / 2.5, 1);
          return { 
            fill: `rgb(${Math.floor(16 + (52-16)*p)}, ${Math.floor(185 + (211-185)*p)}, ${Math.floor(129 + (153-129)*p)})`, 
            opacity: 1, 
            radius: 5 
          };
        }
        return { fill: '#334155', opacity: 0.04, radius: 1.5 };
      case 5:
        if (filters.showZone && isAnchor) {
          const p = Math.min(entry.avg_pressure / 2.5, 1);
          return { 
            fill: `rgb(${Math.floor(16 + (52-16)*p)}, ${Math.floor(185 + (211-185)*p)}, ${Math.floor(129 + (153-129)*p)})`, 
            opacity: 1, 
            radius: 4 
          };
        }
        if (filters.showTop100) return { fill: '#818cf8', opacity: 0.8, radius: 6 };
        // Base Blue/Indigo Gradient for everything else
        const p_base = Math.min(entry.avg_pressure / 2.5, 1);
        return { 
          fill: `rgb(${Math.floor(99 + (14-99)*p_base)}, ${Math.floor(102 + (165-102)*p_base)}, ${Math.floor(241 + (233-241)*p_base)})`, 
          opacity: 0.4, 
          radius: 2.5
        };
      default:
        return { fill: '#334155', opacity: 0.1, radius: 2 };
    }
  };

  return (
    <div className="w-full h-full p-8 lg:p-16 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 40, right: 40, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          
          <XAxis 
            type="number" 
            dataKey="runs" 
            domain={[0, 180]}
            stroke="#1e293b"
            tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'ACCUMULATED VOLUME (RUNS)', position: 'bottom', offset: 30, fill: '#334155', fontSize: 9, fontWeight: 800, letterSpacing: '0.4em' }}
          />
          <YAxis 
            type="number" 
            dataKey="impact" 
            domain={[0, 200]}
            stroke="#1e293b"
            tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'CONSEQUENCE (IMPACT)', angle: -90, position: 'insideLeft', offset: -40, fill: '#334155', fontSize: 9, fontWeight: 800, letterSpacing: '0.4em' }}
          />
          <ZAxis type="number" range={[10, 10]} />
          
          {(act === 4 || (act === 5 && filters.showZone)) && (
            <ReferenceArea x1={zone.x1} x2={zone.x2} y1={zone.y1} y2={zone.y2} fill="#10b981" fillOpacity={0.03} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.2} />
          )}

          <Tooltip content={<CustomTooltip revealNames={filters.revealNames} />} cursor={{ stroke: '#ffffff05', strokeWidth: 1 }} />

          <Scatter data={processedData} isAnimationActive={true} animationDuration={800}>
            {processedData.map((entry, index) => {
              const style = getPointStyle(entry);
              return <Cell key={`cell-${index}`} fill={style.fill} fillOpacity={style.opacity} r={style.radius} />;
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InningsChart;