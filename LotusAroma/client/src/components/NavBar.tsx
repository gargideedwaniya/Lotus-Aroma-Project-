import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import SearchBar from './SearchBar';
import { useCart } from '@/contexts/CartContext';
import AuthModal from './AuthModal';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/ui/logo';

type User = {
  id: number;
  username: string;
};

const NavBar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { items } = useCart();
  const { toast } = useToast();
  const [location] = useLocation();

  // Check if user is authenticated
  const { data: user, refetch: refetchUser, isLoading } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/auth/user');
        if (!response.ok) {
          return null;
        }
        return response.json();
      } catch (error) {
        return null;
      }
    },
    // Don't show error when not authenticated
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Count total items in cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await apiRequest('POST', '/api/auth/logout');
      if (response.ok) {
        toast({
          title: 'Logged Out',
          description: 'You have been successfully logged out.',
        });
        refetchUser();
        setShowUserMenu(false);
      }
    } catch (error) {
      toast({
        title: 'Logout Failed',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  
  // Close mobile menu if location changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and brand name */}
          <Logo size="large" className="flex items-center space-x-2" />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/collections" className="text-gray-700 hover:text-primary transition-colors">
              Collections
            </Link>
            <Link href="/bestsellers" className="text-gray-700 hover:text-primary transition-colors">
              Best Sellers
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary transition-colors">
              About Us
            </Link>
          </div>

          {/* Search, Cart, and Account */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* Cart Link */}
            <Link href="/checkout" className="text-gray-700 hover:text-primary transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Authentication */}
            {isLoading ? (
              <div className="h-6 w-6 rounded-full animate-pulse bg-gray-200"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors"
                >
                  <span className="hidden md:inline-block">{user.username}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Account
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-gray-700 hover:text-primary transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="hidden md:inline-block ml-1">Sign In</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-700 hover:text-primary"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3">
            <Link href="/" className="block text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/collections" className="block text-gray-700 hover:text-primary transition-colors">
              Collections
            </Link>
            <Link href="/bestsellers" className="block text-gray-700 hover:text-primary transition-colors">
              Best Sellers
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-primary transition-colors">
              About Us
            </Link>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </nav>
  );
};

export default NavBar;