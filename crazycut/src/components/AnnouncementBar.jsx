import { Truck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="fixed top-0 inset-x-0 z-40 h-10 bg-foreground text-background flex items-center justify-center gap-3 px-4">
      <Truck className="w-4 h-4 flex-shrink-0" />
      <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-center">
        Free Shipping Across India <span className="opacity-50">·</span> Cash on Delivery Available
      </p>
    </div>
  );
}