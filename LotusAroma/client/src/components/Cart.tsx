import { useState } from 'react';
import { Link } from 'wouter';
import CartItem from './CartItem';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, clearCart } = useCart();

  // Calculate cart totals
  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  // Handle opening/closing the cart drawer
  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Cart toggle button - fixed to the bottom right */}
      <button 
        onClick={toggleCart}
        className="fixed bottom-6 right-6 z-20 bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Toggle cart"
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {itemCount}
            </span>
          )}
        </div>
      </button>

      {/* Cart drawer */}
      <div 
        className={`fixed inset-0 z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60" 
          onClick={toggleCart}
        ></div>
        
        {/* Cart panel */}
        <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col">
          {/* Cart header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-medium text-gray-900">Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h2>
            <button 
              onClick={toggleCart}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Cart content */}
          <div className="flex-grow overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-4">Looks like you haven't added any perfumes to your cart yet.</p>
                <Link href="/" className="inline-block bg-primary text-white rounded-md px-4 py-2 hover:bg-primary/90 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={`${item.id}-${item.size}`} item={item} />
                ))}
              </div>
            )}
          </div>
          
          {/* Cart footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-900">Subtotal</span>
                <span className="text-primary">{formatPrice(cartTotal)}</span>
              </div>
              
              <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={clearCart}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
                <Link 
                  href="/checkout" 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-center"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;