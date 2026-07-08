import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const price = (product.price / 100).toFixed(2);
  const oldPrice = product.on_sale ? (product.regular_price / 100).toFixed(2) : null;
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder.jpg';

  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Imagine */}
      <Link to={`/product/${product.id}`} className="relative aspect-square bg-gray-50 p-4 block">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.on_sale && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            SALE
          </span>
        )}
      </Link>

      {/* Conținut */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-red-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Preț */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">{price} RON</span>
            {oldPrice && (
              <span className="block text-xs text-gray-500 line-through">{oldPrice} RON</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
