import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Play, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import { createRun, listRuns, getVaultStatus, RunRequest, RunResponse } from '@/lib/api';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';
import RunCard from '@/components/RunCard';
import NewRunForm from '@/components/NewRunForm';

export default function Home() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [vaultStatus, setVaultStatus] = useState<{ connected: boolean; vault_path?: string }>({
    connected: false,
  });
  const [showNewRunForm, setShowNewRunForm] = useState(false);

  useEffect(() => {
    loadRuns();
    checkVaultStatus();
  }, []);

  const loadRuns = async () => {
    try {
      const data = await listRuns();
      setRuns(data.runs);
    } catch (error) {
      console.error('Failed to load runs:', error);
      toast.error('Failed to load runs');
    }
  };

  const checkVaultStatus = async () => {
    try {
      const status = await getVaultStatus();
      setVaultStatus(status);
    } catch (error) {
      console.error('Failed to check vault status:', error);
    }
  };

  const handleCreateRun = async (request: RunRequest) => {
    setLoading(true);
    try {
      const run = await createRun(request);
      toast.success('Run created successfully!');
      setShowNewRunForm(false);
      loadRuns();
      return run;
    } catch (error: any) {
      console.error('Failed to create run:', error);
      toast.error(error.response?.data?.detail || 'Failed to create run');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Shad - AI Infrastructure Dashboard</title>
        <meta name="description" content="Shannon's Daemon - Personal AI Infrastructure" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Shad Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Shannon's Daemon - Long-context AI reasoning with Obsidian
                </p>
              </div>
              <button
                onClick={() => setShowNewRunForm(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <Play size={20} />
                New Run
              </button>
            </div>

            {/* Vault Status */}
            <div className="mt-6 card flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  vaultStatus.connected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Vault Status: {vaultStatus.connected ? 'Connected' : 'Disconnected'}
                </p>
                {vaultStatus.vault_path && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {vaultStatus.vault_path}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center gap-3">
                <Activity className="text-primary-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Runs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {runs.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Running</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {runs.filter((r) => r.status === 'RUNNING').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {runs.filter((r) => r.status === 'SUCCESS').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <XCircle className="text-red-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {runs.filter((r) => r.status === 'FAILED').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Runs */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Runs
            </h2>
            {runs.length === 0 ? (
              <div className="card text-center py-12">
                <Play className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No runs yet</p>
                <button
                  onClick={() => setShowNewRunForm(true)}
                  className="btn btn-primary"
                >
                  Create Your First Run
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {runs.map((run) => (
                  <RunCard key={run.run_id} run={run} onRefresh={loadRuns} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* New Run Modal */}
        {showNewRunForm && (
          <NewRunForm
            onSubmit={handleCreateRun}
            onClose={() => setShowNewRunForm(false)}
            loading={loading}
          />
        )}
      </Layout>
    </>
  );
}
