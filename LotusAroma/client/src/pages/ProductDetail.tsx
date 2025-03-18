import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Product, Review } from '@shared/schema';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import ProductGallery from '@/components/ProductGallery';
import ReviewSection from '@/components/ReviewSection';
import { shareProduct } from '@/lib/utils/sharing';

const ProductDetail = () => {
  const [, params] = useRoute('/product/:id');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCart();
  
  const productId = params?.id ? parseInt(params.id) : 0;
  
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-full h-20 rounded-md" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-6" />
            <Skeleton className="h-8 w-1/3 mb-6" />
            <div className="flex space-x-2 mb-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-16 h-10 rounded-md" />
              ))}
            </div>
            <Skeleton className="h-12 w-full mb-4" />
            <div className="flex space-x-2">
              <Skeleton className="w-12 h-12 rounded-md" />
              <Skeleton className="w-12 h-12 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p>Sorry, the product you're looking for does not exist or has been removed.</p>
        <Button className="mt-6" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }
  
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      setSelectedSize(product.sizes[0]);
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrls[0],
      quantity: 1,
      size: selectedSize
    });
    
    document.getElementById('cartSidebar')?.classList.remove('translate-x-full');
  };
  
  const handleShare = () => {
    shareProduct({
      name: product.name,
      url: window.location.href
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductGallery images={product.imageUrls} name={product.name} />
        
        <div>
          <h1 className="text-3xl font-bold font-playfair mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-[#D4AF37] mr-2">
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
          
          <p className="text-primary text-2xl font-medium mb-6">{formatPrice(product.price)}</p>
          
          <p className="mb-6 text-neutral-dark/80">{product.description}</p>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Select Size:</h4>
            <div className="flex space-x-3">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  className={`border-2 ${selectedSize === size ? 'border-primary bg-primary/5' : 'border-neutral hover:border-primary'} py-1 px-4 rounded-md transition-colors`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
            >
              <i className="fas fa-shopping-bag mr-2"></i>
              Add to Cart
            </button>
            <button className="bg-white border-2 border-neutral-dark hover:border-primary text-neutral-dark hover:text-primary py-3 px-4 rounded-md transition-colors">
              <i className="far fa-heart"></i>
            </button>
            <button 
              onClick={handleShare}
              className="bg-white border-2 border-neutral-dark hover:border-primary text-neutral-dark hover:text-primary py-3 px-4 rounded-md transition-colors"
            >
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
          
          <div className="pt-6 border-t">
            <div className="flex items-center mb-2">
              <i className="fas fa-truck text-primary mr-3"></i>
              <span>Free shipping on orders over ₹5,000</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-exchange-alt text-primary mr-3"></i>
              <span>30-day returns policy</span>
            </div>
          </div>
        </div>
      </div>
      
      <ReviewSection productId={productId} />
    </div>
  );
};

export default ProductDetail;
