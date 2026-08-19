import { useEffect, useState } from 'react';
import { Send, Star } from 'lucide-react';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/lib/AuthContext';

function getSummary(reviews) {
    if (!reviews.length) return { average: 0, count: 0 };
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return { average: total / reviews.length, count: reviews.length };
}

function Stars({ rating = 0, size = 'w-3.5 h-3.5' }) {
    return (
        <span className="inline-flex items-center gap-0.5" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className={`${size} ${index < Math.round(rating) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-border'}`} strokeWidth={1.5} />
            ))}
        </span>
    );
}

export function ReviewSummary({ fabricId, className = '' }) {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        let active = true;
        supabase.from('reviews').select('rating').eq('fabric_id', fabricId).then(({ data, error }) => {
            if (active && !error) setSummary(getSummary(data || []));
            else if (active) setSummary({ average: 0, count: 0 });
        });
        return () => { active = false; };
    }, [fabricId]);

    return (
        <span className={`inline-flex items-center gap-1.5 ${className}`}>
            {summary?.count ? (
                <>
                    <Stars rating={summary.average} />
                    <span className="font-mono text-[10px] text-[#C5A059]">{summary.average.toFixed(1)}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">· {summary.count} {summary.count === 1 ? 'review' : 'reviews'}</span>
                </>
            ) : (
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">No reviews yet</span>
            )}
        </span>
    );
}

export default function Reviews({ fabricId }) {
    const { user, navigateToLogin } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ rating: 5, title: '', body: '' });

    const loadReviews = async () => {
        setLoading(true);
        const { data, error: reviewsError } = await supabase
            .from('reviews')
            .select('id, rating, title, body, display_name, created_at')
            .eq('fabric_id', fabricId)
            .order('created_at', { ascending: false });
        if (!reviewsError) setReviews(data || []);

        if (user?.id) {
            const [{ data: eligibility }, { data: ownReview }] = await Promise.all([
                supabase.rpc('can_review_fabric', { p_fabric_id: fabricId }),
                supabase.from('reviews').select('id').eq('fabric_id', fabricId).eq('user_id', user.id).maybeSingle(),
            ]);
            setCanReview(Boolean(eligibility));
            setHasReviewed(Boolean(ownReview));
        } else {
            setCanReview(false);
            setHasReviewed(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadReviews();
    }, [fabricId, user?.id]);

    const submitReview = async (event) => {
        event.preventDefault();
        if (!user?.id) return navigateToLogin();
        setSubmitting(true);
        setError('');
        const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Customer';
        const { error: insertError } = await supabase.from('reviews').insert({
            fabric_id: fabricId,
            user_id: user.id,
            rating: form.rating,
            title: form.title.trim() || null,
            body: form.body.trim(),
            display_name: displayName,
        });
        if (insertError) {
            setError(insertError.message.includes('reviews_fabric_id_user_id_key') ? 'You have already reviewed this fabric.' : 'Your review could not be submitted. Please try again.');
        } else {
            setForm({ rating: 5, title: '', body: '' });
            await loadReviews();
        }
        setSubmitting(false);
    };

    const summary = getSummary(reviews);

    return (
        <section id="reviews" className="mt-16 border-t border-border pt-10 scroll-mt-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="eyebrow mb-3">Customer notes</p>
                    <h2 className="font-display text-4xl">Reviews</h2>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                    {summary.count > 0 ? <><Stars rating={summary.average} size="w-4 h-4" /><span className="text-[#C5A059]">{summary.average.toFixed(1)}</span><span className="text-muted-foreground">· {summary.count} {summary.count === 1 ? 'review' : 'reviews'}</span></> : <span className="text-muted-foreground">No reviews yet</span>}
                </div>
            </div>

            {loading ? (
                <div className="mt-8 h-20 border-t border-border animate-pulse bg-muted/30" />
            ) : summary.count === 0 ? (
                <p className="mt-8 border-y border-border py-8 text-center font-display text-2xl text-muted-foreground">No reviews yet</p>
            ) : (
                <div className="mt-8 divide-y divide-border border-y border-border">
                    {reviews.map(review => (
                        <article key={review.id} className="py-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3"><Stars rating={review.rating} /><span className="font-mono text-[10px] uppercase tracking-[0.16em]">{review.display_name}</span></div>
                                <time className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground" dateTime={review.created_at}>{new Date(review.created_at).toLocaleDateString()}</time>
                            </div>
                            {review.title && <h3 className="mt-3 font-display text-2xl">{review.title}</h3>}
                            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/75">{review.body}</p>
                        </article>
                    ))}
                </div>
            )}

            <div className="mt-10 border border-border p-6 sm:p-8">
                {canReview && !hasReviewed ? (
                    <form onSubmit={submitReview}>
                        <p className="eyebrow mb-2">Verified customer</p>
                        <h3 className="font-display text-3xl">Share your experience</h3>
                        <div className="mt-6 flex gap-1" aria-label="Rating">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <button key={index} type="button" onClick={() => setForm(current => ({ ...current, rating: index + 1 }))} className="p-1" aria-label={`${index + 1} star${index ? 's' : ''}`}>
                                    <Star className={`w-5 h-5 ${index < form.rating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-border'}`} />
                                </button>
                            ))}
                        </div>
                        <input value={form.title} onChange={event => setForm(current => ({ ...current, title: event.target.value }))} maxLength={120} placeholder="Review title (optional)" className="mt-5 w-full border-b border-border bg-transparent py-3 font-display text-xl focus:border-accent focus:outline-none" />
                        <textarea required minLength={10} maxLength={2000} value={form.body} onChange={event => setForm(current => ({ ...current, body: event.target.value }))} placeholder="Tell other customers what stood out about this fabric." rows={4} className="mt-4 w-full resize-none border-b border-border bg-transparent py-3 text-sm leading-relaxed focus:border-accent focus:outline-none" />
                        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
                        <button disabled={submitting} className="btn-loom-solid mt-6 disabled:opacity-50" type="submit">{submitting ? 'Submitting' : 'Publish review'} <Send className="w-4 h-4" /></button>
                    </form>
                ) : user ? (
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Reviews are available to customers after their order is delivered.</p>
                ) : (
                    <button type="button" onClick={navigateToLogin} className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent hover:underline">Sign in to review a purchased fabric</button>
                )}
            </div>
        </section>
    );
}
