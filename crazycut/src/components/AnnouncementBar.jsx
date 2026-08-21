import { Truck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="fixed top-0 inset-x-0 z-40 flex h-[54px] items-center justify-center gap-3 bg-gradient-to-r from-[#7b1117] via-[#8f171d] to-[#7b1117] px-4 text-white lg:h-10">
      <Truck className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={2} />
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.24em] sm:text-xs">
        Free Shipping Across India <span className="opacity-50"></span>
      </p>
    </div>
  );
}
