import { ReactNode } from 'react';
import Link from 'next/link';
import { Brain, Home, FolderOpen, Settings, Activity } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <Brain className="text-primary-600" size={32} />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Shad</span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/vault"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <FolderOpen size={18} />
                  <span>Vault</span>
                </Link>

                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Activity size={18} />
                  <span>Admin</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Shannon's Daemon v0.1.0 - Personal AI Infrastructure for long-context reasoning
          </p>
        </div>
      </footer>
    </div>
  );
}
