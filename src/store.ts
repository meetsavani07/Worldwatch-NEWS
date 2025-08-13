import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NewsState } from './types';

const NEWS_API_KEY = 'your-newsapi-key-here'; // You'll need to get this from newsapi.org
const API_URL = 'https://newsapi.org/v2';

const countryMap: { [key: string]: string } = {
  'United States': 'us',
  'United Kingdom': 'gb',
  'France': 'fr',
  'Germany': 'de',
  'Italy': 'it',
  'Spain': 'es',
  'Russia': 'ru',
  'China': 'cn',
  'Japan': 'jp',
  'India': 'in',
  'Brazil': 'br',
  'Canada': 'ca',
  'Australia': 'au',
  'Argentina': 'ar',
  'Austria': 'at',
  'Belgium': 'be',
  'Bulgaria': 'bg',
  'Czech Republic': 'cz',
  'Egypt': 'eg',
  'Greece': 'gr',
  'Hong Kong': 'hk',
  'Hungary': 'hu',
  'Indonesia': 'id',
  'Ireland': 'ie',
  'Israel': 'il',
  'Latvia': 'lv',
  'Lithuania': 'lt',
  'Malaysia': 'my',
  'Mexico': 'mx',
  'Morocco': 'ma',
  'Netherlands': 'nl',
  'New Zealand': 'nz',
  'Nigeria': 'ng',
  'Norway': 'no',
  'Philippines': 'ph',
  'Poland': 'pl',
  'Portugal': 'pt',
  'Romania': 'ro',
  'Saudi Arabia': 'sa',
  'Serbia': 'rs',
  'Singapore': 'sg',
  'Slovakia': 'sk',
  'Slovenia': 'si',
  'South Africa': 'za',
  'South Korea': 'kr',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'Taiwan': 'tw',
  'Thailand': 'th',
  'Turkey': 'tr',
  'Ukraine': 'ua',
  'United Arab Emirates': 'ae',
  'Venezuela': 've',
};

const categoryMap: { [key: string]: string } = {
  'all': '',
  'technology': 'technology',
  'sports': 'sports',
  'entertainment': 'entertainment',
  'business': 'business',
  'health': 'health',
  'science': 'science',
  'politics': 'general',
  'environment': 'science',
  'education': 'general',
  'fashion': 'entertainment',
  'food': 'entertainment',
  'travel': 'entertainment',
  'culture': 'entertainment',
  'music': 'entertainment',
  'art': 'entertainment',
  'books': 'entertainment',
  'film': 'entertainment',
  'gaming': 'technology',
  'automotive': 'technology',
  'real-estate': 'business',
  'cryptocurrency': 'business',
};

export const useNewsStore = create<NewsState>()(
  persist(
    (set, get) => ({
      articles: [],
      loading: false,
      error: null,
      category: 'all',
      searchQuery: '',
      selectedCountry: null,
      selectedTopic: 'all',
      darkMode: false,
      bookmarkedArticles: [],
      bookmarks: [],
      selectedLanguage: 'en',

      setArticles: (articles) => set({ articles }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setCategory: (category) => set({ category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCountry: (country) => set({ selectedCountry: country }),
      setSelectedTopic: (topic) => set({ selectedTopic: topic }),
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      toggleBookmark: (article) => set((state) => {
        const isBookmarked = state.bookmarks.some(bookmark => bookmark.id === article.id);
        const newBookmarks = isBookmarked
          ? state.bookmarks.filter(bookmark => bookmark.id !== article.id)
          : [...state.bookmarks, article];
        
        return {
          bookmarks: newBookmarks,
          bookmarkedArticles: newBookmarks.map(bookmark => bookmark.id)
        };
      }),

      translateArticle: async (article) => {
        const { selectedLanguage } = get();
        if (selectedLanguage === 'en') {
          return;
        }

        try {
          const textToTranslate = {
            title: article.webTitle,
            body: article.fields?.bodyText || ''
          };

          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: JSON.stringify(textToTranslate),
              targetLanguage: selectedLanguage
            })
          });

          if (!response.ok) {
            throw new Error('Translation failed');
          }

          const { translatedText } = await response.json();
          const translatedData = JSON.parse(translatedText);

          set((state) => ({
            articles: state.articles.map((a) =>
              a.id === article.id
                ? {
                    ...a,
                    translatedTitle: translatedData.title,
                    translatedBody: translatedData.body,
                  }
                : a
            ),
          }));
        } catch (error) {
          console.error('Translation failed:', error);
        }
      },

      fetchArticles: async () => {
        const { category, searchQuery, selectedCountry, selectedTopic } = get();
        set({ loading: true, error: null });

        try {
          let endpoint = `${API_URL}/top-headlines`;
          const params = new URLSearchParams({
            'apiKey': NEWS_API_KEY,
            'pageSize': '50',
            'language': 'en',
          });

          // Use everything endpoint for search queries
          if (searchQuery || selectedTopic !== 'all') {
            endpoint = `${API_URL}/everything`;
            params.delete('language'); // everything endpoint doesn't use language param
            
            if (searchQuery) {
              params.append('q', searchQuery);
            }
            
            if (selectedTopic !== 'all') {
              const existingQuery = params.get('q') || '';
              const topicQuery = existingQuery ? `${existingQuery} AND ${selectedTopic}` : selectedTopic;
              params.set('q', topicQuery);
            }
            
            // Sort by publishedAt for everything endpoint
            params.append('sortBy', 'publishedAt');
          } else {
            // Use top-headlines endpoint for country-specific news
            if (selectedCountry && countryMap[selectedCountry]) {
              params.append('country', countryMap[selectedCountry]);
            } else {
              params.append('country', 'us'); // Default to US
            }
            
            if (category !== 'all' && categoryMap[category]) {
              params.append('category', categoryMap[category]);
            }
          }

          const response = await fetch(`${endpoint}?${params}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || `Failed to fetch articles: ${data.code}`);
          }

          const formattedArticles = data.articles
            .filter((article: any) => article.title && article.title !== '[Removed]')
            .map((article: any) => ({
            id: article.url, // Use URL as unique ID
            webTitle: article.title,
            webUrl: article.url,
            webPublicationDate: article.publishedAt,
            fields: {
              thumbnail: article.urlToImage,
              bodyText: article.description || article.content,
            },
            sectionName: article.source?.name || 'News',
            readingTime: article.content 
              ? Math.ceil(article.content.split(' ').length / 200)
              : undefined
          }));

          set({ articles: formattedArticles, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },
    }),
    {
      name: 'news-storage',
      partialize: (state) => ({ 
        darkMode: state.darkMode,
        bookmarkedArticles: state.bookmarkedArticles,
        bookmarks: state.bookmarks,
        selectedLanguage: state.selectedLanguage
      }),
    }
  )
);