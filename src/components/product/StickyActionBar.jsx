import { motion } from "framer-motion";
import { ShoppingCart, Zap } from "lucide-react";

export default function StickyActionBar({ onAddToCart, price }) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 md:bottom-0"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="container mx-auto px-4 py-3 flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAddToCart}
          className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition"
        >
          <ShoppingCart size={20} />
          Adaugă în Coș
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-600/30"
        >
          <Zap size={20} fill="currentColor" />
          Cumpără Acum - {price} RON
        </motion.button>
      </div>
    </motion.div>
  );
}
