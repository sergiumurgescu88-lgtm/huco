import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NativeCarousel({ images, className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef(null);
  
  // Motion values pentru swipe
  const x = useMotionValue(0);
  const scale = useTransform(x, [-100, 0, 100], [0.95, 1, 0.95]);
  
  // Touch handling
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const dragThreshold = 50; // px minim pentru a considera swipe

  const handleTouchStart = (e) => {
    // Oprește propagarea către parent
    e.stopPropagation();
    
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || isZoomed) return;
    
    // Oprește propagarea și default behavior (scroll page)
    e.stopPropagation();
    e.preventDefault();
    
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    
    // Dacă mișcarea e mai mult verticală, nu e swipe
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      isDragging.current = false;
      return;
    }
    
    // Update motion value pentru feedback vizual
    x.set(deltaX);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current || isZoomed) return;
    
    e.stopPropagation();
    
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    
    // Determină dacă e swipe valid
    if (Math.abs(deltaX) > dragThreshold) {
      if (deltaX > 0 && currentIndex > 0) {
        // Swipe right - previous
        setCurrentIndex(currentIndex - 1);
      } else if (deltaX < 0 && currentIndex < images.length - 1) {
        // Swipe left - next
        setCurrentIndex(currentIndex + 1);
      }
    }
    
    // Reset
    x.set(0);
    isDragging.current = false;
  };

  // Keyboard navigation (accessibility)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length]);

  // Pinch to zoom (simplified - toggle on double tap)
  const handleDoubleTap = () => {
    setIsZoomed(!isZoomed);
  };

  if (!images || images.length === 0) {
    return <div className="aspect-square bg-gray-200" />;
  }

  return (
    <div 
      ref={containerRef}
      className={`relative carousel-container ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]?.src || '/placeholder.jpg'}
            alt={`Product image ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: isZoomed ? 2 : 1,
              x: 0
            }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full object-contain"
            style={{ 
              scale,
              touchAction: isZoomed ? 'pan-x pan-y' : 'none'
            }}
            onDoubleClick={handleDoubleTap}
            draggable={false}
          />
        </AnimatePresence>

        {/* Navigation Arrows (Desktop) */}
        {images.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hidden md:flex"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            {currentIndex < images.length - 1 && (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hidden md:flex"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </>
        )}

        {/* Pagination Indicator - Stil AliExpress */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && images.length <= 10 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 w-2'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Zoom hint */}
        {!isZoomed && images.length > 0 && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium md:hidden">
            Double-tap to zoom
          </div>
        )}
      </div>
    </div>
  );
}
