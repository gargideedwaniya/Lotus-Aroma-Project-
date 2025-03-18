import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    // In a real application, you'd send this to your API
    toast({
      title: "Success",
      description: "Thank you for subscribing to our newsletter!",
      variant: "default"
    });
    
    setEmail('');
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">Join Our World of Fragrance</h2>
          <p className="text-neutral-dark/80 mb-8 max-w-2xl mx-auto">Subscribe to receive updates on new collections, exclusive offers, and fragrance inspiration tailored to your preferences.</p>
          
          <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 py-3 px-4 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 md:px-8 rounded-md transition-colors whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </div>
            <p className="text-xs text-neutral-dark/60 mt-3">By subscribing, you agree to our Privacy Policy and consent to receive updates from Lotus Aroma.</p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
