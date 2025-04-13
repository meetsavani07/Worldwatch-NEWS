import { useNewsStore } from '../store';

const topics = [
  { id: 'all', label: 'All Topics' },
  { id: 'conflict', label: 'Conflict' },
  { id: 'climate', label: 'Climate' },
  { id: 'elections', label: 'Elections' },
  { id: 'economy', label: 'Economy' },
  { id: 'health', label: 'Health' },
];

export function TopicFilter() {
  const { selectedTopic, setSelectedTopic, darkMode } = useNewsStore();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => setSelectedTopic(topic.id)}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm transition-colors ${
            selectedTopic === topic.id
              ? 'bg-blue-600 text-white'
              : darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {topic.label}
        </button>
      ))}
    </div>
  );
}