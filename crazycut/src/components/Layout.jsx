import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AnnouncementBar from '@/components/AnnouncementBar';
import WhatsAppWidget from '@/components/WhatsAppWidget';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppWidget />
    </div>
  );
}