import React, { useState } from 'react';
import { Icons, SUPPORTED_LANGUAGES, INITIAL_CODE_PLACEHOLDER } from '../constants';
import { OptimizationFocus, RefactorResult } from '../types';
import { Button } from './Button';

interface RefactorPanelProps {
  onRefactor: (code: string, language: string, focus: OptimizationFocus) => Promise<void>;
  isLoading: boolean;
  result: RefactorResult | null;
}

export const RefactorPanel: React.FC<RefactorPanelProps> = ({ onRefactor, isLoading, result }) => {
  const [code, setCode] = useState(INITIAL_CODE_PLACEHOLDER);
  const [language, setLanguage] = useState('JavaScript');
  const [focus, setFocus] = useState<OptimizationFocus>(OptimizationFocus.READABILITY);
  const [activeTab, setActiveTab] = useState<'code' | 'explanation'>('code');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result?.improvedCode) {
      navigator.clipboard.writeText(result.improvedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRefactor(code, language, focus);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section */}
      <div className="flex flex-col bg-surface rounded-xl border border-secondary/20 shadow-xl overflow-hidden h-[600px] lg:h-auto">
        <div className="p-4 border-b border-secondary/20 bg-black/20 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/50"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/50"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/50"></span>
            <span className="text-sm font-mono text-secondary ml-2">Input Source</span>
          </div>
          
          <div className="flex gap-2">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-background text-sm text-secondary border border-secondary/30 rounded px-2 py-1 focus:ring-1 focus:ring-primary outline-none"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 w-full bg-[#0d1117] p-4 text-sm font-mono text-gray-300 resize-none focus:outline-none"
          spellCheck={false}
        />

        <div className="p-4 bg-surface border-t border-secondary/20 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-secondary">Focus:</span>
            <select 
              value={focus}
              onChange={(e) => setFocus(e.target.value as OptimizationFocus)}
              className="bg-background text-sm text-gray-300 border border-secondary/30 rounded px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none flex-1"
            >
              {Object.values(OptimizationFocus).map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <Button 
            onClick={handleSubmit} 
            isLoading={isLoading} 
            className="w-full sm:w-auto min-w-[140px]"
          >
            <div className="flex items-center space-x-2">
              <Icons.MagicWand />
              <span>Improve Code</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Output Section */}
      <div className="flex flex-col bg-surface rounded-xl border border-secondary/20 shadow-xl overflow-hidden h-[600px] lg:h-auto relative">
        <div className="p-4 border-b border-secondary/20 bg-black/20 flex items-center justify-between">
          <div className="flex space-x-4">
             <button
              onClick={() => setActiveTab('code')}
              className={`text-sm font-medium px-3 py-1.5 rounded transition-colors ${activeTab === 'code' ? 'bg-primary/10 text-primary' : 'text-secondary hover:text-gray-300'}`}
            >
              Improved Code
            </button>
            <button
              onClick={() => setActiveTab('explanation')}
              className={`text-sm font-medium px-3 py-1.5 rounded transition-colors ${activeTab === 'explanation' ? 'bg-primary/10 text-primary' : 'text-secondary hover:text-gray-300'}`}
            >
              Changes & Explanation
            </button>
          </div>
          
          {result && activeTab === 'code' && (
            <button 
              onClick={handleCopy}
              className="text-secondary hover:text-white transition-colors"
              title="Copy to Clipboard"
            >
              {copied ? <Icons.Check /> : <Icons.Clipboard />}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto bg-[#0d1117] relative">
          {!result ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary p-8 text-center opacity-50">
              <Icons.MagicWand />
              <p className="mt-4 text-sm">Select options and click "Improve Code" to see the magic happen.</p>
            </div>
          ) : (
            <>
              {activeTab === 'code' ? (
                <pre className="p-4 text-sm font-mono text-green-400 whitespace-pre-wrap">
                  {result.improvedCode}
                </pre>
              ) : (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-white font-medium mb-2">Summary</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{result.explanation}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-3">Key Changes</h3>
                    <ul className="space-y-2">
                      {result.keyChanges.map((change, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-400">
                          <span className="mr-2 text-primary mt-1">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};