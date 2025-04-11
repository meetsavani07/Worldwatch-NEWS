import { Link } from 'react-router-dom';
import { Bookmark, Moon, Newspaper, Search, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNewsStore } from '../store';
import { useEffect, useState, useRef } from 'react';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'business', label: 'Business' },
  { id: 'health', label: 'Health' },
  { id: 'science', label: 'Science' },
  { id: 'politics', label: 'Politics' },
  { id: 'environment', label: 'Environment' },
  { id: 'education', label: 'Education' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'food', label: 'Food' },
  { id: 'travel', label: 'Travel' },
  { id: 'culture', label: 'Culture' },
  { id: 'music', label: 'Music' },
  { id: 'art', label: 'Art' },
  { id: 'books', label: 'Books' },
  { id: 'film', label: 'Film' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'automotive', label: 'Automotive' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'cryptocurrency', label: 'Cryptocurrency' },
];

export function Header() {
  const { 
    setSearchQuery, 
    setCategory, 
    category, 
    darkMode, 
    toggleDarkMode,
    bookmarks
  } = useNewsStore();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;
      const isAboveMap = currentScrollPos < 500;

      setVisible(!isScrollingDown || isAboveMap);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const scroll = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = 300;
      navRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-md border-b`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Newspaper className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              WorldWatch News
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search news..."
                className={`pl-10 pr-4 py-2 rounded-full border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative group">
              <button
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } relative`}
              >
                <Bookmark className={`h-5 w-5 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`} />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {bookmarks.length}
                  </span>
                )}
              </button>
              
              {bookmarks.length > 0 && (
                <div className={`absolute right-0 mt-2 w-72 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } rounded-lg shadow-lg hidden group-hover:block border`}>
                  <div className="p-4">
                    <h3 className={`font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Bookmarked Articles ({bookmarks.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {bookmarks.map(article => (
                        <a
                          key={article.id}
                          href={article.webUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block text-sm ${
                            darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                          } hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded`}
                        >
                          {article.webTitle}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-200" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        <div className="relative flex items-center py-4">
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 z-10 p-2 rounded-full ${
              darkMode 
                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            } shadow-md`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <nav 
            ref={navRef}
            className="flex space-x-3 overflow-x-auto scrollbar-hide mx-8 scroll-smooth"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  category === cat.id
                    ? 'bg-blue-600 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
          
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 z-10 p-2 rounded-full ${
              darkMode 
                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            } shadow-md`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}