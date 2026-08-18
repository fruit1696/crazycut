import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { formatINR } from '@/lib/format';

const STAGES = ['pending', 'processing', 'shipped', 'delivered'];

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try { setOrders(await base44.entities.Order.filter({}, '-created_date', 50)); }
            catch (e) { console.error(e); }
            setLoading(false);
        })();
    }, []);

    if (loading) return <div className="pt-[112px] min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-border border-t-foreground rounded-full animate-spin" /></div>;

    return (
        <div className="pt-[112px]">
            <div className="mx-auto max-w-[1000px] px-6 lg:px-10 py-6 sm:py-8">
                <p className="eyebrow mb-3">Your orders</p>
                <h1 className="font-display text-4xl mb-6">From loom to door</h1>
                {orders.length === 0 ? (
                    <div className="py-20 text-center border border-border">
                        <Package className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                        <p className="font-display text-3xl">No orders yet</p>
                        <Link to="/shop" className="btn-loom-ghost mt-6 inline-flex">Browse the gallery <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map(o => {
                            const stageIdx = o.status === 'cancelled' ? -1 : STAGES.indexOf(o.status);
                            return (
                                <div key={o.id} className="border border-border p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-border">
                                        <div>
                                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{new Date(o.created_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                            <p className="font-display text-2xl mt-1">Order {o.id.slice(-8)}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border ${o.status === 'cancelled' ? 'border-destructive text-destructive' : 'border-accent text-accent'}`}>{o.status}</span>
                                            {o.payment_method === 'cod' && <span className="block mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Cash on Delivery</span>}
                                            <p className="font-display text-3xl mt-2">{formatINR(o.total)}</p>
                                        </div>
                                    </div>
                                    <ul className="divide-y divide-border my-4">
                                        {(o.items || []).map((i, idx) => (
                                            <li key={idx} className="flex gap-4 py-3">
                                                <div className="w-12 h-16 overflow-hidden bg-muted"><Image src={i.image_url} fittingType="fill" className="w-full h-full" /></div>
                                                <div className="flex-1"><p className="font-display text-lg leading-tight">{i.fabric_name}</p><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{i.quantity}m {i.garment_type ? `· ${i.garment_type}` : ''}</p></div>
                                                <span className="font-mono text-xs">{formatINR(i.price * i.quantity)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {o.status !== 'cancelled' && (
                                        <div className="flex items-center pt-4">
                                            {STAGES.map((s, idx) => (
                                                <div key={s} className="flex-1 flex items-center">
                                                    <div className={`w-3 h-3 rounded-full ${idx <= stageIdx ? 'bg-accent' : 'bg-border'}`} />
                                                    {idx < STAGES.length - 1 && <div className={`flex-1 h-px ${idx < stageIdx ? 'bg-accent' : 'bg-border'}`} />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex justify-between mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                                        {STAGES.map(s => <span key={s}>{s}</span>)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}