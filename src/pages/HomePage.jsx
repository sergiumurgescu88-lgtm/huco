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
    <span className="text-sm tracking-wider">PREMIUM GOLD</span>
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
      product: products[0],
      title: "POWERFUL PERFORMANCE",
      subtitle: "Premium Power Banks",
      description: "Fast charging technology with wireless support. Keep your devices powered all day long.",
      specs: ["20000mAh Capacity", "PD 20W Fast Charge", "Wireless 15W", "LED Display"]
    },
    {
      product: products[1],
      title: "CRYSTAL CLEAR AUDIO",
      subtitle: "Wireless Earbuds",
      description: "Experience premium sound quality with active noise cancellation and long battery life.",
      specs: ["ANC Technology", "30H Battery", "Hi-Fi Sound", "IPX5 Waterproof"]
    },
    {
      product: products[2],
      title: "SMART CHARGING",
      subtitle: "Wall Chargers",
      description: "Multi-port fast chargers for all your devices. Compact and travel-friendly design.",
      specs: ["GaN Technology", "65W Output", "4 Ports", "Universal Compatibility"]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Touch handlers pentru swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      // Swipe left - next slide
      setCurrentSlide(prev => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      // Swipe right - previous slide
      setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    }
  };

  return (
<section className="relative h-[85vh] overflow-hidden bg-black carousel-container"
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
              className="absolute inset-0"
            >
              {/* Background Image - Alb/Negru */}
              <div className="absolute inset-0">
                <img 
                  src={slide.product?.images?.[0]?.src || '/placeholder.jpg'}
                  alt=""
                  className="w-full h-full object-cover opacity-20"
                  style={{ filter: 'grayscale(100%)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-white space-y-6"
                  >
                    {/* Premium Gold Badge */}
                    <PremiumGoldBadge />

                    <p className="text-red-500 font-semibold text-lg tracking-wider">{slide.subtitle}</p>
                    <h1 className="text-5xl md:text-7xl font-black leading-tight">{slide.title}</h1>
                    <p className="text-xl text-gray-300 max-w-xl">{slide.description}</p>
                    
                    {/* Specs - Alb/Negru */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {slide.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-lg">
                          <Zap className="text-red-500" size={20} />
                          <span className="font-semibold text-white">{spec}</span>
                        </div>
                      ))}
                    </div>

                    <Link 
                      to="/category/Toate Produsele"
                      className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full font-bold text-lg mt-6 transition-all hover:scale-105 shadow-2xl shadow-red-600/50"
                    >
                      SHOP NOW <ArrowRight size={24} />
                    </Link>
                  </motion.div>

                  {/* Product Image */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="hidden lg:block"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-transparent rounded-full blur-3xl"></div>
                      <img 
                        src={slide.product?.images?.[0]?.src || '/placeholder.jpg'}
                        alt={slide.title}
                        className="relative w-full h-[500px] object-contain drop-shadow-2xl"
                      />
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
    { name: "Cables", keywords: ['cable'], icon: Cable },
    { name: "Car Accessories", keywords: ['car', 'fm'], icon: Car },
    { name: "Smart Home", keywords: ['smart'], icon: Smartphone },
    { name: "PC Accessories", keywords: ['pen', 'laser'], icon: Laptop },
    { name: "Wireless Speakers", keywords: ['speaker', 'bluetooth'], icon: Speaker }
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
            <h2 className="text-5xl font-black text-gray-900 mb-4 mt-6">SHOP BY CATEGORY</h2>
            <p className="text-gray-600 text-xl">Discover our premium collection</p>
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

      {/* ========== NEW ARRIVALS ========== */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <PremiumGoldBadge />
              <h2 className="text-5xl font-black mb-2 mt-6">NEW ARRIVALS</h2>
              <p className="text-gray-400 text-xl">Latest products from Hoco</p>
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

      {/* ========== POWER BANKS SECTION ========== */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
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
              <h2 className="text-5xl font-black text-gray-900 mb-6 mt-6">POWER BANKS</h2>
              <p className="text-gray-600 text-xl mb-8">Keep your devices charged anywhere, anytime. Premium capacity with fast charging technology.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Battery, text: "Up to 30000mAh" },
                  { icon: Zap, text: "PD 20W Fast Charge" },
                  { icon: Shield, text: "Safety Protection" },
                  { icon: Clock, text: "Long Battery Life" }
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
        <div className="absolute inset-0">
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
            <p className="text-red-500 font-semibold text-lg mb-2 mt-6">PREMIUM AUDIO</p>
            <h2 className="text-5xl font-black mb-4">CRYSTAL CLEAR SOUND</h2>
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
            <h2 className="text-5xl font-black text-gray-900 mb-4">WHY CHOOSE HOCO</h2>
            <p className="text-gray-600 text-xl">Premium quality you can trust</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Fast Charging", desc: "Latest PD & QC technology", color: "bg-red-600" },
              { icon: Shield, title: "Quality Assured", desc: "Premium materials", color: "bg-black" },
              { icon: Award, title: "Official Partner", desc: "100% authentic products", color: "bg-red-600" },
              { icon: Clock, title: "24/7 Support", desc: "Always here for you", color: "bg-black" }
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

      {/* ========== BEST SELLERS ========== */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <PremiumGoldBadge />
            <h2 className="text-5xl font-black mb-4 mt-6">BEST SELLERS</h2>
            <p className="text-gray-400 text-xl">Most popular products this month</p>
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
