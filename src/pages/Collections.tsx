import { motion } from "framer-motion";
import { Sparkles, ScrollText, Library, Compass, ArrowRight, BookCheck } from "lucide-react";
import { useTasbeehCatalog } from "@/features/tasbeeh/hooks/useTasbeeh";
import { useResolvedPalette } from "@/shared/components/ui/palette";
import { CornerSquircle } from "@/shared/components/CornerSquircle";

export default function Collections() {
  const palette = useResolvedPalette();
  const { sequences = [], isLoading } = useTasbeehCatalog();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <motion.div 
          animate={{ rotate: [0, 90, 180, 270, 360] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Compass size={42} className="text-primary/30" />
        </motion.div>
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] opacity-40 text-slate-500">
           Reading Divine Library...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-40">
      {/* Immersive Background Elements */}
      <div className="fixed top-0 left-0 w-full h-[60vh] pointer-events-none overflow-hidden opacity-40 dark:opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary blur-[160px] rounded-full opacity-30" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-600 blur-[140px] rounded-full opacity-20" />
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 px-5 pt-12 max-w-2xl mx-auto"
      >
        {/* Modern Minimal Header */}
        <header className="mb-14 flex items-end justify-between px-1">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="size-2 rounded-full bg-primary shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                Official Repository
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tightest text-slate-900 dark:text-white">
              Collections
            </h1>
          </div>
          <div className="size-14 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center text-primary">
            <Library size={24} />
          </div>
        </header>

        <div className="space-y-24">
          {sequences.map((seq, seqIdx) => (
            <section key={seq.id} className="relative">
              {/* Sequence Hero - Large typography, very modern separation */}
              <div className="mb-8 px-2 flex items-baseline justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight italic text-slate-800 dark:text-slate-100 mb-1">
                    {seq.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black italic text-primary/60">
                      V.{idxToRoman(seqIdx + 1)}
                    </span>
                    <div className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       {seq.items.length} Recitations
                    </span>
                  </div>
                </div>
                <div className="opacity-10 text-primary">
                  {seq.id === "legacy-collection" ? <Sparkles size={48} /> : <ScrollText size={48} />}
                </div>
              </div>

              {/* Phrase Cards - Modern, spaced out layout */}
              <div className="space-y-6">
                {seq.items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <CornerSquircle 
                      cornerRadius={32}
                      cornerSmoothing={1}
                      className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-none p-1 group cursor-pointer active:scale-[0.98] transition-all"
                    >
                      <div className="p-7 flex flex-col gap-8 relative overflow-hidden">
                        {/* Background subtle number */}
                        <div className="absolute -top-4 -right-2 text-[80px] font-black opacity-[0.03] italic pointer-events-none select-none">
                          {idx + 1}
                        </div>

                        {/* Top Badge Meta */}
                        <div className="flex items-center justify-between">
                           <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-inner">
                              <span className="text-[9px] font-black tracking-[0.1em] text-slate-400 uppercase">
                                Cycle Target
                              </span>
                              <div className="w-px h-3 mx-3 bg-slate-200 dark:bg-slate-700" />
                              <span className="text-[11px] font-black text-primary italic">
                                {item.target}
                              </span>
                           </div>
                           <div className="size-8 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 group-hover:text-primary transition-colors">
                              <ArrowRight size={14} />
                           </div>
                        </div>

                        {/* Primary Calligraphy Stack */}
                        <div className="flex flex-col items-center gap-4 text-center">
                          <h3 
                            className="text-4xl font-bold leading-relaxed Arabic-font text-slate-900 dark:text-slate-100 transition-transform group-hover:scale-105 duration-500" 
                            dir="rtl"
                          >
                            {item.text}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-[12px] font-black uppercase tracking-[0.15em] text-primary/50 group-hover:text-primary transition-colors italic">
                              {item.transliteration}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest max-w-[200px] line-clamp-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                               Recitation Mode Active
                            </p>
                          </div>
                        </div>
                      </div>
                    </CornerSquircle>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* High-End Design Footer */}
        <footer className="mt-40 pt-12 border-t border-slate-100 dark:border-slate-900 flex flex-col items-center gap-6">
           <div className="relative">
              <div className="absolute inset-0 bg-primary blur-2xl opacity-20" />
              <div className="relative size-12 rounded-3xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center text-slate-400">
                <BookCheck size={20} />
              </div>
           </div>
           <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">
                Authenticity Guaranteed
              </p>
              <p className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest opacity-60">
                 Source: Sahih-Verified Manuscripts
              </p>
           </div>
        </footer>
      </motion.main>
    </div>
  );
}

function idxToRoman(idx: number): string {
  const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return romans[idx - 1] || idx.toString();
}
