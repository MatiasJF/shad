import { useState } from 'react';
import { X } from 'lucide-react';
import { RunRequest } from '@/lib/api';

interface NewRunFormProps {
  onSubmit: (request: RunRequest) => Promise<any>;
  onClose: () => void;
  loading: boolean;
}

export default function NewRunForm({ onSubmit, onClose, loading }: NewRunFormProps) {
  const [formData, setFormData] = useState<RunRequest>({
    goal: '',
    strategy: undefined,
    verify: 'basic',
    write_files: false,
    budget: {
      max_depth: 3,
      max_nodes: 50,
      max_wall_time: 300,
      max_tokens: 100000,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Run</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal */}
          <div>
            <label htmlFor="goal" className="label">
              Goal / Task Description
            </label>
            <textarea
              id="goal"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="input min-h-[100px]"
              placeholder="Describe what you want Shad to accomplish..."
              required
            />
          </div>

          {/* Strategy */}
          <div>
            <label htmlFor="strategy" className="label">
              Strategy (Optional)
            </label>
            <select
              id="strategy"
              value={formData.strategy || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  strategy: e.target.value as any || undefined,
                })
              }
              className="input"
            >
              <option value="">Auto-detect</option>
              <option value="software">Software</option>
              <option value="research">Research</option>
              <option value="analysis">Analysis</option>
              <option value="planning">Planning</option>
            </select>
          </div>

          {/* Verification Level */}
          <div>
            <label htmlFor="verify" className="label">
              Verification Level
            </label>
            <select
              id="verify"
              value={formData.verify}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  verify: e.target.value as any,
                })
              }
              className="input"
            >
              <option value="off">Off</option>
              <option value="basic">Basic (imports + syntax)</option>
              <option value="build">Build (+ type checking)</option>
              <option value="strict">Strict (+ tests)</option>
            </select>
          </div>

          {/* Budget Settings */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Budget Settings</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="max_depth" className="label">
                  Max Depth
                </label>
                <input
                  type="number"
                  id="max_depth"
                  value={formData.budget?.max_depth || 3}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget: { ...formData.budget, max_depth: parseInt(e.target.value) },
                    })
                  }
                  className="input"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label htmlFor="max_nodes" className="label">
                  Max Nodes
                </label>
                <input
                  type="number"
                  id="max_nodes"
                  value={formData.budget?.max_nodes || 50}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget: { ...formData.budget, max_nodes: parseInt(e.target.value) },
                    })
                  }
                  className="input"
                  min="1"
                  max="200"
                />
              </div>

              <div>
                <label htmlFor="max_wall_time" className="label">
                  Max Time (seconds)
                </label>
                <input
                  type="number"
                  id="max_wall_time"
                  value={formData.budget?.max_wall_time || 300}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget: { ...formData.budget, max_wall_time: parseInt(e.target.value) },
                    })
                  }
                  className="input"
                  min="10"
                  max="3600"
                />
              </div>

              <div>
                <label htmlFor="max_tokens" className="label">
                  Max Tokens
                </label>
                <input
                  type="number"
                  id="max_tokens"
                  value={formData.budget?.max_tokens || 100000}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget: { ...formData.budget, max_tokens: parseInt(e.target.value) },
                    })
                  }
                  className="input"
                  min="1000"
                  max="1000000"
                  step="1000"
                />
              </div>
            </div>
          </div>

          {/* Write Files */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="write_files"
              checked={formData.write_files}
              onChange={(e) =>
                setFormData({ ...formData, write_files: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
            />
            <label htmlFor="write_files" className="text-sm text-gray-700 dark:text-gray-300">
              Write output files to disk
            </label>
          </div>

          {formData.write_files && (
            <div>
              <label htmlFor="output_path" className="label">
                Output Path
              </label>
              <input
                type="text"
                id="output_path"
                value={formData.output_path || ''}
                onChange={(e) =>
                  setFormData({ ...formData, output_path: e.target.value })
                }
                className="input"
                placeholder="/path/to/output"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formData.goal}
            >
              {loading ? 'Creating...' : 'Create Run'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
