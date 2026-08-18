import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import FabricCard from '@/components/FabricCard';
import { BRANDS } from '@/lib/brands';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Slider } from '@/components/ui/slider';

const FILTERS = {
    brand: ['All', ...BRANDS],
    fabric_type: ['All', 'Silk', 'Cotton', 'Linen', 'Wool', 'Blend'],
    color_family: ['All', 'Neutral', 'Indigo', 'Earth', 'Jewel'],
    pattern: ['All', 'Solid', 'Striped', 'Floral', 'Geometric', 'Jacquard'],
    weight: ['All', 'Lightweight', 'Midweight', 'Heavyweight'],
};

export default function Shop() {
    const [fabrics, setFabrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [localPriceRange, setLocalPriceRange] = useState([200, 5000]);

    const filters = useMemo(() => {
        return {
            brand: searchParams.get('brand') || 'All',
            fabric_type: searchParams.get('fabric_type') || 'All',
            color_family: searchParams.get('color_family') || 'All',
            pattern: searchParams.get('pattern') || 'All',
            weight: searchParams.get('weight') || 'All',
            min_price: searchParams.get('min_price') ? parseInt(searchParams.get('min_price'), 10) : 200,
            max_price: searchParams.get('max_price') ? parseInt(searchParams.get('max_price'), 10) : 5000,
        };
    }, [searchParams]);

    useEffect(() => {
        setLocalPriceRange([filters.min_price, filters.max_price]);
    }, [filters.min_price, filters.max_price]);

    const sort = searchParams.get('sort') || 'featured';

    const setFilters = (updater) => {
        setSearchParams(prev => {
            const currentFilters = {
                brand: prev.get('brand') || 'All',
                fabric_type: prev.get('fabric_type') || 'All',
                color_family: prev.get('color_family') || 'All',
                pattern: prev.get('pattern') || 'All',
                weight: prev.get('weight') || 'All',
                min_price: prev.get('min_price') ? parseInt(prev.get('min_price'), 10) : 200,
                max_price: prev.get('max_price') ? parseInt(prev.get('max_price'), 10) : 5000,
            };
            const updated = typeof updater === 'function' ? updater(currentFilters) : { ...currentFilters, ...updater };
            
            const next = new URLSearchParams(prev);
            Object.entries(updated).forEach(([k, v]) => {
                if (v === 'All') next.delete(k);
                else if (k === 'min_price' && v === 200) next.delete(k);
                else if (k === 'max_price' && v === 5000) next.delete(k);
                else next.set(k, v);
            });
            return next;
        }, { replace: true });
    };

    const setSort = (val) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (val === 'featured') next.delete('sort');
            else next.set('sort', val);
            return next;
        }, { replace: true });
    };
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            try { setFabrics(await base44.entities.Fabric.list('-created_date', 100)); }
            catch (e) { console.error(e); }
            setLoading(false);
        })();
    }, []);

    const filtered = useMemo(() => {
        let list = fabrics.filter(f =>
            (filters.brand === 'All' || f.brand === filters.brand) &&
            (filters.fabric_type === 'All' || f.fabric_type === filters.fabric_type) &&
            (filters.color_family === 'All' || f.color_family === filters.color_family) &&
            (filters.pattern === 'All' || f.pattern === filters.pattern) &&
            (filters.weight === 'All' || f.weight === filters.weight) &&
            (f.price >= filters.min_price && f.price <= filters.max_price));
        if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
        if (sort === 'newest') list = [...list].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        if (sort === 'featured') list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        return list;
    }, [fabrics, filters, sort]);

    return (
        <div className="pt-[112px]">
            <section className="py-10 lg:py-12 border-b border-border">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    <p className="eyebrow mb-3">{t('shop.eyebrow')}</p>
                    <h1 className="font-display text-4xl sm:text-5xl">{t('shop.headline')}</h1>
                    <p className="mt-3 text-muted-foreground max-w-lg">{t('shop.countLabel_other', { count: fabrics.length })}</p>
                    <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        <button onClick={() => setFilters(s => ({ ...s, brand: 'All' }))} className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 border transition-colors ${filters.brand === 'All' ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/70 hover:border-foreground'}`}>{t('shop.allBrands')}</button>
                        {BRANDS.map(b => (
                            <button key={b} onClick={() => setFilters(s => ({ ...s, brand: b }))} className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 border transition-colors ${filters.brand === b ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/70 hover:border-foreground'}`}>{b}</button>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-6 lg:py-8">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    <div className="flex flex-col lg:flex-row gap-10">
                        <aside className="lg:w-60 flex-shrink-0">
                            <div className="flex items-center gap-2 mb-4"><SlidersHorizontal className="w-4 h-4 text-accent" /><span className="eyebrow">{t('shop.refine')}</span></div>
                            <div className="flex lg:flex-col gap-6 lg:gap-8 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                                <div className="min-w-[180px] lg:min-w-0">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-8">Price Range</p>
                                    <div className="px-1 mb-2">
                                        <Slider
                                            min={200}
                                            max={5000}
                                            step={100}
                                            value={localPriceRange}
                                            onValueChange={(val) => setLocalPriceRange(val)}
                                            onValueCommit={(val) => setFilters(s => ({ ...s, min_price: val[0], max_price: val[1] }))}
                                        />
                                    </div>
                                </div>
                                {Object.entries(FILTERS).map(([key, opts]) => (
                                    <div key={key} className="min-w-[180px] lg:min-w-0">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">{key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                                        <div className="flex flex-wrap lg:flex-col gap-2">
                                            {opts.map(o => (
                                                <button key={o} onClick={() => setFilters(s => ({ ...s, [key]: o }))} className={`text-left font-mono text-xs uppercase tracking-[0.14em] px-3 py-1.5 border transition-colors ${filters[key] === o ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/70 hover:border-foreground'}`}>{o}</button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
                                <p className="font-mono text-xs text-muted-foreground">{t('shop.results_other', { count: filtered.length })}</p>
                                <label className="flex items-center gap-3">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t('shop.sort')}</span>
                                    <select value={sort} onChange={e => setSort(e.target.value)} className="font-mono text-xs bg-transparent border-b border-border py-1 focus:outline-none">
                                        <option value="featured">{t('shop.featured')}</option>
                                        <option value="newest">{t('shop.newest')}</option>
                                        <option value="price-asc">{t('shop.priceAsc')}</option>
                                        <option value="price-desc">{t('shop.priceDesc')}</option>
                                    </select>
                                </label>
                            </div>
                            {loading ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />)}</div>
                            ) : filtered.length === 0 ? (
                                <div className="py-24 text-center"><p className="font-display text-3xl">{t('shop.noMatch')}</p><p className="text-muted-foreground mt-2">{t('shop.noMatchSub')}</p></div>
                            ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">{filtered.map(f => <FabricCard key={f.id} fabric={f} />)}</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
