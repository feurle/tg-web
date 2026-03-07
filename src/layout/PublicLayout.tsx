import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LanguageSync from '../i18n/LanguageSync';

export default function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LanguageSync />
      <Navbar />
      <main style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
