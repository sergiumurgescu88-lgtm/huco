import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ui/ProductCard";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('/data/products.json')
      .then(r => r.json())
      .then(data => {
        const q = query.toLowerCase();
        const filtered = data.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description?.toLowerCase().includes(q)
        );
        setResults(filtered);
      });
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Rezultate pentru "{query}" ({results.length})</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}
