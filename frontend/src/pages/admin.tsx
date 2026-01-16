import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Database, Activity, AlertCircle } from 'lucide-react';
import { getCacheStats, getHITLQueue } from '@/lib/api';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';

export default function AdminPage() {
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [hitlQueue, setHitlQueue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cache, hitl] = await Promise.all([
        getCacheStats(),
        getHITLQueue(),
      ]);
      setCacheStats(cache);
      setHitlQueue(hitl);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin - Shad</title>
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Admin Dashboard
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cache Stats */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-primary-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cache Statistics
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <Activity className="animate-spin mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
              ) : cacheStats?.connected ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className="font-medium text-green-600">Connected</span>
                  </div>
                  {Object.entries(cacheStats).map(
                    ([key, value]: [string, any]) =>
                      key !== 'connected' && (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                        >
                          <span className="text-gray-600 dark:text-gray-400">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {typeof value === 'number'
                              ? value.toLocaleString()
                              : String(value)}
                          </span>
                        </div>
                      )
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
                  <p className="text-red-600">Cache not connected</p>
                </div>
              )}
            </div>

            {/* HITL Queue */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-yellow-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  HITL Queue
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <Activity className="animate-spin mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
              ) : hitlQueue ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {hitlQueue.stats?.pending || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {hitlQueue.stats?.total || 0}
                      </p>
                    </div>
                  </div>

                  {hitlQueue.items && hitlQueue.items.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Recent Items
                      </h3>
                      {hitlQueue.items.slice(0, 5).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                        >
                          <p className="text-sm text-gray-900 dark:text-white">
                            {item.description || item.item_id}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.created_at}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No data available</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button onClick={loadData} className="btn btn-secondary">
              Refresh Data
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}
