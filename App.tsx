import React, { useState, useCallback } from 'react';
import { RefactorPanel } from './components/RefactorPanel';
import { RefactorResult, OptimizationFocus } from './types';
import { refactorCode } from './services/geminiService';
import { Icons } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RefactorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRefactor = useCallback(async (code: string, language: string, focus: OptimizationFocus) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await refactorCode({ code, language, focus });
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-slate-200 font-sans selection:bg-primary/30">
      
      {/* Navbar */}
      <nav className="border-b border-secondary/20 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-tr from-primary to-accent rounded-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">
                CodeCraft AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
                <a href="#" className="text-sm text-secondary hover:text-white transition-colors">Documentation</a>
                <a href="#" className="text-sm text-secondary hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">Refactor & Optimize</h1>
          <p className="text-secondary max-w-2xl">
            Paste your messy or inefficient code below. Our Gemini-powered engine will rewrite it to be cleaner, faster, and more robust.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-400">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white">
              <span className="sr-only">Dismiss</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Core Logic Panel */}
        <div className="h-[calc(100vh-280px)] min-h-[600px]">
           <RefactorPanel 
             onRefactor={handleRefactor} 
             isLoading={isLoading} 
             result={result} 
           />
        </div>

      </main>
    </div>
  );
};

export default App;