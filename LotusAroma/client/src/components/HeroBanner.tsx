import { Link } from 'wouter';

const HeroBanner = () => {
  return (
    <section className="relative">
      <div className="w-full h-[500px] md:h-[600px] overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg" 
          alt="Luxury Perfumes" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="container mx-auto px-4 md:px-8 py-8">
            <div className="w-full md:w-1/2 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair leading-tight">Discover Your Signature Scent</h1>
              <p className="text-lg mb-8 font-montserrat font-light">Luxury fragrances crafted with the finest ingredients for the discerning individual.</p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#collections" 
                  className="inline-block bg-[#D4AF37] hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded-md transition-colors shadow-md hover:shadow-lg"
                >
                  Explore Collection
                </a>
                <a 
                  href="#bestsellers" 
                  className="inline-block bg-transparent hover:bg-white/10 text-white border border-white font-medium py-3 px-6 rounded-md transition-colors"
                >
                  Best Sellers
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
