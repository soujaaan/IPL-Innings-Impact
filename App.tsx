import React, { useEffect, useState } from "react";
import InningsChart from "./components/InningsChart";
import Filters from "./components/Filters";
import { loadInningsData } from "./data";
import { FilterState, InningsData, StoryAct } from "./types";

const App: React.FC = () => {
  const [data, setData] = useState<InningsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [act, setAct] = useState<StoryAct>(1);

  const [filters, setFilters] = useState<FilterState>({
    minRuns: 0,
    minImpact: 0,
    revealNames: false,
    showTop100: false,
    showZone: true,
  });

  useEffect(() => {
    loadInningsData().then((rows) => {
      setData(rows);
      setLoading(false);
    });
  }, []);

  const nextAct = () => setAct(prev => Math.min(6, prev + 1) as StoryAct);
  const prevAct = () => setAct(prev => Math.max(1, prev - 1) as StoryAct);

  const NarrativeContent = () => {
    switch (act) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-sky-400 text-[10px] font-black tracking-[0.6em] mb-4 uppercase opacity-60">Act I: Orientation</h2>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.8] tracking-tighter uppercase">THE SCALE <br/>OF HISTORY.</h1>
            <p className="text-slate-400 text-2xl font-serif-italic leading-tight tracking-tight">
              Every point represents a single innings. <span className="text-white opacity-20 italic">A moment of effort recorded.</span>
            </p>
            <div className="flex gap-8 pt-4">
              <div className="space-y-1"><span className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">Horizontal</span><p className="text-sm text-slate-400">Volume (Runs)</p></div>
              <div className="space-y-1"><span className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">Vertical</span><p className="text-sm text-slate-400">Consequence (Impact)</p></div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-indigo-400 text-[10px] font-black tracking-[0.6em] mb-4 uppercase opacity-60">Act II: The Fracture</h2>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.8] tracking-tighter uppercase">SAME RUNS.<br/>DIFFERENT<br/>WEIGHTS.</h1>
            <p className="text-slate-400 text-2xl font-serif-italic leading-tight tracking-tight">Observe the vertical spread for fixed runs.</p>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">A 50 can be a stat-padder's dream or a team's survival. In IPL, volume is secondary; <span className="text-slate-300 font-serif-italic italic">consequence is the only truth.</span></p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-rose-500 text-[10px] font-black tracking-[0.6em] mb-4 uppercase opacity-60">Act III: Resistance</h2>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.8] tracking-tighter uppercase">PRESSURE<br/>CREATES VALUE.</h1>
            <p className="text-slate-400 text-2xl font-serif-italic leading-tight tracking-tight">Value is mined where the game resists.</p>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">We've mapped the intensity of situational pressure. Deep <span className="text-rose-600 font-bold">Rose</span> markers represent innings forged in the fire of high-leverage moments.</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-emerald-500 text-[10px] font-black tracking-[0.6em] mb-4 uppercase opacity-80">Act IV: The Value Zone</h2>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.8] tracking-tighter uppercase">THE IMPACT<br/>ANCHORS.</h1>
            <p className="text-slate-400 text-2xl font-serif-italic leading-tight tracking-tight">Where efficiency meets necessity.</p>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">Highlighted in <span className="text-emerald-500 font-bold">Emerald Green</span> are "Impact Anchors"—30-50 runs scored under extreme pressure. <span className="text-emerald-400 font-serif-italic italic">These are the innings that actually win trophies.</span></p>
          </div>
        );
      default: return null;
    }
  };

  const getActColors = () => {
    switch (act) {
      case 1: return { b1: '#0ea5e9', b2: '#0ea5e9' };
      case 2: return { b1: '#6366f1', b2: '#4f46e5' };
      case 3: return { b1: '#f43f5e', b2: '#7f1d1d' }; 
      case 4: return { b1: '#10b981', b2: '#064e3b' }; 
      case 5: return { b1: '#6366f1', b2: '#020617' };
      case 6: return { b1: '#7f1d1d', b2: '#020617' }; // Moody deep red/black
      default: return { b1: '#1e293b', b2: '#020617' };
    }
  };

  const colors = getActColors();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-[#020617] text-white font-black tracking-widest uppercase animate-pulse">Loading Dataset...</div>;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#020617] relative">
      {/* Background blobs for Act 6 are much larger and move more drastically */}
      <div className={`blob blob-1 transition-all duration-[2000ms] ${act === 6 ? 'scale-[2.5] opacity-20 -translate-x-1/4 -translate-y-1/4' : ''}`} style={{ backgroundColor: colors.b1 }}></div>
      <div className={`blob blob-2 transition-all duration-[2000ms] ${act === 6 ? 'scale-[3] opacity-20 translate-x-1/4 translate-y-1/4' : ''}`} style={{ backgroundColor: colors.b1 }}></div>
      
      <div className={`absolute inset-0 bg-slate-950/20 transition-all duration-1000 z-0 ${act === 6 ? 'backdrop-blur-[12px] bg-black/70' : 'backdrop-blur-[4px]'}`}></div>

      <main className="flex-1 flex overflow-hidden relative z-10">
        {act <= 4 && (
          <aside className="w-[550px] border-r border-white/5 bg-slate-950/40 backdrop-blur-3xl z-20 flex flex-col justify-center px-20 animate-in slide-in-from-left duration-700">
            <NarrativeContent />
          </aside>
        )}

        {act === 5 && (
          <aside className="w-[480px] z-20 flex flex-col animate-in slide-in-from-left duration-700">
            <Filters filters={filters} setFilters={setFilters} />
          </aside>
        )}

        <section className={`flex-1 relative transition-all duration-[1200ms] ${act === 6 ? 'scale-150 opacity-0 blur-[100px]' : 'scale-100 opacity-100'}`}>
          <InningsChart data={data} filters={filters} act={act} />
        </section>

        {act === 6 && (
           <div className="absolute inset-0 flex flex-col items-center justify-center z-50 p-6 animate-in fade-in zoom-in-95 duration-[1200ms]">
            {/* Glassmorphic Card inspired by reference */}
            <div className="relative w-full max-w-[440px] aspect-[1/1.2] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-12 flex flex-col justify-between overflow-hidden shadow-2xl ring-1 ring-white/5">
              
              {/* Header Branding */}
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] leading-none">IPL</p>
                  <p className="text-slate-400 text-[8px] uppercase tracking-[0.2em] opacity-60">2008-2025</p>
                </div>0
                <p className="text-white/40 text-[9px] font-medium uppercase tracking-widest">Let's create</p>
              </div>

              {/* Central Bold Typography */}
              <div className="relative z-10">
                <h1 className="text-[12vw] lg:text-[68px] font-black text-white leading-[0.9] tracking-tighter uppercase select-none">
                  Runs<br/>
                  are Easy.<br/>
                  Impact<br/>
                  is Earned.
                </h1>
              </div>

              {/* Social/Reset Handle */}
              <div className="relative z-10 flex justify-between items-end">
                  <div className="space-y-0">
                    <p className="text-white text-[10px] font-semibold tracking-wide">@IPL_Research</p>
                  </div>
                  <button 
                    onClick={() => setAct(1)}
                    className="text-white/40 hover:text-white transition-colors text-[9px] font-black uppercase tracking-[0.3em]"
                  >
                    RESET
                  </button>
              </div>

              {/* Background Glow inside the card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-radial from-rose-600/30 to-transparent pointer-events-none z-0 opacity-50 blur-xl"></div>
            </div>

            {/* Footnote */}
            <div className="absolute bottom-10 left-0 w-full text-center">
                <p className="font-montserrat text-white text-[12px] opacity-80 tracking-wide uppercase">
                    Made with &lt;3 by @soujaaan
                </p>
            </div>
          </div>
        )}
      </main>

      <footer className={`h-28 border-t border-white/5 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center px-16 z-40 relative transition-all duration-700 ${act === 6 ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-screen-2xl w-full flex justify-between items-center">
          <button 
            onClick={prevAct} disabled={act === 1}
            className={`text-[10px] font-black tracking-[0.4em] uppercase transition-all flex items-center gap-3 ${act === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-white'}`}
          >
            ← Back
          </button>
          <div className="flex gap-6 items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-700 ${act === i ? 'w-24 bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' : (act > i ? 'w-8 bg-slate-700' : 'w-2 bg-slate-800')}`} />
            ))}
          </div>
          <button 
            onClick={nextAct}
            className="group flex items-center gap-12 bg-white/5 hover:bg-white/10 border border-white/10 pl-12 pr-4 py-3 rounded-full transition-all"
          >
            <span className="text-[10px] font-black tracking-[0.6em] uppercase text-white/90">
              {act === 1 ? 'Explore' : act === 4 ? 'Discover' : act === 5 ? 'Resolution' : 'Proceed'}
            </span>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-slate-950 text-xl">→</span>
            </div>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;