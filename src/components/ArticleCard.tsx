import { Bookmark, Clock, ExternalLink, Globe } from 'lucide-react';
import { Article } from '../types';
import { useNewsStore } from '../store';
import { useEffect } from 'react';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { darkMode, bookmarkedArticles, toggleBookmark, selectedLanguage, translateArticle } = useNewsStore();
  const isBookmarked = bookmarkedArticles.includes(article.id);

  useEffect(() => {
    if (selectedLanguage !== 'en') {
      translateArticle(article);
    }
  }, [selectedLanguage, article, translateArticle]);

  return (
    <article className={`${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    } rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] border ${
      darkMode ? 'border-gray-700' : 'border-gray-200'
    }`}>
      {article.fields?.thumbnail && (
        <img
          src={article.fields.thumbnail}
          alt={article.webTitle}
          className="w-full h-40 sm:h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
          <span className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium px-3 py-1 rounded-full ${
            darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
          }`}>
            {article.sectionName}
          </span>
          <div className="flex items-center space-x-4">
            {article.readingTime && (
              <span className={`flex items-center text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Clock className="h-4 w-4 mr-1" />
                {article.readingTime} min read
              </span>
            )}
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(article.webPublicationDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <h2 className={`text-lg sm:text-xl font-semibold mb-3 line-clamp-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {article.translatedTitle || article.webTitle}
        </h2>
        {(article.translatedBody || article.fields?.bodyText) && (
          <p className={`${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          } mb-4 line-clamp-3 text-sm sm:text-base`}>
            {article.translatedBody || article.fields.bodyText}
          </p>
        )}
        <div className="flex items-center justify-between mt-4 pt-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        }">
          <div className="flex items-center space-x-4">
            <a
              href={article.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center ${
                darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              } font-medium text-sm sm:text-base`}
            >
              Read more
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
            {selectedLanguage !== 'en' && (
              <button
                onClick={() => translateArticle(article)}
                className={`flex items-center ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Globe className="h-4 w-4 mr-1" />
                <span className="text-sm">Translate</span>
              </button>
            )}
          </div>
          <button
            onClick={() => toggleBookmark(article)}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-300'
                : isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark className="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
}