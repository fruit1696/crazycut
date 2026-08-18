import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cartStore';
import { useAuth } from '@/lib/AuthContext';
import { useTranslation } from 'react-i18next';
import { BRANDS } from '@/lib/brands';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const { count, setOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMobileDropdown(null);
  }, [location.pathname]);

  const isHi = i18n.language === 'hi';
  const toggleLang = () => i18n.changeLanguage(isHi ? 'en' : 'hi');

  const menuItems = [
    { label: t('nav.shop'), to: '/shop' },
    { label: t('nav.newArrivals'), to: '/shop?sort=newest' },
    { 
      label: t('nav.byFabric'), 
      dropdown: true, 
      options: [
        { label: isHi ? 'सूती (Cotton)' : 'Cotton', to: '/shop?fabric_type=Cotton' },
        { label: isHi ? 'रेशम (Silk)' : 'Silk', to: '/shop?fabric_type=Silk' },
        { label: isHi ? 'लिनन (Linen)' : 'Linen', to: '/shop?fabric_type=Linen' },
        { label: isHi ? 'ऊनी (Wool)' : 'Wool', to: '/shop?fabric_type=Wool' },
        { label: isHi ? 'मिश्रित (Blend)' : 'Blend', to: '/shop?fabric_type=Blend' },
      ]
    },
    { 
      label: t('nav.byBrand'), 
      dropdown: true, 
      options: BRANDS.map(b => ({ label: b, to: `/shop?brand=${b}` }))
    },
    { 
      label: t('nav.byPattern'), 
      dropdown: true, 
      options: [
        { label: isHi ? 'प्लेन (Solid)' : 'Solid', to: '/shop?pattern=Solid' },
        { label: isHi ? 'धारीदार (Striped)' : 'Striped', to: '/shop?pattern=Striped' },
        { label: isHi ? 'फूलदार (Floral)' : 'Floral', to: '/shop?pattern=Floral' },
        { label: isHi ? 'ज्यामितीय (Geometric)' : 'Geometric', to: '/shop?pattern=Geometric' },
        { label: isHi ? 'जैक्वार्ड (Jacquard)' : 'Jacquard', to: '/shop?pattern=Jacquard' },
      ]
    },
  ];

  const toggleMobileDropdown = (name) => {
    setActiveMobileDropdown(prev => prev === name ? null : name);
  };

  return (
    <header className={`fixed top-10 inset-x-0 z-40 transition-all duration-500 ${scrolled ? 'bg-background/85 backdrop-blur-md border-b border-border' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">
          <Link to="/" className="flex flex-col">
            <span className="font-display italic text-2xl tracking-tight leading-none">CrazyCutPiece</span>
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.1em] text-muted-foreground mt-1">क्रेजी कटपीस</span>
          </Link>
          <nav className="hidden md:flex items-center">
            {menuItems.map((item, i) => (
              <div key={item.label} className="flex items-center">
                {i > 0 && <span className="thread-line-v w-px h-4 mx-6 opacity-60" />}
                {item.dropdown ? (
                  <div className="relative group py-2">
                    <button className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                    <div className="absolute top-full left-0 hidden group-hover:block bg-background border border-border py-2 min-w-[160px] max-h-[300px] overflow-y-auto shadow-xl z-50 animate-scale-in">
                      {item.options.map(opt => (
                        <Link 
                          key={opt.to} 
                          to={opt.to} 
                          className="block px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
                        >
                          {opt.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link to={item.to} className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/70 hover:text-foreground transition-colors py-2">{item.label}</Link>
                )}
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="hidden sm:inline-flex font-mono text-[11px] uppercase tracking-[0.22em] text-accent hover:text-foreground">{t('nav.admin')}</Link>
            )}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-4">
                <Link to="/orders" className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/70 hover:text-foreground">{t('nav.orders')}</Link>
                <button onClick={() => logout()} className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/70 hover:text-foreground"><LogOut className="w-3.5 h-3.5" />{t('nav.signOut')}</button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/70 hover:text-foreground"><User className="w-3.5 h-3.5" />{t('nav.signIn')}</Link>
            )}
            {/* ── Language Switcher ── */}
            <button
              onClick={toggleLang}
              aria-label="Toggle language"
              className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60 hover:text-foreground transition-colors"
            >
              <span className={!isHi ? 'text-foreground' : 'text-foreground/40'}>EN</span>
              <span className="opacity-30">|</span>
              <span className={isHi ? 'text-foreground' : 'text-foreground/40'}>हि</span>
            </button>
            <button onClick={() => setOpen(true)} aria-label="Open cart" className="relative inline-flex items-center gap-2">
              <ShoppingBag className="w-[18px] h-[18px] text-foreground" />
              <span className="font-mono text-[11px] tracking-[0.2em]">{count}</span>
            </button>
            <button className="md:hidden" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md max-h-[calc(100vh-112px)] overflow-y-auto">
          <div className="px-6 py-6 flex flex-col gap-5">
            {menuItems.map(item => (
              <div key={item.label} className="flex flex-col gap-2">
                {item.dropdown ? (
                  <>
                    <button 
                      onClick={() => toggleMobileDropdown(item.label)} 
                      className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/80 flex items-center justify-between text-left py-1"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeMobileDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {activeMobileDropdown === item.label && (
                      <div className="pl-4 flex flex-col gap-3 border-l border-border my-2 py-1 animate-scale-in">
                        {item.options.map(opt => (
                          <Link 
                            key={opt.to} 
                            to={opt.to} 
                            onClick={() => setMobileOpen(false)}
                            className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/60 hover:text-foreground"
                          >
                            {opt.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    to={item.to} 
                    onClick={() => setMobileOpen(false)}
                    className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/80 py-1"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            <div className="h-px bg-border my-2" />

            {isAuthenticated ? (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/80">{t('nav.orders')}</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left font-mono text-xs uppercase tracking-[0.22em] text-foreground/80">{t('nav.signOut')}</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/80">{t('nav.signIn')}</Link>
            )}
            <button onClick={() => { toggleLang(); setMobileOpen(false); }} className="text-left font-mono text-xs uppercase tracking-[0.22em] text-foreground/60 mt-1">
              {isHi ? 'EN' : 'हिंदी'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
