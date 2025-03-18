import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useDebounce } from 'use-debounce';
import { apiRequest } from '@/lib/queryClient';
import { formatPrice } from '@/lib/utils';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add event listener to handle clicks outside the search bar
    function handleClickOutside(event: MouseEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch search results when debounced search term changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiRequest(
          'GET', 
          `/api/products?search=${encodeURIComponent(debouncedSearchTerm)}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length >= 2) {
      setIsLoading(true);
    } else {
      setShowResults(false);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full max-w-md" ref={searchBarRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for perfumes..."
          className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchTerm && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSearchTerm('');
              setShowResults(false);
            }}
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors flex items-center"
                  onClick={handleResultClick}
                >
                  <div className="w-12 h-12 flex-shrink-0 mr-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.category}</p>
                    <p className="text-sm font-medium text-primary mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : debouncedSearchTerm.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No products found for "{debouncedSearchTerm}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;