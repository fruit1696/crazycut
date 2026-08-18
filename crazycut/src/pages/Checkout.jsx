import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { supabase } from '@/api/supabaseClient';
import { useCart } from '@/lib/cartStore';
import { Image } from '@/components/ui/image';
import { formatINR } from '@/lib/format';

export default function Checkout() {
    const { items, subtotal, clear } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({ shipping_name: '', shipping_phone: '', shipping_address: '', shipping_city: '', shipping_state: '', shipping_zip: '', shipping_country: 'India', notes: '' });
    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(null);

    const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

    const placeOrder = async (e) => {
        e.preventDefault();
        if (items.length === 0) return;
        setPlacing(true);
        try {
            const orderId = crypto.randomUUID();
            const orderData = {
                id: orderId,
                subtotal, total: subtotal, status: 'pending', payment_method: 'cod',
                shipping_name: form.shipping_name, shipping_phone: form.shipping_phone, shipping_address: form.shipping_address, shipping_city: form.shipping_city, shipping_state: form.shipping_state, shipping_zip: form.shipping_zip, shipping_country: form.shipping_country, notes: form.notes
            };
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                orderData.user_id = session.user.id;
            } else {
                orderData.user_id = null;
            }

            const { error: orderErr } = await supabase.from('orders').insert(orderData);
            if (orderErr) throw new Error(orderErr.message);

            const itemsPayload = items.map(i => ({ fabric_id: i.fabric_id, fabric_name: i.fabric_name, brand: i.brand, price: i.price, quantity: i.quantity, garment_type: i.garment_type, image_url: i.image_url, order_id: orderId }));
            if (itemsPayload.length > 0) {
                const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
                if (itemsErr) throw new Error(itemsErr.message);
            }

            clear();
            setPlaced({ ...orderData, id: orderId });
        } catch (err) { console.error(err); alert('Could not place order. Please try again.'); }
        setPlacing(false);
    };

    if (placed) {
        return (
            <div className="pt-[112px] min-h-screen flex items-center justify-center px-6">
                <div className="max-w-lg text-center animate-scale-in">
                    <div className="w-16 h-16 mx-auto rounded-full border border-accent flex items-center justify-center mb-8"><Check className="w-7 h-7 text-accent" /></div>
                    <p className="eyebrow mb-4">Order received</p>
                    <h1 className="font-display text-5xl">Your order is confirmed.</h1>
                    <p className="mt-5 text-muted-foreground">We've received your cut pieces and will start preparing them shortly.</p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Cash on Delivery confirmed</p>
                    <div className="mt-10 flex justify-center gap-4">
                        <button onClick={() => navigate('/orders')} className="btn-loom-solid">Track your order <ArrowRight className="w-4 h-4" /></button>
                        <button onClick={() => navigate('/shop')} className="btn-loom-ghost">Keep browsing</button>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return <div className="pt-[112px] min-h-screen flex flex-col items-center justify-center gap-4"><p className="font-display text-4xl">Your cart is empty</p><button onClick={() => navigate('/shop')} className="btn-loom-ghost">Browse the gallery</button></div>;
    }

    const fields = [
        ['shipping_name', 'Full name', 'text'], ['shipping_phone', 'Phone number', 'tel'], ['shipping_address', 'Address', 'text'], ['shipping_city', 'City', 'text'], ['shipping_state', 'State', 'text'], ['shipping_zip', 'PIN', 'text'], ['shipping_country', 'Country', 'text']
    ];

    return (
        <div className="pt-[112px]">
            <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-6 sm:py-8">
                <p className="eyebrow mb-3">Seamless Checkout</p>
                <h1 className="font-display text-4xl mb-6">Confirm your cut pieces</h1>
                <form onSubmit={placeOrder} className="grid lg:grid-cols-2 gap-10">
                    <div>
                        <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">Shipping</h2>
                        <div className="space-y-4">
                            {fields.map(([k, l, t]) => (
                                <label key={k} className="block">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{l}</span>
                                    <input required type={t} value={form[k]} onChange={e => set(k, e.target.value)} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none font-display text-lg" />
                                </label>
                            ))}
                            <label className="block">
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Notes for the Style Studio</span>
                                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none font-display text-lg resize-none" />
                            </label>
                        </div>
                    </div>
                    <div>
                        <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">Receipt</h2>
                        <ul className="divide-y divide-border">
                            {items.map(i => (
                                <li key={i.key} className="flex gap-4 py-4">
                                    <div className="w-16 h-20 overflow-hidden bg-muted"><Image src={i.image_url} fittingType="fill" className="w-full h-full" /></div>
                                    <div className="flex-1">
                                        <p className="font-display text-lg leading-tight">{i.fabric_name}</p>
                                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{i.quantity}m {i.garment_type ? `· ${i.garment_type}` : ''}</p>
                                    </div>
                                    <span className="font-mono text-sm">{formatINR(i.price * i.quantity)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 mb-6">
                            <p className="eyebrow mb-3">Loom to door</p>
                            <div className="flex items-center justify-between">
                                {['Loom', 'Cut', 'Pack', 'Ship', 'Door'].map((s, idx) => (
                                    <div key={s} className="flex-1 flex flex-col items-center text-center">
                                        <div className="w-full h-px bg-border mb-2 relative">{idx === 0 ? null : <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent" />}</div>
                                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="my-6 border border-border p-4 flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-accent" /></span>
                            <div>
                                <p className="font-display text-lg leading-tight">Cash on Delivery</p>
                                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mt-1">Pay in cash when your cut piece arrives · no advance payment</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-4 border-y border-border">
                            <span className="eyebrow">Total</span>
                            <span className="font-display text-4xl">{formatINR(subtotal)}</span>
                        </div>
                        <button type="submit" disabled={placing} className="btn-loom-solid w-full mt-8 disabled:opacity-50">{placing ? 'Placing…' : 'Place order (COD)'} <ArrowRight className="w-4 h-4" /></button>
                    </div>
                </form>
            </div>
        </div>
    );
}