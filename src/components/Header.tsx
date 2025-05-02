import { Link } from 'react-router-dom';
import { Bookmark, Moon, Newspaper, Search, Sun, ChevronLeft, ChevronRight, Menu, X, Globe } from 'lucide-react';
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

const languageGroups = [
  {
    name: 'Popular',
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'hi', name: 'Hindi' },
      { code: 'zh', name: 'Chinese' },
    ]
  },
  {
    name: 'European',
    languages: [
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
    ]
  },
  {
    name: 'Asian',
    languages: [
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' },
    ]
  }
];

export function Header() {
  const { 
    setSearchQuery, 
    setCategory, 
    category, 
    darkMode, 
    toggleDarkMode,
    bookmarks,
    selectedLanguage,
    setSelectedLanguage,
    fetchArticles
  } = useNewsStore();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageButtonRef.current && !languageButtonRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getCurrentLanguageName = () => {
    for (const group of languageGroups) {
      const language = group.languages.find(lang => lang.code === selectedLanguage);
      if (language) return language.name;
    }
    return 'English';
  };

  const handleLanguageChange = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setLanguageMenuOpen(false);
    await fetchArticles(); // Refetch articles when language changes
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
            <Newspaper className={`h-6 w-6 sm:h-8 sm:w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              WorldWatch
            </span>
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Selector */}
            <div className="relative" ref={languageButtonRef}>
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } flex items-center space-x-2 min-w-[120px] justify-center transition-colors`}
              >
                <Globe className={`h-5 w-5 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                  {getCurrentLanguageName()}
                </span>
              </button>
              
              {languageMenuOpen && (
                <div 
                  className={`absolute right-0 mt-2 w-56 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } rounded-lg shadow-lg border divide-y ${
                    darkMode ? 'divide-gray-700' : 'divide-gray-100'
                  } z-50`}
                >
                  {languageGroups.map((group) => (
                    <div key={group.name} className="py-2">
                      <div className={`px-4 py-1 text-xs font-semibold ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wider`}>
                        {group.name}
                      </div>
                      {group.languages.map(language => (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageChange(language.code)}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 ${
                            selectedLanguage === language.code
                              ? 'bg-blue-600 text-white'
                              : darkMode
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span>{language.name}</span>
                          {selectedLanguage === language.code && (
                            <span className="ml-auto text-xs">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="sm:hidden p-2"
            >
              <Search className={`h-5 w-5 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`} />
            </button>

            {/* Desktop Search */}
            <div className="hidden sm:block relative">
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
            
            {/* Mobile Search Input */}
            <div className={`absolute top-16 left-0 right-0 p-4 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            } ${searchOpen ? 'block' : 'hidden'} sm:hidden z-50`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search news..."
                  className={`w-full pl-10 pr-4 py-2 rounded-full border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                } rounded-lg shadow-lg hidden group-hover:block border z-50`}>
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`} />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Categories Menu */}
        <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'} py-4`}>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
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
          </div>
        </div>

        {/* Desktop Categories Menu */}
        <div className="relative hidden sm:flex items-center py-4">
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