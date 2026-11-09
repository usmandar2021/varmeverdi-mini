import { Routes, Route, Outlet } from 'react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Kalkulator from './pages/Kalkulator';
import Kart from './pages/Kart';
import Regelverk from './pages/Regelverk';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="kalkulator" element={<Kalkulator />} />
        <Route path="kart" element={<Kart />} />
        <Route path="regelverk" element={<Regelverk />} />
      </Route>
    </Routes>
  );
}
