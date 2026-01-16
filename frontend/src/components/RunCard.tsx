import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, RotateCw } from 'lucide-react';
import { getRun, resumeRun } from '@/lib/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface RunCardProps {
  run: any;
  onRefresh: () => void;
}

const statusConfig = {
  PENDING: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-700' },
  RUNNING: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900' },
  SUCCESS: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900' },
  PARTIAL: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900' },
  FAILED: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900' },
  NEEDS_HUMAN: { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900' },
};

export default function RunCard({ run, onRefresh }: RunCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const config = statusConfig[run.status as keyof typeof statusConfig] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  const loadDetails = async () => {
    if (details) {
      setExpanded(!expanded);
      return;
    }

    setLoading(true);
    try {
      const data = await getRun(run.run_id);
      setDetails(data);
      setExpanded(true);
    } catch (error) {
      console.error('Failed to load run details:', error);
      toast.error('Failed to load run details');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      await resumeRun(run.run_id);
      toast.success('Run resumed successfully');
      onRefresh();
    } catch (error: any) {
      console.error('Failed to resume run:', error);
      toast.error(error.response?.data?.detail || 'Failed to resume run');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${config.bg}`}>
              <StatusIcon className={config.color} size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{run.goal}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {run.run_id} • {run.created_at && format(new Date(run.created_at), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
              {run.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(run.status === 'PARTIAL' || run.status === 'FAILED') && (
            <button
              onClick={handleResume}
              disabled={loading}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RotateCw size={16} />
              Resume
            </button>
          )}
          <button
            onClick={loadDetails}
            disabled={loading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {expanded && details && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nodes</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {details.completed_nodes}/{details.nodes_count}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tokens</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {details.total_tokens.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
              <p className="text-lg font-semibold text-red-600">
                {details.failed_nodes}
              </p>
            </div>
            {details.stop_reason && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stop Reason</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {details.stop_reason}
                </p>
              </div>
            )}
          </div>

          {details.result && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result</p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {details.result}
                </pre>
              </div>
            </div>
          )}

          {details.error && (
            <div>
              <p className="text-sm font-medium text-red-600 mb-2">Error</p>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">{details.error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
