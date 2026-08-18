import { useEffect, useState } from 'react';
import { X, Sparkles, ArrowRight, Maximize2, ScanFace } from 'lucide-react';
import { Image } from '@/components/ui/image';
import VisualizeCanvas from '@/components/VisualizeCanvas';

const GARMENTS = [
  { key: 'Shirt', desc: "Men's formal & casual button-downs" },
  { key: 'Pants', desc: 'Trousers & chinos' },
];

export default function VisualizeModal({ fabric, defaultGarment = 'Shirt', onClose, onAddToCart }) {
  const [garment, setGarment] = useState(defaultGarment);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-6xl h-[88vh] bg-background shadow-2xl flex flex-col animate-scale-in">
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-border">
          <div>
            <p className="eyebrow">Visualize It · Photoreal Try-On</p>
            <h2 className="font-display text-3xl mt-1">{fabric.name}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 grid lg:grid-cols-2 overflow-hidden">
          <div className="relative border-b lg:border-b-0 lg:border-r border-border bg-muted/30 p-6 sm:p-8 flex flex-col">
            <p className="eyebrow mb-4">Source fabric</p>
            <div className="relative flex-1 overflow-hidden bg-muted">
              <Image src={fabric.image_url} fittingType="fill" className="w-full h-full" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/80">{fabric.brand} · {fabric.weave_type}</p>
                  <p className="font-display italic text-background text-xl">{fabric.color}</p>
                </div>
                <Maximize2 className="w-4 h-4 text-background/70" />
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {['Print scale preserved 1:1', 'Realistic creases & drape', 'Photoreal studio model'].map(t => (
                <li key={t} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"><span className="w-4 h-px bg-accent" />{t}</li>
              ))}
            </ul>
          </div>

          <div className="relative flex flex-col">
            <div className="px-6 sm:px-8 pt-6">
              <p className="eyebrow mb-4">Garment · on model</p>
              <div className="flex flex-wrap gap-2">
                {GARMENTS.map(g => (
                  <button key={g.key} onClick={() => setGarment(g.key)} className={`font-mono text-xs uppercase tracking-[0.14em] px-4 py-2.5 border transition-colors ${garment === g.key ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/70 hover:border-foreground'}`}>{g.key}</button>
                ))}
              </div>
              <p className="mt-3 font-display italic text-lg text-muted-foreground">{GARMENTS.find(g => g.key === garment).desc}</p>
            </div>
            <div className="relative flex-1 m-6 sm:m-8 overflow-hidden bg-gradient-to-b from-background to-muted/40">
              <VisualizeCanvas
                fabricImage={fabric.image_url}
                garmentType={garment.toLowerCase()}
                fabricName={fabric.name}
                fabricType={fabric.fabric_type}
                brand={fabric.brand}
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground bg-background/70 px-2.5 py-1.5">
                <ScanFace className="w-3.5 h-3.5" /> AI-rendered fit · inspirational
              </div>
            </div>
            <div className="px-6 sm:px-8 pb-6 flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hidden sm:block">When switching, the unselected garment stays neutral</p>
              <button onClick={() => onAddToCart(garment)} className="btn-loom-solid"><Sparkles className="w-4 h-4" /> Add this cut piece <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}