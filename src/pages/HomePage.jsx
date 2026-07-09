import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, Home, Star, 
  Battery, Smartphone, Headphones, Speaker, Car, Cable, Laptop,
  Zap, Shield, Award, Clock, Crown, Diamond
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// ========== FLOATING NAVIGATION BUTTONS ==========
const FloatingNav = () => {
  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButtons(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showButtons && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed right-6 bottom-6 z-50 flex flex-col gap-3"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-800 transition-colors group"
            title="Înapoi"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </motion.button>

          {/* Home Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-red-700 transition-colors group"
            title="Acasă"
          >
            <Home size={24} className="group-hover:scale-110 transition-transform" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ========== PREMIUM GOLD BADGE ==========
const PremiumGoldBadge = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-full font-bold shadow-lg"
  >
    <Crown className="w-5 h-5" fill="currentColor" />
    <span className="text-sm tracking-wider">Hoco. Official</span>
    <Diamond className="w-4 h-4" fill="currentColor" />
    
    {/* Shimmer Effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
      animate={{ x: ['-100%', '200%'] }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
    />
  </motion.div>
);

// ========== CAROUSEL COMPONENT ==========
const ProductCarousel = ({ products, autoplay = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [autoplay, products.length]);

  if (products.length === 0) return null;

  return (
    <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {products.map((product, idx) => (
          <div key={idx} className="w-full flex-shrink-0">
            <img 
              src={product.images?.[0]?.src || '/placeholder.jpg'} 
              alt={product.name}
              className="w-full h-full object-contain p-8"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ========== HERO SLIDER - ALB/NEGRU/ROȘU ==========
const HeroSlider = ({ products }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const slides = [
    {
      product: { images: [{ src: 'https://images.weserv.nl/?url=https://hocotech.com/wp-content/uploads/2026/04/hoco-hx614-spray-series-ice-cooling-handheld-fan.avif&output=jpg' }], price: 10000, regular_price: 10000 },
      title: "PORTABIL",
      subtitle: "Soluție de Răcire",
      description: "hoco. HX614 Spray, portable fan with humidifier, handheld or desktop use, humidification and air cooling, 100 levels of airflow, LED digital display, built-in flashlight 1. Portable handheld or des...",
      specs: ["Portable handheld or desktop fan with humidifier", "Two technologies: humidification and air cooling", "Transparent 50ml water tank", "100 levels of airflow"]
    },
    {
      product: { images: [{ src: 'https://images.weserv.nl/?url=https://hocotech.com/wp-content/uploads/2026/03/hoco-gt3-idol-multifunctional-magnetic-card-holder.avif&output=jpg' }], price: 10000, regular_price: 10000 },
      title: "MAGNETIC",
      subtitle: "Accessory Auto",
      description: "hoco. GT3, magnetic card holder, 4 cards storage, phone stand, for phones with built-in magnet 1. Portable multifunctional magnetic card holder. 2. Can hold 1 – 4 cards. 3. Can be used as phone sta...",
      specs: ["Multifunctional magnetic card holder", "Can hold 1 \u2013 4 cards", "Can be used as phone stand", "For phones with built-in magnet"]
    },
    {
      product: { images: [{ src: 'https://images.weserv.nl/?url=https://hocotech.com/wp-content/uploads/2026/02/hoco-hi37-wifi4-usb-external-wireless-network-card.avif&output=jpg' }], price: 10000, regular_price: 10000 },
      title: "WI-FI",
      subtitle: "Gadget Premium",
      description: "hoco. HI37, Wi-Fi 4 USB adapter, external antenna, 2.4GHz, for desktop computers and laptops 1. Wi-Fi 4 USB adapter. 2. External high gain 3dBi antenna, rotatable through 90 degrees. 3. Main chip: ...",
      specs: ["Wi-Fi 4 USB adapter", "0 connection", "External antenna", "4GHz stable signal"]
    },
    {
      product: { images: [{ src: 'https://images.weserv.nl/?url=https://hocotech.com/wp-content/uploads/2026/01/hoco-hw36-magnetic-wireless-charging-car-holder.avif&output=jpg' }], price: 10000, regular_price: 10000 },
      title: "MAȘINĂ",
      subtitle: "Încărcare Rapidă",
      description: "hoco. HW36, magnetic wireless charging in-car phone holder, 5W / 7.5W / 10W / 15W output, for 4.5 – 7 inches mobile phones, for air outlet 1. In-car magnetic wireless charging phone holder with ele...",
      specs: ["In-car magnetic wireless charging phone holder", "5W / 7", "5W / 10W / 15W wireless output", "Electric rotation + built-in cooler + front and back lighting"]
    },
    {
      product: { images: [{ src: 'https://images.weserv.nl/?url=https://hocotech.com/wp-content/uploads/2025/09/hoco-ea9-clear-sound-clip-on-tws-bt-headset-mp.jpg&output=jpg' }], price: 10000, regular_price: 10000 },
      title: "TWS",
      subtitle: "Audio Wireless",
      description: "EA9 Clear sound, TWS headset, open-ear clip-on design, BT v5.4, charging case battery 300mAh, headset battery 62mAh, total working time – 30 hours 1. BT version: v5.4. Chip: AC7003. 2. Suported pr...",
      specs: ["True wireless stereo headset", "Open-ear clip-on design", "Total working time: 30 hours"]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);
  // Touch handlers pentru swipe - doar orizontal, permite scroll vertical
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    // Doar swipe orizontal (nu vertical)
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };


  return (
    <section 
        className="relative h-auto md:h-[90vh] overflow-visible bg-black carousel-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
      <AnimatePresence mode="wait">
        {slides.map((slide, idx) => (
          currentSlide === idx && (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="relative md:absolute inset-0 bg-black md:bg-transparent"
            >
              {/* Background Image - Alb/Negru */}
              <div className="hidden md:block absolute inset-0">
                <img 
                  src={slide.product?.images?.[0]?.src || '/placeholder.jpg'}
                  alt=""
                  className="w-full h-full object-cover opacity-20"
                  style={{ filter: 'grayscale(100%)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 container mx-auto px-4 py-8 md:py-0 min-h-[85vh] md:min-h-0 md:h-full flex flex-col md:flex-row items-center">
                <div className="w-full space-y-6 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-2 lg:gap-12 lg:items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-white space-y-4 md:space-y-6 w-full"
                  >
                    {/* Premium Gold Badge */}
                    <PremiumGoldBadge />

                    <p className="text-red-500 font-semibold text-sm sm:text-base md:text-lg tracking-wider">{slide.subtitle}</p>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light leading-tight tracking-wide">{slide.title}</h1>
                    <p className="text-sm sm:text-base md:text-xl text-gray-300 max-w-xl">{slide.description}</p>
                    
                    {/* Specs - Alb/Negru */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 pt-4">
                      {slide.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-lg">
                          <Zap className="text-red-500 flex-shrink-0" size={18} />
                          <span className="font-semibold text-white text-xs sm:text-sm">{spec}</span>
                        </div>
                      ))}
                    </div>

                    <Link 
                      to="/category/Toate Produsele"
                      className="inline-flex items-center gap-2 sm:gap-3 bg-red-600 hover:bg-red-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg mt-4 sm:mt-6 transition-all hover:scale-105 shadow-2xl shadow-red-600/50"
                    >
                      CUMPĂRĂ ACUM <ArrowRight size={24} />
                    </Link>
                  </motion.div>

                  {/* Product Image cu chenar premium gold */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="w-full flex items-center justify-center mt-4 lg:mt-0 lg:col-start-2"
                  >
                    <div className="relative p-4 md:p-8">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-yellow-500/20 to-yellow-600/30 rounded-full blur-3xl scale-110"></div>
                      
                      {/* Chenar premium gold */}
                      <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-1 rounded-3xl shadow-2xl shadow-yellow-500/50">
                        <div className="bg-black/90 backdrop-blur-sm rounded-3xl p-4 md:p-6">
                          <img
                            src={slide.product?.images?.[0]?.src || '/placeholder.jpg'}
                            alt={slide.title}
                            className="w-full h-[250px] md:h-[400px] lg:h-[500px] object-contain drop-shadow-[0_10px_30px_rgba(255,215,0,0.4)]"
                          />
                        </div>
                      </div>
                      
                      {/* Corner accents */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 md:w-8 md:h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl-2xl"></div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-2xl"></div>
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 md:w-8 md:h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-2xl"></div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 border-b-4 border-r-4 border-yellow-400 rounded-br-2xl"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Navigation Dots - Alb/Negru/Roșu */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1 rounded-full transition-all ${
              idx === currentSlide ? 'bg-red-600 w-16' : 'bg-white/50 w-8'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// ========== PAGINA PRINCIPALĂ ==========

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/products.json').then(r => r.json()),
      fetch('/data/categories.json').then(r => r.json())
    ]).then(([allProducts, cats]) => {
      setProducts(allProducts);
      setCategories(cats);
      setLoading(false);
    }).catch(err => {
      console.error("Eroare:", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Hoco Romania...</p>
        </div>
      </div>
    );
  }

  // Categorii cu produse reale
  const categoriesWithImages = [
    { name: "Power Banks", keywords: ['power bank'], icon: Battery },
    { name: "Audio & Video", keywords: ['headset', 'earphone', 'speaker'], icon: Headphones },
    { name: "Wall Chargers", keywords: ['charger', 'wall'], icon: Zap },
    { name: "Cablu", keywords: ['cable'], icon: Cable },
    { name: "Car Accessories", keywords: ['car', 'fm'], icon: Car },
    { name: "Smart Home", keywords: ['smart'], icon: Smartphone },
    { name: "PC Accessories", keywords: ['pen', 'laser'], icon: Laptop },
    { name: "Boxe Wireless", keywords: ['speaker', 'bluetooth'], icon: Speaker }
  ].map(cat => ({
    ...cat,
    products: products.filter(p => cat.keywords.some(k => p.name.toLowerCase().includes(k))).slice(0, 4),
    count: categories[cat.name]?.length || 0
  })).filter(cat => cat.products.length > 0);

  const newArrivals = products.slice(0, 12);
  const bestSellers = products.slice(12, 20);
  const audioProducts = products.filter(p => 
    p.name.toLowerCase().includes('headset') || 
    p.name.toLowerCase().includes('earphone') ||
    p.name.toLowerCase().includes('tws')
  ).slice(0, 8);
  const powerBanks = products.filter(p => 
    p.name.toLowerCase().includes('power bank')
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <FloatingNav />

      {/* ========== HERO SLIDER ========== */}
      <HeroSlider products={products} />

      {/* ========== CATEGORIES ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <PremiumGoldBadge />
            <h2 className="text-5xl font-black text-gray-900 mb-4 mt-6">CUMPĂRĂ PE CATEGORII</h2>
            <p className="text-gray-600 text-xl">Descoperă colecția noastră premium</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoriesWithImages.slice(0, 8).map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <Link to={`/category/${encodeURIComponent(cat.name)}`} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 mb-4 border-2 border-transparent group-hover:border-red-600 transition-all">
                    <ProductCarousel products={cat.products} autoplay={true} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-bold text-lg">{cat.name}</p>
                      <p className="text-sm">{cat.count} products</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors">{cat.name}</h3>
                    <p className="text-sm text-gray-500">{cat.count} Products</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRODUSE NOI ========== */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <PremiumGoldBadge />
              <h2 className="text-5xl font-black mb-2 mt-6">PRODUSE NOI</h2>
              <p className="text-gray-400 text-xl">Cele mai noi produse de la Hoco</p>
            </div>
            <Link to="/category/Toate Produsele" className="hidden md:flex items-center gap-2 text-red-500 font-bold text-lg hover:underline">
              VIEW ALL <ArrowRight size={24} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {newArrivals.map((product, idx) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all hover:-translate-y-2 border border-white/10"
              >
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="aspect-square p-6 bg-white relative overflow-hidden">
                    <img 
                      src={product.images?.[0]?.src || '/placeholder.jpg'} 
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-lg font-bold text-red-500">{(product.price / 100).toFixed(2)} RON</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BATERII EXTERNE SECTION ========== */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="hidden md:block absolute inset-0">
          <img 
            src={powerBanks[0]?.images?.[0]?.src || '/placeholder.jpg'}
            alt=""
            className="w-full h-full object-cover opacity-5"
            style={{ filter: 'grayscale(100%)' }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <PremiumGoldBadge />
              <h2 className="text-5xl font-black text-gray-900 mb-6 mt-6">BATERII EXTERNE</h2>
              <p className="text-gray-600 text-xl mb-8">Menține dispozitivele încărcate oriunde și oricând. Capacitate premium cu tehnologie de încărcare rapidă.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Battery, text: "Până la 30000mAh" },
                  { icon: Zap, text: "Încărcare Rapidă PD 20W" },
                  { icon: Shield, text: "Protecție Siguranță" },
                  { icon: Clock, text: "Durată Lungă Baterie" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 hover:border-red-600 p-4 rounded-xl transition-colors">
                    <item.icon className="text-red-600" size={24} />
                    <span className="font-semibold text-gray-900">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link to="/category/Power Banks" className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105">
                EXPLORE NOW <ArrowRight size={24} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {powerBanks.slice(0, 4).map((product, idx) => (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow border-2 border-gray-100 hover:border-red-600"
                >
                  <Link to={`/product/${product.slug}`} className="block">
                    <img 
                      src={product.images?.[0]?.src || '/placeholder.jpg'} 
                      alt={product.name}
                      className="w-full aspect-square object-contain mb-4"
                    />
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{product.name}</p>
                    <p className="text-xl font-bold text-red-600">{(product.price / 100).toFixed(2)} RON</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== AUDIO SECTION ========== */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="hidden md:block absolute inset-0">
          <img 
            src={audioProducts[0]?.images?.[0]?.src || '/placeholder.jpg'}
            alt=""
            className="w-full h-full object-cover opacity-10"
            style={{ filter: 'grayscale(100%)' }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <PremiumGoldBadge />
            <p className="text-red-500 font-semibold text-lg mb-2 mt-6">AUDIO PREMIUM</p>
            <h2 className="text-5xl font-black mb-4">SUNET CRISTALIN</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">Experience superior audio quality with our wireless earbuds and headsets</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {audioProducts.map((product, idx) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <Link to={`/product/${product.slug}`} className="block bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all border border-white/10">
                  <img 
                    src={product.images?.[0]?.src || '/placeholder.jpg'} 
                    alt={product.name}
                    className="w-full aspect-square object-contain mb-3"
                  />
                  <p className="text-sm font-medium line-clamp-2 group-hover:text-red-400 transition-colors">{product.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">DE CE SĂ ALEGI HOCO</h2>
            <p className="text-gray-600 text-xl">Calitate premium în care poți avea încredere</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Încărcare Rapidă", desc: "Tehnologie PD & QC de ultimă generație", color: "bg-red-600" },
              { icon: Shield, title: "Quality Assured", desc: "Premium materials", color: "bg-black" },
              { icon: Award, title: "Official Partner", desc: "100% authentic products", color: "bg-red-600" },
              { icon: Clock, title: "24/7 Suport", desc: "Always here for you", color: "bg-black" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group border-2 border-transparent hover:border-red-600"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${item.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CELE MAI VÂNDUTE ========== */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <PremiumGoldBadge />
            <h2 className="text-5xl font-black mb-4 mt-6">CELE MAI VÂNDUTE</h2>
            <p className="text-gray-400 text-xl">Cele mai populare produse din această lună</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map((product, idx) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all border border-white/10"
              >
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="aspect-square p-6 bg-white relative">
                    <img 
                      src={product.images?.[0]?.src || '/placeholder.jpg'} 
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      HOT
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-white line-clamp-2 mb-2">{product.name}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                      <span className="text-xs text-gray-400">(128)</span>
                    </div>
                    <p className="text-xl font-bold text-red-500">{(product.price / 100).toFixed(2)} RON</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
