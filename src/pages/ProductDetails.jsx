import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Check, Truck, ShieldCheck, RefreshCcw, ChevronRight, Maximize2, X } from 'lucide-react';
import ProductHero3D from '../components/3d/ProductHero3D';

export default function ProductDetails() {
  // Luăm slug-ul din URL, nu ID-ul
  const { slug } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetch('/data/products.json')
      .then(res => res.json())
      .then(data => {
        // Căutăm produsul după slug
        const found = data.find(p => p.slug === slug);
        setProduct(found);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center">Se încarcă detaliile...</div>;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center">Produsul nu a fost găsit.</div>;

  const price = (product.price / 100).toFixed(2);
  const images = product.images || [];
  const mainImage = images[selectedImage]?.src || '/placeholder.jpg';

  const specs = [
    { label: "Brand", value: "Hoco" },
    { label: "Model", value: product.name.split(' ')[0] || "Nespecificat" },
    { label: "Garanție", value: "24 Luni" },
    { label: "Stoc", value: "Disponibil" },
    { label: "SKU", value: `HOCO-${product.slug}` }
  ];

  return (
    <div className="bg-white min-h-screen pb-12 relative">
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black transition-opacity duration-500">
          <button 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-5 right-5 text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={32} />
          </button>
          <ProductHero3D imageUrl={mainImage} />
        </div>
      )}

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-red-600">Acasă</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-xl border border-gray-200 p-4 flex items-center justify-center overflow-hidden relative group">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
              />
              <button 
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
              >
                <Maximize2 size={24} />
              </button>
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${selectedImage === idx ? 'border-red-600 ring-2 ring-red-100' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide bg-red-50 px-2 py-1 rounded">Hoco Original</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(Recenzii Clienți)</span>
              <span className="text-sm text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                <Check size={14} /> În Stoc
              </span>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-red-600">{price} RON</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">TVA inclus. Transport calculat la checkout.</p>
            </div>

            <div className="space-y-4 mb-8">
              <button className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition shadow-lg shadow-red-500/20 transform hover:-translate-y-1">
                Adaugă în Coș
              </button>
              <button className="w-full bg-white text-gray-700 border border-gray-300 py-4 rounded-lg font-semibold hover:bg-gray-50 transition">
                Cumpără Acum
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                <Truck size={20} className="text-red-500" />
                <span>Livrare Rapidă 24-48h</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                <ShieldCheck size={20} className="text-red-500" />
                <span>Garanție 2 Ani</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                <RefreshCcw size={20} className="text-red-500" />
                <span>Retur 14 Zile</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                <Check size={20} className="text-red-500" />
                <span>Produs Original Hoco</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'description' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              DESCRIERE
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'specs' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              SPECIFICAȚII TEHNICE
            </button>
          </div>

          <div className="py-8 bg-white">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none text-gray-600">
                <div dangerouslySetInnerHTML={{ __html: product.description || 'Fără descriere disponibilă.' }} />
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-600 border-collapse">
                  <tbody>
                    {specs.map((spec, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-gray-900 bg-gray-50 w-1/3 rounded-l-lg">{spec.label}</td>
                        <td className="py-4 px-6 rounded-r-lg">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
