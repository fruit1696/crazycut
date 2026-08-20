import { useState } from 'react';
import { X } from 'lucide-react';

const PHONE = '919425333460';

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const msg = encodeURIComponent("Hi! I have a question about the cut-piece fabrics at CrazyCutPiece.");

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {open && (
        <div className="mb-3 w-72 bg-background border border-border shadow-2xl animate-scale-in overflow-hidden">
          <div className="bg-[#128C7E] text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-display text-lg leading-tight">CrazyCutPiece</p>
              <p className="text-[11px] opacity-90 font-mono">Typically replies in minutes</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1 hover:bg-white/10 rounded"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-4">
            <div className="bg-muted/60 px-3 py-2.5 mb-3 text-sm text-foreground/80 rounded-sm">
              Hello 👋 How can we help you find the right cut piece today?
            </div>
            <a
              href={`https://wa.me/${PHONE}?text=${msg}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#128C7E] text-white font-mono text-xs uppercase tracking-[0.18em] px-4 py-3 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#128C7E] text-white shadow-[0_8px_24px_-4px_rgba(18,140,126,0.5)] flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <svg viewBox="0 0 32 32" className="w-7 h-7" fill="currentColor" aria-hidden="true">
            <path d="M16.04 3C9.43 3 4.04 8.39 4.04 15c0 2.13.56 4.12 1.54 5.85L3 29l8.36-2.55A11.93 11.93 0 0 0 16.04 27C22.66 27 28.04 21.62 28.04 15S22.66 3 16.04 3zm0 21.8c-1.84 0-3.56-.5-5.04-1.37l-.36-.21-3.74 1.14 1.15-3.64-.24-.38A9.78 9.78 0 0 1 6.24 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8zm5.38-7.34c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
          </svg>
        )}
      </button>
    </div>
  );
}