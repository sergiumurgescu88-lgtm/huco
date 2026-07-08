import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProductCard from './components/ui/ProductCard';
import ProductDetails from './pages/ProductDetails';
import { Headphones, Battery, Smartphone, Car, Home as HomeIcon, Search, ShoppingBag, User } from 'lucide-react';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24;
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/data/products.json')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => console.error("Eroare:", err));
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);
    if (term === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.categories && p.categories.some(c => c.name.toLowerCase().includes(term)))
      );
      setFilteredProducts(filtered);
    }
  };

  // Funcții pentru butoanele din Header
  const handleCartClick = () => alert("Funcția Coș de Cumpărături va fi implementată în curând!");
  const handleAccountClick = () => alert("Pagina de Cont va fi implementată în curând!");

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Imagini placeholder pentru categorii (poți înlocui cu URL-uri reale dacă ai)
  const categories = [
    { name: "Audio & Căști", icon: <Headphones size={32} />, color: "bg-blue-100 text-blue-600", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" },
    { name: "Power Banks", icon: <Battery size={32} />, color: "bg-green-100 text-green-600", img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=60" },
    { name: "Accesorii Auto", icon: <Car size={32} />, color: "bg-red-100 text-red-600", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&auto=format&fit=crop&q=60" },
    { name: "Smart Home", icon: <HomeIcon size={32} />, color: "bg-purple-100 text-purple-600", img: "https://images.unsplash.com/photo-1558002038-1091a166111c?w=500&auto=format&fit=crop&q=60" },
  ];

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="flex-grow bg-gray-50 min-h-screen">
        
        {/* HERO SECTION - Banner Principal */}
        {!searchTerm && (
          <div className="relative bg-gray-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1593121925328-369cc8459c08?w=1200&auto=format&fit=crop&q=80" 
              alt="Hoco Audio" 
              className="w-full h-[400px] md:h-[500px] object-cover opacity-60"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                  Sunet Premium <span className="text-red-500">Hoco</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8">
                  Descoperă noua colecție de căști wireless și difuzoare Bluetooth. Calitate audio superioară la prețuri accesibile.
                </p>
                <button 
                  onClick={() => { setSearchTerm('audio'); document.querySelector('input').value = 'audio'; }}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-lg transition shadow-lg transform hover:scale-105"
                >
                  Vezi Oferta Audio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORII POPULARE - Grid cu Imagini */}
        {!searchTerm && (
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Explorează Categoriile</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat, idx) => (
                <div 
                  key={idx} 
                  className="group relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 aspect-square"
                  onClick={() => { setSearchTerm(cat.name.split(' ')[0].toLowerCase()); document.querySelector('input').value = cat.name.split(' ')[0].toLowerCase(); }}
                >
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center text-white p-4">
                    <div className={`p-3 rounded-full mb-3 ${cat.color} bg-opacity-90`}>
                      {cat.icon}
                    </div>
                    <h3 className="font-bold text-lg text-center">{cat.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LISTA PRODUSE */}
        <div className="container mx-auto px-4 py-8 bg-white">
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm ? `Rezultate pentru "${searchTerm}" (${filteredProducts.length})` : `Produse Recomandate`}
            </h2>
            <div className="text-sm text-gray-500 hidden sm:block">
              Pagina {currentPage} din {totalPages}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Se încarcă catalogul...</div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Paginare */}
              <div className="flex justify-center items-center gap-2 mt-12">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'}`}
                >
                  Anterior
                </button>
                
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  {currentPage} / {totalPages}
                </span>

                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'}`}
                >
                  Următor
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              Nu am găsit produse care să corespundă căutării tale.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
