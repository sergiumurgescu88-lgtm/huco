import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ui/ProductCard";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function CategoryPage() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/products.json').then(r => r.json()),
      fetch('/data/categories.json').then(r => r.json())
    ]).then(([allProducts, cats]) => {
      const slugs = cats[name] || [];
      const filtered = allProducts.filter(p => slugs.includes(p.slug));
      setProducts(filtered);
      setLoading(false);
    });
  }, [name]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">{decodeURIComponent(name)}</h1>
        {loading ? <p>Se încarcă...</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map(p => <ProductCard key={p.slug} product={p} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
