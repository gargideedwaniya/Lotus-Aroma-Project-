const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/4219193/pexels-photo-4219193.jpeg" 
                alt="Our Perfume Laboratory" 
                className="w-full h-auto rounded-lg shadow-md"
              />
              <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center mb-2">
                  <i className="fas fa-award text-[#D4AF37] text-2xl mr-3"></i>
                  <p className="font-medium text-neutral-dark">Award-winning fragrances since 2010</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">About Lotus Aroma</span>
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mt-2 mb-4">Crafting Memories Through Scent</h2>
            <p className="mb-4 text-neutral-dark/80">Founded in 2010, Lotus Aroma has been dedicated to creating exquisite fragrances that capture moments and emotions. Our master perfumers work with the finest ingredients sourced from around the world to craft unique scent experiences.</p>
            <p className="mb-6 text-neutral-dark/80">Each Lotus Aroma perfume tells a story, from the initial inspiration to the final creation. We believe that fragrance is an invisible but powerful accessory that leaves an unforgettable impression.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <div className="text-[#D4AF37] text-xl mr-3 mt-1">
                  <i className="fas fa-leaf"></i>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-dark mb-1">Natural Ingredients</h3>
                  <p className="text-sm text-neutral-dark/70">Ethically sourced, finest quality raw materials</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-[#D4AF37] text-xl mr-3 mt-1">
                  <i className="fas fa-flask"></i>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-dark mb-1">Master Perfumers</h3>
                  <p className="text-sm text-neutral-dark/70">Decades of expertise in fragrance composition</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-[#D4AF37] text-xl mr-3 mt-1">
                  <i className="fas fa-globe-asia"></i>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-dark mb-1">Global Inspiration</h3>
                  <p className="text-sm text-neutral-dark/70">Fragrances inspired by world cultures</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-[#D4AF37] text-xl mr-3 mt-1">
                  <i className="fas fa-certificate"></i>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-dark mb-1">Luxury Quality</h3>
                  <p className="text-sm text-neutral-dark/70">Premium standards in every bottle</p>
                </div>
              </div>
            </div>
            
            <a href="#" className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors">Our Story</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
