import { useQuery } from '@tanstack/react-query';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import FeaturedProduct from '@/components/FeaturedProduct';
import AboutSection from '@/components/AboutSection';
import NewsletterSection from '@/components/NewsletterSection';
import { Product } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

const Home = () => {
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  const { data: bestsellers, isLoading: isLoadingBestsellers } = useQuery<Product[]>({
    queryKey: ['/api/products/bestsellers'],
  });
  
  const renderProductSkeletons = (count: number) => {
    return Array(count).fill(0).map((_, i) => (
      <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
        <Skeleton className="h-64 w-full" />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-3" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    ));
  };
  
  return (
    <>
      <HeroBanner />
      
      {/* Featured Collection */}
      <section id="collections" className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2">Luxury Collections</h2>
            <p className="text-neutral-dark/80 font-montserrat max-w-2xl mx-auto">Explore our exquisite range of premium fragrances designed to elevate your personal style.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoadingProducts ? (
              renderProductSkeletons(4)
            ) : (
              products?.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <a href="#" className="inline-block border-2 border-primary hover:bg-primary text-primary hover:text-white font-medium py-2 px-8 rounded-md transition-colors">View All Collections</a>
          </div>
        </div>
      </section>
      
      <FeaturedProduct />
      
      {/* Bestsellers */}
      <section id="bestsellers" className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2">Our Bestsellers</h2>
            <p className="text-neutral-dark/80 font-montserrat max-w-2xl mx-auto">Discover our most loved fragrances that have captured hearts around the world.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingBestsellers ? (
              renderProductSkeletons(3)
            ) : (
              bestsellers?.slice(0, 3).map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="py-16 relative bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-xl overflow-hidden relative">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
              <img 
                src="https://images.pexels.com/photos/949590/pexels-photo-949590.jpeg" 
                alt="Luxury Perfume Collection" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 text-white">
              <span className="text-[#D4AF37] font-medium text-sm uppercase tracking-wider">Limited Time Offer</span>
              <h2 className="text-3xl md:text-4xl font-bold font-playfair mt-2 mb-4">Exclusive Collection Bundle</h2>
              <p className="mb-8 text-white/80 max-w-md">Experience our premium collection with a special 20% discount when you purchase any three fragrances. A perfect gift for yourself or your loved ones.</p>
              <div className="mb-8 flex items-center space-x-4">
                <div className="flex -space-x-4">
                  <img 
                    src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg" 
                    alt="Perfume 1" 
                    className="w-16 h-16 rounded-full border-2 border-white object-cover"
                  />
                  <img 
                    src="https://images.pexels.com/photos/8127803/pexels-photo-8127803.jpeg" 
                    alt="Perfume 2" 
                    className="w-16 h-16 rounded-full border-2 border-white object-cover"
                  />
                  <img 
                    src="https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg" 
                    alt="Perfume 3" 
                    className="w-16 h-16 rounded-full border-2 border-white object-cover"
                  />
                </div>
                <span className="text-2xl font-bold text-[#D4AF37]">₹19,999</span>
                <span className="text-xl line-through text-white/60">₹24,997</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white font-medium py-3 px-6 rounded-md transition-colors inline-block">Shop Now</a>
                <a href="#" className="bg-transparent hover:bg-white/10 text-white border border-white font-medium py-3 px-6 rounded-md transition-colors inline-block">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <AboutSection />
      <NewsletterSection />
    </>
  );
};

export default Home;
