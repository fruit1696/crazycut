import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, fabricToFrontend } from '@/api/supabaseClient';
import FabricCard from '@/components/FabricCard';
import { BRANDS } from '@/lib/brands';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Slider } from '@/components/ui/slider';

const FILTERS = {
    brand: BRANDS,
    fabric_type: ['Silk', 'Cotton', 'Linen', 'Wool', 'Blend'],
    color_family: ['Neutral', 'Indigo', 'Earth', 'Jewel'],
    pattern: ['Solid', 'Striped', 'Floral', 'Geometric', 'Jacquard'],
    weight: ['Lightweight', 'Midweight', 'Heavyweight'],
};

export default function Shop() {
    const [fabrics, setFabrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [localPriceRange, setLocalPriceRange] = useState([200, 5000]);

    const filters = useMemo(() => {
        const getArray = (key) => {
            const val = searchParams.get(key);
            return val ? val.split(',').filter(Boolean) : [];
        };
        return {
            brand: getArray('brand'),
            fabric_type: getArray('fabric_type'),
            color_family: getArray('color_family'),
            pattern: getArray('pattern'),
            weight: getArray('weight'),
            min_price: searchParams.get('min_price') ? parseInt(searchParams.get('min_price'), 10) : 200,
            max_price: searchParams.get('max_price') ? parseInt(searchParams.get('max_price'), 10) : 5000,
        };
    }, [searchParams]);

    useEffect(() => {
        setLocalPriceRange([filters.min_price, filters.max_price]);
    }, [filters.min_price, filters.max_price]);

    const sort = searchParams.get('sort') || 'featured';

    const setPriceRange = (min, max) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (min === 200) next.delete('min_price'); else next.set('min_price', min);
            if (max === 5000) next.delete('max_price'); else next.set('max_price', max);
            return next;
        }, { replace: true });
    };

    const toggleFilter = (key, value) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            const current = next.get(key) ? next.get(key).split(',').filter(Boolean) : [];
            let updated;
            if (current.includes(value)) {
                updated = current.filter(v => v !== value);
            } else {
                updated = [...current, value];
            }
            if (updated.length === 0) next.delete(key);
            else next.set(key, updated.join(','));
            return next;
        }, { replace: true });
    };

    const clearCategory = (key) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete(key);
            return next;
        }, { replace: true });
    };

    const clearFilters = () => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            Object.keys(FILTERS).forEach(k => next.delete(k));
            next.delete('min_price');
            next.delete('max_price');
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
            try {
                const { data, error } = await supabase.from('fabrics').select('*').order('created_date', { ascending: false }).limit(100);
                if (error) throw new Error(error.message);
                setFabrics((data || []).map(fabricToFrontend));
            }
            catch (e) { console.error(e); }
            setLoading(false);
        })();
    }, []);

    const filtered = useMemo(() => {
        let list = fabrics.filter(f =>
            (filters.brand.length === 0 || filters.brand.includes(f.brand)) &&
            (filters.fabric_type.length === 0 || filters.fabric_type.includes(f.fabric_type)) &&
            (filters.color_family.length === 0 || filters.color_family.includes(f.color_family)) &&
            (filters.pattern.length === 0 || filters.pattern.includes(f.pattern)) &&
            (filters.weight.length === 0 || filters.weight.includes(f.weight)) &&
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
                        <button onClick={() => clearCategory('brand')} className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 border transition-colors ${filters.brand.length === 0 ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/70 hover:border-foreground'}`}>{t('shop.allBrands')}</button>
                        {BRANDS.map(b => (
                            <button key={b} onClick={() => toggleFilter('brand', b)} className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 border transition-colors ${filters.brand.includes(b) ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/70 hover:border-foreground'}`}>{b}</button>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-6 lg:py-8">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    <div className="flex flex-col lg:flex-row gap-10">
                        <aside className="lg:w-60 flex-shrink-0">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-accent" /><span className="eyebrow">{t('shop.refine')}</span></div>
                                {(Object.values(filters).some(v => Array.isArray(v) && v.length > 0) || filters.min_price > 200 || filters.max_price < 5000) && (
                                    <button onClick={clearFilters} className="text-[10px] uppercase tracking-wider text-accent hover:underline">Clear All</button>
                                )}
                            </div>
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
                                            onValueCommit={(val) => setPriceRange(val[0], val[1])}
                                        />
                                    </div>
                                </div>
                                {Object.entries(FILTERS).map(([key, opts]) => (
                                    <div key={key} className="min-w-[180px] lg:min-w-0">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                                            {filters[key].length > 0 && <button onClick={() => clearCategory(key)} className="text-[9px] uppercase tracking-wider text-accent hover:underline">Clear</button>}
                                        </div>
                                        <div className="flex flex-wrap lg:flex-col gap-2">
                                            {opts.map(o => (
                                                <button key={o} onClick={() => toggleFilter(key, o)} className={`text-left font-mono text-xs uppercase tracking-[0.14em] px-3 py-1.5 border transition-colors ${filters[key].includes(o) ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/70 hover:border-foreground'}`}>{o}</button>
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
