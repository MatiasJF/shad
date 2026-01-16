import { useState } from 'react';
import Head from 'next/head';
import { Search, FileText } from 'lucide-react';
import { searchVault, SearchResult } from '@/lib/api';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';

export default function VaultPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await searchVault(query, 20);
      setResults(data.results);
      if (data.results.length === 0) {
        toast('No results found', { icon: '🔍' });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Vault Search - Shad</title>
      </Head>

      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Vault Search
          </h1>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your vault..."
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex items-center gap-2"
              >
                <Search size={20} />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {results.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found {results.length} results
              </p>

              {results.map((result, idx) => (
                <div key={idx} className="card">
                  <div className="flex items-start gap-3">
                    <FileText className="text-primary-600 flex-shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {result.path}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {result.content}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          Score: {result.score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length === 0 && query && !loading && (
            <div className="card text-center py-12">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 dark:text-gray-400">
                No results found for "{query}"
              </p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
