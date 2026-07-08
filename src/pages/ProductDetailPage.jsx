import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Share2, Star, Truck, Shield, RotateCcw } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BottomNavigation from "../components/layout/BottomNavigation";
import StickyActionBar from "../components/product/StickyActionBar";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [cartCount, setCartCount] = useState(0);

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, 100]);
  const imageOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    fetch("/data/products.json")
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((p) => p.slug === slug);
        setProduct(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <Header />
        <div className="animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-4 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="min-h-screen flex items-center justify-center">Produs negăsit</div>;

  const images = product.images || [];
  const price = (product.price / 100).toFixed(2);
  const originalPrice = product.regular_price ? (product.regular_price / 100).toFixed(2) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    setCartCount((prev) => prev + quantity);
  };

  return (
    <div className="min-h-screen bg-white pb-32 md:pb-20">
      <Header />
      <BottomNavigation cartCount={cartCount} />

      {/* GALERIE FOTO CU PARALLAX */}
      <motion.div style={{ y: imageY, opacity: imageOpacity }} className="relative aspect-square bg-gray-50 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={images[selectedImage]?.src}
            alt={product.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </AnimatePresence>

        {/* Badge-uri */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount > 0 && (
            <motion.span initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{discount}%
            </motion.span>
          )}
          <span className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-semibold">🔥 Stoc limitat</span>
        </div>

        {/* Share */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
          <Share2 size={20} className="text-gray-700" />
        </button>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button key={idx} onClick={() => setSelectedImage(idx)} className={`h-2 rounded-full transition-all ${idx === selectedImage ? "bg-red-600 w-8" : "bg-white/60 w-2"}`} />
          ))}
        </div>
      </motion.div>

      {/* INFORMAȚII PRODUS */}
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-3xl font-black text-red-600">{price} RON</span>
            {originalPrice && <span className="text-lg text-gray-400 line-through">{originalPrice} RON</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
            <span className="text-sm text-gray-600">(128 recenzii)</span>
            <span className="text-sm text-gray-500">• 2.5k vândute</span>
          </div>
        </div>

        {/* Beneficii */}
        <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-200">
          {[
            { icon: Truck, text: "Livrare 24-48h" },
            { icon: Shield, text: "Garanție 2 ani" },
            { icon: RotateCcw, text: "Retur 30 zile" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <item.icon size={24} className="text-red-600 mb-1" />
              <span className="text-xs text-gray-600">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Cantitate */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Cantitate</h3>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-red-600 transition">-</button>
            <span className="text-xl font-bold w-12 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-red-600 transition">+</button>
          </div>
        </div>

        {/* Tab-uri */}
        <div>
          <div className="flex border-b border-gray-200 mb-4">
            {["description", "specs", "shipping"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? "border-red-600 text-red-600" : "border-transparent text-gray-500"}`}>
                {tab === "description" ? "DESCRIERE" : tab === "specs" ? "SPECIFICAȚII" : "TRANSPORT"}
              </button>
            ))}
          </div>
          <div className="prose prose-sm max-w-none text-gray-600">
            {activeTab === "description" && (
              <div dangerouslySetInnerHTML={{ __html: product.description || "Fără descriere disponibilă." }} />
            )}
            {activeTab === "specs" && (
              <div className="space-y-2">
                <p><strong>Brand:</strong> Hoco</p>
                <p><strong>Tip:</strong> {product.name}</p>
                <p><strong>Garanție:</strong> 24 luni</p>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="space-y-2">
                <p>🚚 Livrare rapidă 24-48h în toată România</p>
                <p>📦 Transport gratuit pentru comenzi peste 200 RON</p>
                <p>↩️ Retur gratuit în 30 de zile</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <StickyActionBar onAddToCart={handleAddToCart} price={price} />
    </div>
  );
}
