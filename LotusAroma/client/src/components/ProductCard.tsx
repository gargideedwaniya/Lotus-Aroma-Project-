import { Link } from 'wouter';
import { Product } from '@shared/schema';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

type ProductCardProps = {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrls[0],
      quantity: 1,
      size: product.sizes[0]
    });
  };
  
  return (
    <Link href={`/product/${product.id}`}>
      <div className="product-card bg-white rounded-lg overflow-hidden shadow-md group cursor-pointer">
        <div className="relative overflow-hidden h-64">
          <img 
            src={product.imageUrls[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.isNewArrival && (
            <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-xs font-bold uppercase px-3 py-1 m-2 rounded">New</div>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold uppercase px-3 py-1 m-2 rounded">Bestseller</div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="w-full bg-white hover:bg-neutral-100 text-primary font-medium py-2 rounded-md transition-colors"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-playfair font-bold text-neutral-dark mb-1">{product.name}</h3>
          <p className="text-sm text-neutral-dark/70 mb-2 line-clamp-2">{product.shortDescription}</p>
          <div className="flex justify-between items-center">
            <span className="font-medium text-primary">{formatPrice(product.price)}</span>
            <div className="flex text-[#D4AF37]">
              {Array.from({ length: 5 }).map((_, i) => {
                const roundedRating = Math.round(product.averageRating * 2) / 2;
                if (i + 1 <= roundedRating) {
                  return <i key={i} className="fas fa-star"></i>;
                } else if (i + 0.5 <= roundedRating) {
                  return <i key={i} className="fas fa-star-half-alt"></i>;
                } else {
                  return <i key={i} className="far fa-star"></i>;
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
