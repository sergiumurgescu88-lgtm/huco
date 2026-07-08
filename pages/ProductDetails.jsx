import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Check, Truck, ShieldCheck, RefreshCcw, ChevronRight } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch('/data/products.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id === parseInt(id));
        setProduct(found);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center">Se încarcă detaliile...</div>;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center">Produsul nu a fost găsit.</div>;

  const price = (product.price / 100).toFixed(2);
  const oldPrice = product.on_sale ? (product.regular_price / 100).toFixed(2) : null;
  const images = product.images || [];
  const mainImage = images[selectedImage] || '/placeholder.jpg';

  // Simulare specificații tehnice bazate pe descriere sau generice
  const specs = [
    { label: "Brand", value: "Hoco" },
    { label: "Model", value: product.name.split(' ')[0] || "N/A" },
    { label: "Garanție", value: "24 Luni" },
    { label: "Stoc", value: "Disponibil" },
    { label: "SKU", value: `HOCO-${product.id}` }
  ];

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-red-600">Acasă</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Galerie Foto */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-center overflow-hidden">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-md border-2 overflow-hidden flex-shrink-0 ${selectedImage === idx ? 'border-red-600' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Produs */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(Recenzii Clienți)</span>
              <span className="text-sm text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                <Check size={14} /> În Stoc
              </span>
            </div>

            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-red-600">{price} RON</span>
                {oldPrice && (
                  <span className="text-xl text-gray-400 line-through">{oldPrice} RON</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">TVA inclus. Transport calculat la checkout.</p>
            </div>

            <div className="space-y-4 mb-8">
              <button className="w-full bg-red-600 text-white py-3.5 rounded-md font-semibold hover:bg-red-700 transition shadow-md">
                Adaugă în Coș
              </button>
              <button className="w-full bg-white text-gray-700 border border-gray-300 py-3.5 rounded-md font-semibold hover:bg-gray-50 transition">
                Cumpără Acum
              </button>
            </div>

            {/* Beneficii */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={20} className="text-gray-400" />
                <span>Livrare Rapidă 24-48h</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheck size={20} className="text-gray-400" />
                <span>Garanție 2 Ani</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RefreshCcw size={20} className="text-gray-400" />
                <span>Retur 14 Zile</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check size={20} className="text-gray-400" />
                <span>Produs Original Hoco</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Detalii & Specificații */}
        <div className="mt-16">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'description' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              DESCRIERE
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'specs' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              SPECIFICAȚII TEHNICE
            </button>
          </div>

          <div className="py-8 bg-white">
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none text-gray-600">
                <p dangerouslySetInnerHTML={{ __html: product.description || 'Fără descriere disponibilă.' }} />
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-600">
                  <tbody>
                    {specs.map((spec, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50 w-1/3">{spec.label}</td>
                        <td className="py-3 px-4">{spec.value}</td>
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
