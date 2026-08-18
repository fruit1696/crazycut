import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { supabase, fabricToFrontend, fabricToDb } from '@/api/supabaseClient';
import { Image } from '@/components/ui/image';
import { BRANDS } from '@/lib/brands';

const TYPES = ['Silk', 'Cotton', 'Linen', 'Wool', 'Blend'];
const FAMILIES = ['Neutral', 'Indigo', 'Earth', 'Jewel'];
const PATTERNS = ['Solid', 'Striped', 'Floral', 'Geometric', 'Jacquard'];
const WEIGHTS = ['Lightweight', 'Midweight', 'Heavyweight'];

const empty = { name: '', description: '', price: 0, brand: '', fabric_type: 'Cotton', weave_type: '', color: '', color_family: 'Neutral', pattern: 'Solid', weight: 'Midweight', image_url: '', detail_image_url: '', material_composition: '', width_inches: 58, origin: '', stock_quantity: 0, featured: false, sku: '' };

function Field({ label, options, value, onChange }) {
    return (
        <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
            <select value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full bg-background border-b border-border py-2 focus:border-accent focus:outline-none font-display text-lg">
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </label>
    );
}

export default function AdminFabricEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const editing = Boolean(id);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try { 
                const { data, error } = await supabase.from('fabrics').select('*').eq('id', id).single();
                if (error) throw new Error(error.message);
                const f = fabricToFrontend(data);
                setForm({ ...empty, ...f }); 
            }
            catch (e) { console.error(e); }
        })();
    }, [id]);

    const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

    const upload = async (e, field) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('fabrics').upload(fileName, file);
            if (uploadError) throw new Error(uploadError.message);
            const { data: { publicUrl } } = supabase.storage.from('fabrics').getPublicUrl(fileName);
            const file_url = publicUrl;
            set(field, file_url);
        } catch (err) { console.error(err); alert('Upload failed'); }
        setUploading(false);
    };

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form, price: Number(form.price), width_inches: Number(form.width_inches), stock_quantity: Number(form.stock_quantity), featured: Boolean(form.featured) };
            if (editing) {
                const { error } = await supabase.from('fabrics').update(fabricToDb(payload)).eq('id', id);
                if (error) throw new Error(error.message);
            } else {
                const { error } = await supabase.from('fabrics').insert(fabricToDb(payload));
                if (error) throw new Error(error.message);
            }
            navigate('/admin');
        } catch (err) { console.error(err); alert('Save failed'); }
        setSaving(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-[1100px] px-6 lg:px-10 py-10">
                <Link to="/admin" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground mb-8"><ArrowLeft className="w-4 h-4" />Back to admin</Link>
                <p className="eyebrow mb-3">{editing ? 'Edit' : 'Add'} cut piece</p>
                <h1 className="font-display text-5xl mb-10">{editing ? form.name : 'New fabric'}</h1>
                <form onSubmit={save} className="grid lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Name</span><input required value={form.name} onChange={e => set('name', e.target.value)} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none font-display text-xl" /></label>
                        <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Description</span><textarea required value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none resize-none" /></label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Price / metre (₹)</span><input required type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none font-display text-xl" /></label>
                            <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Stock (m)</span><input type="number" value={form.stock_quantity} onChange={e => set('stock_quantity', e.target.value)} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none font-display text-xl" /></label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Fabric type" options={TYPES} value={form.fabric_type} onChange={v => set('fabric_type', v)} />
                            <Field label="Pattern" options={PATTERNS} value={form.pattern} onChange={v => set('pattern', v)} />
                            <Field label="Color family" options={FAMILIES} value={form.color_family} onChange={v => set('color_family', v)} />
                            <Field label="Weight" options={WEIGHTS} value={form.weight} onChange={v => set('weight', v)} />
                        </div>
                        <Field label="Brand" options={['', ...BRANDS]} value={form.brand} onChange={v => set('brand', v)} />
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Weave</span><input value={form.weave_type} onChange={e => set('weave_type', e.target.value)} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none" /></label>
                            <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Color</span><input value={form.color} onChange={e => set('color', e.target.value)} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none" /></label>
                            <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Width (in)</span><input type="number" value={form.width_inches} onChange={e => set('width_inches', e.target.value)} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none" /></label>
                            <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">SKU</span><input value={form.sku} onChange={e => set('sku', e.target.value)} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none" /></label>
                        </div>
                        <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Material composition</span><input value={form.material_composition} onChange={e => set('material_composition', e.target.value)} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none" /></label>
                        <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Origin</span><input value={form.origin} onChange={e => set('origin', e.target.value)} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none" /></label>
                        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-[hsl(var(--accent))]" /><span className="font-mono text-xs uppercase tracking-[0.18em]">Featured on homepage</span></label>
                    </div>
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Imagery (fabric-first)</p>
                        {form.image_url ? <div className="aspect-[4/5] overflow-hidden bg-muted mb-3"><Image src={form.image_url} fittingType="fill" className="w-full h-full" /></div> : <div className="aspect-[4/5] bg-muted flex items-center justify-center text-muted-foreground font-mono text-xs mb-3">No image</div>}
                        <label className="flex items-center justify-center gap-2 border border-dashed border-border py-4 cursor-pointer hover:border-foreground mb-3">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Upload primary swatch</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => upload(e, 'image_url')} />
                        </label>
                        <label className="flex items-center justify-center gap-2 border border-dashed border-border py-4 cursor-pointer hover:border-foreground">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Upload macro detail</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => upload(e, 'detail_image_url')} />
                        </label>
                        <button type="submit" disabled={saving || uploading} className="btn-loom-solid w-full mt-8 disabled:opacity-50">{saving ? 'Saving…' : editing ? 'Update cut piece' : 'Publish cut piece'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}