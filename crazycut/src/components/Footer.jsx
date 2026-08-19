import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        {/* Physical Store Section */}
        <div className="grid lg:grid-cols-2 gap-10 pb-12 border-b border-border mb-12 items-center">
          <div>
            <p className="eyebrow flex items-center gap-2 mb-3 text-accent">
              <MapPin className="w-4 h-4" />
              Visit Our Physical Store in Khargone
            </p>
            <h2 className="font-display text-4xl sm:text-5xl leading-tight mb-4">
              Crazy CutPiece
            </h2>
            <p className="text-foreground/80 text-lg leading-relaxed mb-6 max-w-lg">
              Serving Khargone with premium unstitched suit & shirt materials for over 15+ years. Now delivering nationwide!
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-foreground/70" />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Store Address</p>
                  <p className="text-sm text-foreground/90 leading-relaxed mb-2">
                    Main Market, Khargone, Madhya Pradesh 451001
                  </p>
                  <a href="https://maps.google.com/?q=Crazy+Cutpiece+Khargone" target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-accent transition-colors inline-flex items-center gap-1">
                    Get Directions on Google Maps <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start pt-2">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-lg">🕒</span>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Store Hours</p>
                  <p className="text-sm text-foreground/90">Open Daily: 10:00 AM – 9:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <a
                href={`https://wa.me/919425333460?text=${encodeURIComponent("Hi! I'm interested in visiting your Khargone store.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#128C7E] text-white font-mono text-xs uppercase tracking-[0.18em] px-6 py-4 transition-transform hover:-translate-y-1"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                Chat with Shop Owner on WhatsApp
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] bg-muted overflow-hidden group shadow-2xl">
            <img src="/mainlandingimage.jpeg" alt="Storefront" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-flex bg-background/95 backdrop-blur-md text-foreground px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] items-center gap-2 shadow-lg border border-border">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                100% Original Raymond & Premium Fabrics Guarantee
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 pb-12 border-b border-border">
          <div>
            <h2 className="font-display text-5xl sm:text-6xl leading-[0.95] text-balance">{t('footer.headline')}</h2>
            <p className="mt-5 text-muted-foreground max-w-md">{t('footer.newsletterDesc')}</p>
          </div>
          <div className="flex items-end">
            <form className="w-full flex items-end gap-3" onSubmit={(e) => e.preventDefault()}>
              <label className="flex-1 block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t('footer.emailLabel')}</span>
                <input type="email" placeholder={t('footer.emailPlaceholder')} className="mt-1 w-full bg-transparent border-b border-border py-2 focus:border-accent focus:outline-none font-display text-lg" />
              </label>
              <button className="btn-loom-solid"><ArrowRight className="w-4 h-4" /></button>
            </form>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display italic text-2xl">CrazyCutPiece</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-3">{t('footer.tagline')}</p>
          </div>
          <div>
            <p className="eyebrow mb-4">{t('footer.shopTitle')}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground">{t('footer.allCutPieces')}</Link></li>
              <li><Link to="/shop" className="hover:text-foreground">{t('footer.silk')}</Link></li>
              <li><Link to="/shop" className="hover:text-foreground">{t('footer.linen')}</Link></li>
              <li><Link to="/shop" className="hover:text-foreground">{t('footer.wool')}</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">{t('footer.atelierTitle')}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#atelier" className="hover:text-foreground">{t('footer.studio')}</a></li>
              <li><a href="/#visualize" className="hover:text-foreground">{t('footer.visualizeIt')}</a></li>
              <li><Link to="/orders" className="hover:text-foreground">{t('footer.orders')}</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">{t('footer.connectTitle')}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:hello@crazycutpiece.com" className="hover:text-foreground">hello@crazycutpiece.com</a></li>
              <li><a href="tel:+919425333460" className="hover:text-foreground">+919425333460</a></li>
              <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">© {new Date().getFullYear()} CrazyCutPiece · crazycutpiece.com</p>
          <div className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <a href="/#atelier" className="hover:text-foreground">{t('footer.privacy')}</a>
            <a href="/#atelier" className="hover:text-foreground">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
