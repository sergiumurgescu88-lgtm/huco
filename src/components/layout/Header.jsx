import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";

export default function Header() {
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/data/categories.json')
      .then(res => res.json())
      .then(data => setCategories(Object.keys(data)))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-black text-red-600 tracking-tighter hover:scale-105 transition-transform">
            HOCO<span className="text-gray-900">.</span>RO
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative group">
            <input 
              type="text" 
              placeholder="Caută produse..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-12 py-2.5 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
            />
            <button type="submit" className="absolute right-1 top-1 bottom-1 w-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
              <Search size={18} />
            </button>
          </form>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
            {categories.slice(0, 5).map(cat => (
              <Link key={cat} to={`/category/${encodeURIComponent(cat)}`} className="hover:text-red-600 transition-colors relative group">
                {cat}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <User size={22} />
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-3 animate-in slide-in-from-top-5">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Caută..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-lg bg-gray-100 outline-none"
              />
              <button type="submit" className="absolute right-2 top-2 text-gray-500"><Search size={18}/></button>
            </form>
            {categories.map(cat => (
              <Link key={cat} to={`/category/${encodeURIComponent(cat)}`} className="block py-2 text-gray-700 font-medium hover:text-red-600" onClick={() => setMobileMenu(false)}>
                {cat}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
