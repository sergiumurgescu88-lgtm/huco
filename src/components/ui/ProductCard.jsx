import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingCart } from "lucide-react";

export default function ProductCard({ product, viewMode = 'grid', onQuickView, onToggleWishlist, isInWishlist }) {
  const price = (product.price / 100).toFixed(2);
  const img = product.images?.[0]?.src || '/placeholder.jpg';

  if (viewMode === 'list') {
    return (
      <motion.div 
        whileHover={{ x: 5 }}
        className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex"
      >
        <Link to={`/product/${product.slug}`} className="w-48 aspect-square p-4 bg-gray-50 flex-shrink-0">
          <img src={img} alt={product.name} className="w-full h-full object-contain" />
        </Link>
        
        <div className="flex-1 p-6 flex flex-col">
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
            </div>
            <span className="text-sm text-gray-500">(128 recenzii)</span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            Produs original Hoco cu garanție 24 luni și livrare rapidă în 24-48h.
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-red-600">{price} RON</span>
            <div className="flex gap-2">
              <button 
                onClick={onToggleWishlist}
                className="p-2 border border-gray-300 rounded-lg hover:border-red-600 hover:text-red-600 transition"
              >
                <Heart size={20} className={isInWishlist ? 'fill-red-600 text-red-600' : ''} />
              </button>
              <button 
                onClick={onQuickView}
                className="p-2 border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition"
              >
                <Eye size={20} />
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2">
                <ShoppingCart size={18} />
                Adaugă
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View (default)
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-red-500/10 transition-all relative"
    >
      <Link to={`/product/${product.slug}`} className="block aspect-square p-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <img 
          src={img} 
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badge-uri */}
        {product.on_sale && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
            REDUCERE
          </span>
        )}

        {/* Quick Actions - apar la hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.preventDefault(); onToggleWishlist?.(); }}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition"
          >
            <Heart size={16} className={isInWishlist ? 'fill-red-600 text-red-600' : ''} />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); onQuickView?.(); }}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-50 transition"
          >
            <Eye size={16} />
          </button>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400 text-xs">
            {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
          </div>
          <span className="text-xs text-gray-500">(128)</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{price} RON</span>
          <button 
            onClick={(e) => { e.preventDefault(); }}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
}
