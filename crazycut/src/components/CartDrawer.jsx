import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useCart } from '@/lib/cartStore';
import { useAuth } from '@/lib/AuthContext';
import { formatINR } from '@/lib/format';

export default function CartDrawer() {
  const { items, open, setOpen, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setOpen(false)} />
      <aside className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <p className="eyebrow">Your Cut Pieces</p>
            <h2 className="font-display text-2xl mt-1">The Cart</h2>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="p-2 hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              <p className="font-display text-2xl">Your loom is empty</p>
              <p className="text-sm text-muted-foreground max-w-[24ch]">Select a cut piece and visualize it stitched before it joins your cart.</p>
              <button onClick={() => { setOpen(false); navigate('/shop'); }} className="btn-loom-ghost mt-2">Browse the gallery</button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map(item => (
                <li key={item.key} className="flex gap-4 pb-5 border-b border-border">
                  <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-muted">
                    <Image src={item.image_url} fittingType="fill" className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg leading-tight truncate">{item.fabric_name}</h3>
                    {item.garment_type && <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">For: {item.garment_type}</p>}
                    <p className="font-mono text-sm text-foreground mt-2">{formatINR(item.price)}/m</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button onClick={() => updateQty(item.key, item.quantity - 1)} className="px-2 py-1.5 hover:bg-muted" aria-label="Decrease metres"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="px-3 font-mono text-sm">{item.quantity}</span>
                        <button onClick={() => updateQty(item.key, item.quantity + 1)} className="px-2 py-1.5 hover:bg-muted" aria-label="Increase metres"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <button onClick={() => removeItem(item.key)} className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 bg-background">
            <div className="flex items-center justify-between mb-4">
              <span className="eyebrow">Subtotal</span>
              <span className="font-display text-3xl">{formatINR(subtotal)}</span>
            </div>
            <button onClick={() => { setOpen(false); navigate('/checkout'); }} className="btn-loom-solid w-full">
              {isAuthenticated ? 'Proceed to checkout' : 'Sign in to checkout'} <ArrowRight className="w-4 h-4" />
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground text-center mt-3">From loom to your doorstep</p>
          </div>
        )}
      </aside>
    </>
  );
}