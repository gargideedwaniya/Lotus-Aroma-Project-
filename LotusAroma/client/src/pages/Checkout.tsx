import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Link } from 'wouter';
import Logo from '@/components/ui/logo';

const Checkout = () => {
  const { items, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  
  // Calculate cart totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 10000; // ₹100 shipping
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-6">
          <Logo size="large" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">You don't have any items in your cart yet.</p>
        <Link 
          href="/" 
          className="inline-block bg-primary text-white rounded-md px-6 py-3 hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Checkout Header */}
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <Logo size="large" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>
      
      {/* Checkout Process Indicator */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex justify-between">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              checkoutStep === 'details' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              1
            </div>
            <span className="text-sm">Your Details</span>
          </div>
          <div className="flex-1 self-center border-t-2 border-gray-300 mx-4"></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              checkoutStep === 'payment' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              2
            </div>
            <span className="text-sm">Payment</span>
          </div>
          <div className="flex-1 self-center border-t-2 border-gray-300 mx-4"></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              checkoutStep === 'confirmation' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              3
            </div>
            <span className="text-sm">Confirmation</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {checkoutStep === 'details' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mb-3">Shipping Address</h3>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        id="state"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        id="country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                >
                  Continue to Payment
                </button>
              </div>
            )}
            
            {checkoutStep === 'payment' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                  <button 
                    onClick={() => setCheckoutStep('details')}
                    className="text-primary hover:text-primary/80"
                  >
                    ← Back
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="border border-gray-300 rounded-md mb-4">
                    <div className="p-4 flex items-center">
                      <input
                        id="card"
                        name="paymentMethod"
                        type="radio"
                        checked
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="card" className="ml-3 block">
                        <span className="text-gray-900 font-medium">Credit/Debit Card</span>
                        <div className="flex space-x-2 mt-1">
                          <div className="w-10 h-6 bg-blue-600 rounded"></div>
                          <div className="w-10 h-6 bg-red-500 rounded"></div>
                          <div className="w-10 h-6 bg-gray-800 rounded"></div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-3">Card Information</h3>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          id="cvv"
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        id="nameOnCard"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => {
                      setCheckoutStep('confirmation');
                      // In a real app, this is where you'd handle payment processing
                    }}
                    className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                  >
                    Pay {formatPrice(total)}
                  </button>
                </div>
              </div>
            )}
            
            {checkoutStep === 'confirmation' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
                <p className="text-gray-600 mb-6">
                  Your order has been successfully placed. <br />
                  Order #: LTA-{Math.floor(Math.random() * 10000)}
                </p>
                <p className="text-gray-600 mb-8">
                  A confirmation email has been sent to your email address.
                </p>
                <Link
                  href="/"
                  onClick={() => {
                    clearCart();
                    setCheckoutStep('details');
                  }}
                  className="inline-block bg-primary text-white rounded-md px-6 py-3 hover:bg-primary/90 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex py-3 border-b border-gray-200">
                  <div className="w-16 h-16 flex-shrink-0 mr-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-xs text-gray-500">Size: {item.size}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 py-4 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (18% GST)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
            
            {checkoutStep !== 'confirmation' && (
              <div className="mt-6 text-sm text-gray-500">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free returns within 14 days
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure payment processing
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;