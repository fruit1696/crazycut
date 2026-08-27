import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Package, DollarSign, Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { supabase, fabricToFrontend } from '@/api/supabaseClient';
import { Image } from '@/components/ui/image';
import { formatINR } from '@/lib/format';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const [fabrics, setFabrics] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('inventory');

  const load = async () => {
    setLoading(true);
    try {
      const [
        { data: fData, error: fError },
        { data: oData, error: oError }
      ] = await Promise.all([
        supabase.from('fabrics').select('*').eq('archived', false).order('created_date', { ascending: false }).limit(200),
        supabase.from('orders').select('*, items:order_items(*)').order('created_date', { ascending: false }).limit(200)
      ]);
      
      if (fError) throw new Error(fError.message);
      if (oError) throw new Error(oError.message);
      
      setFabrics((fData || []).map(fabricToFrontend));
      setOrders(oData || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);

  const deleteFabric = async (id) => {
    if (!confirm('Delete this cut piece?')) return;
    const { error } = await supabase.from('fabrics').delete().eq('id', id);
    if (error) console.error(error.message);
    load();
  };
  const updateStatus = async (id, status) => { 
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) console.error(error.message);
    load(); 
  };

  const stats = [
    { icon: Boxes, label: 'Cut pieces', value: fabrics.length },
    { icon: Package, label: 'Orders', value: orders.length },
    { icon: DollarSign, label: 'Revenue', value: formatINR(revenue) },
    { icon: Package, label: 'Pending', value: orders.filter(o => o.status === 'pending').length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-10 py-10">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground mb-8"><ArrowLeft className="w-4 h-4" />Back to store</Link>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow mb-3">Atelier Control</p>
            <h1 className="font-display text-5xl">Admin loom</h1>
          </div>
          <Link to="/admin/fabric/new" className="btn-loom-solid"><Plus className="w-4 h-4" /> Add cut piece</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border mb-10">
          {stats.map(s => (
            <div key={s.label} className="bg-background p-6">
              <s.icon className="w-5 h-5 text-accent mb-3" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</p>
              <p className="font-display text-4xl mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-6 mb-6 border-b border-border">
          {[['inventory', 'Inventory'], ['orders', 'Orders']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`pb-4 font-mono text-xs uppercase tracking-[0.2em] ${tab === k ? 'text-foreground border-b-2 border-foreground' : 'text-muted-foreground'}`}>{l}</button>
          ))}
        </div>

        {loading ? <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-border border-t-foreground rounded-full animate-spin" /></div> : tab === 'inventory' ? (
          <div className="border border-border overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead><tr className="border-b border-border">
                {['Fabric', 'Type', 'Pattern', 'Price / set', 'Stock (sets)', 'Actions'].map(h => <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground px-4 py-3">{h}</th>)}
              </tr></thead>
              <tbody>
                {fabrics.map(f => (
                  <tr key={f.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-12 overflow-hidden bg-muted"><Image src={f.image_url} fittingType="fill" className="w-full h-full" /></div><span className="font-display text-base">{f.name}</span></div></td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{f.fabric_type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{f.pattern}</td>
                    <td className="px-4 py-3 font-mono text-sm">{formatINR(f.price)}</td>
                    <td className="px-4 py-3 font-mono text-sm">{f.stock_quantity}</td>
                    <td className="px-4 py-3"><div className="flex gap-3"><Link to={`/admin/fabric/${f.id}`} className="hover:text-accent"><Pencil className="w-4 h-4" /></Link><button onClick={() => deleteFabric(f.id)} className="hover:text-destructive"><Trash2 className="w-4 h-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-border overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead><tr className="border-b border-border">
                {['Order', 'Date', 'Items', 'Total', 'Status'].map(h => <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground px-4 py-3">{h}</th>)}
              </tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{o.id.slice(-8)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{new Date(o.created_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-mono text-xs">{(o.items || []).length}</td>
                    <td className="px-4 py-3 font-mono text-sm">${o.total?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="font-mono text-xs border border-border bg-background px-2 py-1">
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground font-display text-xl">No orders yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
