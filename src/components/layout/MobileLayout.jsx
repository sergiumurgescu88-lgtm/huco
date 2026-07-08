import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";

export default function MobileLayout({ children }) {
  const location = useLocation();
  const [showBottomNav, setShowBottomNav] = useState(true);

  // Ascunde bottom nav pe anumite pagini (ex: checkout)
  useEffect(() => {
    const hideOnPaths = ["/checkout", "/login", "/register"];
    setShowBottomNav(!hideOnPaths.some(path => location.pathname.startsWith(path)));
  }, [location]);

  return (
    <div className="min-h-screen-ios bg-white">
      {/* Main Content - cu padding pentru bottom nav */}
      <main 
        className={`main-content ${showBottomNav ? 'pb-20' : ''}`}
        style={{
          paddingBottom: showBottomNav 
            ? 'calc(5rem + env(safe-area-inset-bottom))' 
            : '0'
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation - Fixed */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
