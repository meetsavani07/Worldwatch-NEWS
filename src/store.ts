import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NewsState } from './types';

const GUARDIAN_API_KEY = '09c1417b-2a71-42b1-85b4-747fd0d2fcf9';
const API_URL = 'https://content.guardianapis.com/search';

const countryMap: { [key: string]: string } = {
  'United States': 'us',
  'United Kingdom': 'uk',
  'France': 'france',
  'Germany': 'germany',
  'Italy': 'italy',
  'Spain': 'spain',
  'Russia': 'russia',
  'China': 'china',
  'Japan': 'japan',
  'India': 'india',
  'Brazil': 'brazil',
  'Canada': 'canada',
  'Australia': 'australia',
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
          const params = new URLSearchParams({
            'api-key': GUARDIAN_API_KEY,
            'show-fields': 'thumbnail,bodyText',
            'page-size': '50',
          });

          if (searchQuery) {
            params.append('q', searchQuery);
          }

          if (selectedCountry && countryMap[selectedCountry]) {
            params.append('q', countryMap[selectedCountry]);
          }

          if (category !== 'all') {
            params.append('section', category.toLowerCase());
          }

          if (selectedTopic !== 'all') {
            params.append('q', selectedTopic);
          }

          const response = await fetch(`${API_URL}?${params}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch articles');
          }

          const formattedArticles = data.response.results.map((article: any) => ({
            id: article.id,
            webTitle: article.webTitle,
            webUrl: article.webUrl,
            webPublicationDate: article.webPublicationDate,
            fields: article.fields,
            sectionName: article.sectionName,
            readingTime: article.fields?.bodyText 
              ? Math.ceil(article.fields.bodyText.split(' ').length / 200)
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