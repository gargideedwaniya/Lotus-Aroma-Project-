import { useState, useRef, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCarousel } from "@/components/ui/carousel";

type ProductGalleryProps = {
  images: string[];
  name: string;
}

const ProductGallery = ({ images, name }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselAPI = useRef(null);
  
  // Handle swipe to change main image
  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
  };

  // Track touch events for swipe action
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left - next image
      if (activeIndex < images.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    }
    
    if (touchStart - touchEnd < -50) {
      // Swipe right - previous image
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    }
  };
  
  return (
    <div>
      <Carousel 
        className="mb-4"
        opts={{
          loop: false,
          align: "start",
        }}
        orientation="horizontal"
        setApi={(api) => { carouselAPI.current = api; }}
        onSelect={(index) => handleSlideChange(index)}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div 
                className="overflow-hidden rounded-lg"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img 
                  src={image} 
                  alt={`${name} Image ${index + 1}`} 
                  className="w-full h-auto object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`cursor-pointer border rounded overflow-hidden ${index === activeIndex ? 'border-primary' : 'border-neutral-300 hover:border-primary'}`}
            onClick={() => {
              setActiveIndex(index);
              if (carouselAPI.current) {
                carouselAPI.current.scrollTo(index);
              }
            }}
          >
            <img 
              src={image} 
              alt={`${name} Thumbnail ${index + 1}`} 
              className="w-full h-20 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
