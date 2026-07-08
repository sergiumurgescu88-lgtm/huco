import { useState } from 'react';
import { Search, ShoppingCart, Menu, X, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ onSearch }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCartClick = () => {
    // Aici vei adăuga logica reală de coș mai târziu
    alert("Coșul de cumpărături este gol momentan.");
  };

  const handleAccountClick = () => {
    alert("Autentificare necesară.");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><Phone size={12} /> Suport: 07xx xxx xxx</span>
            <span>Livrare Gratuită &gt; 200 RON</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-red-500 transition">Despre Noi</a>
            <a href="#" className="hover:text-red-500 transition">Contact</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold text-red-600 tracking-tight shrink-0 flex items-center gap-1">
          hoco<span className="text-gray-900">.</span>
        </Link>

        {/* Search Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
          <input 
            type="text" 
            placeholder="Caută produse..." 
            onChange={onSearch}
            className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
          />
          <button className="absolute right-2 top-2.5 text-gray-400 hover:text-red-600">
            <Search size={20} />
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-700">
          <button 
            onClick={handleAccountClick}
            className="hidden md:flex flex-col items-center hover:text-red-600 transition"
          >
            <User size={22} />
            <span className="text-[10px] mt-1">Cont</span>
          </button>
          <button 
            onClick={handleCartClick}
            className="relative hover:text-red-600 transition"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
          <button 
            className="md:hidden hover:text-red-600 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
         <div className="relative">
          <input 
            type="text" 
            placeholder="Caută..." 
            onChange={onSearch}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-sm bg-gray-50"
          />
          <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Navigation Categories */}
      <nav className="border-t border-gray-100 hidden md:block bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex gap-8 py-3 text-sm font-medium text-gray-700">
            <li className="hover:text-red-600 cursor-pointer transition" onClick={() => onSearch({ target: { value: '' } })}>Toate Produsele</li>
            <li className="hover:text-red-600 cursor-pointer transition" onClick={() => onSearch({ target: { value: 'audio' } })}>Audio & Video</li>
            <li className="hover:text-red-600 cursor-pointer transition" onClick={() => onSearch({ target: { value: 'power' } })}>Power Banks</li>
            <li className="hover:text-red-600 cursor-pointer transition" onClick={() => onSearch({ target: { value: 'auto' } })}>Accesorii Auto</li>
            <li className="hover:text-red-600 cursor-pointer transition" onClick={() => onSearch({ target: { value: 'home' } })}>Smart Home</li>
            <li className="hover:text-red-600 cursor-pointer transition text-red-600 font-bold" onClick={() => onSearch({ target: { value: 'sale' } })}>Oferte Speciale</li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5 z-50">
          <a href="#" className="font-medium text-gray-800 hover:text-red-600" onClick={() => { setIsMenuOpen(false); onSearch({ target: { value: 'audio' } }); }}>Audio & Video</a>
          <a href="#" className="font-medium text-gray-800 hover:text-red-600" onClick={() => { setIsMenuOpen(false); onSearch({ target: { value: 'power' } }); }}>Power Banks</a>
          <a href="#" className="font-medium text-gray-800 hover:text-red-600" onClick={() => { setIsMenuOpen(false); onSearch({ target: { value: 'auto' } }); }}>Accesorii Auto</a>
          <hr className="border-gray-100"/>
          <a href="#" className="font-medium text-gray-800 hover:text-red-600" onClick={handleAccountClick}>Contul Meu</a>
          <a href="#" className="font-medium text-gray-800 hover:text-red-600" onClick={handleCartClick}>Coș de Cumpărături</a>
        </div>
      )}
    </header>
  );
}
