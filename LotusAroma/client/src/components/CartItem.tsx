import { useCart, CartItem as CartItemType } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

type CartItemProps = {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateItemQuantity, removeItem } = useCart();
  
  const handleQuantityChange = (newQuantity: number) => {
    updateItemQuantity(item.id, item.size, newQuantity);
  };
  
  const handleRemove = () => {
    removeItem(item.id, item.size);
  };
  
  return (
    <div className="flex border border-gray-200 rounded-md overflow-hidden">
      {/* Product image */}
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product details */}
      <div className="flex-grow p-3 flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Remove item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>
        <p className="text-sm font-medium text-primary mt-1">{formatPrice(item.price)}</p>
        
        {/* Quantity controls */}
        <div className="flex items-center mt-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <span className="w-9 h-7 flex items-center justify-center border-t border-b border-gray-300 bg-white text-sm">
            {item.quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          <span className="ml-auto text-sm font-medium">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;