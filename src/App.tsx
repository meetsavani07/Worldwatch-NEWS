import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Loader2, MapPin } from "lucide-react";
import { Header } from "./components/Header";
import { ArticleCard } from "./components/ArticleCard";
import { TopicFilter } from "./components/TopicFilter";
import WorldMap from "./components/WorldMap";
import { useNewsStore } from "./store";
import { MessageCircleDashed, ArrowBigRight } from "lucide-react";

function App() {
  const {
    articles,
    loading,
    error,
    fetchArticles,
    category,
    searchQuery,
    selectedCountry,
    selectedTopic,
    darkMode,
    setSelectedCountry,
  } = useNewsStore();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchArticles();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [category, fetchArticles, searchQuery, selectedCountry, selectedTopic]);

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen w-full ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-7xl mt-16 sm:mt-28">
          <div className="max-w-full overflow-x-auto">
            <WorldMap />
          </div>

          <div className="mt-8">
            {selectedCountry && (
              <div className="flex items-center gap-2 mb-4">
                <MapPin
                  className={`h-5 w-5 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <h2
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  News from {selectedCountry}
                </h2>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className={`ml-2 px-3 py-1 text-sm rounded-full ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Clear
                </button>
              </div>
            )}

            <TopicFilter />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2
                className={`h-8 w-8 animate-spin ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
          ) : error ? (
            <div className="text-center flex justify-center text-red-600 p-4 bg-red-50 rounded-lg">
              The API key limit has been over. Please let me inform on my portfolio. <ArrowBigRight />
              <button>
                <a href="https://meet-savani.netlify.app/" target="blank">
                  <MessageCircleDashed className="ml-2" />
                </a>
              </button>
            </div>
          ) : // <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>
          articles.length === 0 ? (
            <div
              className={`text-center p-8 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <p className="text-lg">
                No articles found. Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
