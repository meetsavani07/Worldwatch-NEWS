export interface Article {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: {
    thumbnail?: string;
    bodyText?: string;
  };
  sectionName: string;
  readingTime?: number;
}

export interface NewsState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  category: string;
  searchQuery: string;
  selectedCountry: string | null;
  selectedTopic: string;
  darkMode: boolean;
  bookmarkedArticles: string[];
  bookmarks: Article[];
  setArticles: (articles: Article[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCountry: (country: string | null) => void;
  setSelectedTopic: (topic: string) => void;
  toggleDarkMode: () => void;
  toggleBookmark: (article: Article) => void;
  fetchArticles: () => Promise<void>;
}