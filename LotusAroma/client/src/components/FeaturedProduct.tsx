import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

const FeaturedProduct = () => {
  const [selectedSize, setSelectedSize] = useState('50ml');
  const { addItem } = useCart();
  
  const product = {
    id: 8,
    name: "Royal Mystic Oud",
    description: "A captivating blend of rare oud, sandalwood, and exotic spices that creates an unforgettable sensory experience. This luxury fragrance is crafted for those who appreciate exclusivity and sophistication.",
    price: 1249900, // ₹12,499
    image: "https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg",
    sizes: ["30ml", "50ml", "100ml"]
  };
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: selectedSize
    });
    
    document.getElementById('cartSidebar')?.classList.remove('translate-x-full');
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">Introducing Our Signature Collection</h2>
            <h3 className="text-xl text-primary font-playfair mb-2">{product.name}</h3>
            <p className="text-neutral-dark/80 mb-6">{product.description}</p>
            
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-[#D4AF37] mr-2"></div>
                <p className="font-medium">Top Notes: Bergamot, Pink Pepper, Cardamom</p>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-[#D4AF37] mr-2"></div>
                <p className="font-medium">Heart Notes: Rose, Jasmine, Leather</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#D4AF37] mr-2"></div>
                <p className="font-medium">Base Notes: Oud, Amber, Vanilla, Musk</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Select Size:</h4>
              <div className="flex space-x-3">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    className={`border-2 ${selectedSize === size ? 'border-primary bg-primary/5' : 'border-neutral hover:border-primary'} py-1 px-4 rounded-md transition-colors`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-medium text-2xl text-primary">{formatPrice(product.price)}</span>
                <span className="text-sm line-through text-neutral-dark/60 ml-2">₹14,999</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1 text-green-500 font-medium">In Stock</span>
                <i className="fas fa-check-circle text-green-500"></i>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
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
              <button className="bg-white border-2 border-neutral-dark hover:border-primary text-neutral-dark hover:text-primary py-3 px-4 rounded-md transition-colors">
                <i className="fas fa-share-alt"></i>
              </button>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 featured-product-animation">
            <div className="relative">
              <img 
                src={product.image}
                alt={product.name} 
                className="w-full h-auto rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#D4AF37] text-white text-sm font-bold uppercase px-4 py-1 rounded">Limited Edition</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
