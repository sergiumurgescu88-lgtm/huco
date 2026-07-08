import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Grid3x3, ShoppingCart, User } from "lucide-react";

export default function BottomNavigation({ cartCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");

  // Haptic feedback (dacă e suportat)
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10); // 10ms vibration
    }
  };

  useEffect(() => {
    if (location.pathname === "/") setActiveTab("home");
    else if (location.pathname.includes("/category")) setActiveTab("categories");
    else if (location.pathname.includes("/cart")) setActiveTab("cart");
    else if (location.pathname.includes("/account")) setActiveTab("account");
  }, [location]);

  const tabs = [
    { id: "home", icon: Home, label: "Acasă", path: "/" },
    { id: "categories", icon: Grid3x3, label: "Categorii", path: "/category/Toate Produsele" },
    { id: "cart", icon: ShoppingCart, label: "Coș", path: "/cart", badge: cartCount },
    { id: "account", icon: User, label: "Cont", path: "/account" }
  ];

  const handleTabClick = (tab) => {
    triggerHaptic();
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-t border-gray-200/50 shadow-lg md:hidden safe-bottom"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center justify-center flex-1 py-2 px-3"
            >
              <motion.div
                animate={{ 
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -2 : 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative"
              >
                <Icon
                  size={24}
                  className={`transition-colors ${
                    isActive ? "text-red-600" : "text-gray-500"
                  }`}
                />

                {/* Badge pentru coș */}
                {tab.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                  >
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </motion.span>
                )}
              </motion.div>

              <motion.span
                animate={{ 
                  scale: isActive ? 1.05 : 1,
                  color: isActive ? "#DC2626" : "#6B7280"
                }}
                className="text-xs mt-1 font-medium"
              >
                {tab.label}
              </motion.span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-red-600 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
