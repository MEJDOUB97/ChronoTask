import React, { useState } from 'react';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { Task } from '../types';
import { generateDailyInsight } from '../services/gemini';

interface AIInsightProps {
  tasks: Task[];
  dateStr: string;
}

const AIInsight: React.FC<AIInsightProps> = ({ tasks, dateStr }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (tasks.length === 0) return;
    setLoading(true);
    setInsight(null);
    const result = await generateDailyInsight(tasks, dateStr);
    setInsight(result);
    setLoading(false);
  };

  // Reset insight when date changes
  React.useEffect(() => {
    setInsight(null);
  }, [dateStr]);

  if (tasks.length === 0) {
    return (
      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex flex-col items-center justify-center text-center">
        <Sparkles className="text-indigo-300 mb-2" size={32} />
        <p className="text-indigo-800 font-medium">No tasks yet.</p>
        <p className="text-sm text-indigo-600">Add tasks to unlock AI insights.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-black opacity-10 rounded-full blur-xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-300" />
            Daily Reflection
          </h3>
          {!insight && !loading && (
             <button 
             onClick={handleGenerate}
             className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 backdrop-blur-sm"
           >
             Generate
           </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-4 animate-pulse">
            <RefreshCw className="animate-spin mb-2 opacity-80" size={24} />
            <p className="text-sm opacity-80">Consulting the productivity oracle...</p>
          </div>
        ) : insight ? (
          <div className="prose prose-invert prose-sm">
            <p className="leading-relaxed font-medium">{insight}</p>
            <div className="mt-4 flex justify-end">
               <button 
                onClick={handleGenerate}
                className="text-xs opacity-70 hover:opacity-100 hover:underline transition-opacity"
               >
                 Refresh
               </button>
            </div>
          </div>
        ) : (
          <p className="text-indigo-100 text-sm leading-relaxed">
            Ready to review your day? Tap generate to get an AI-powered analysis of your habits and progress for {dateStr}.
          </p>
        )}
      </div>
    </div>
  );
};

export default AIInsight;
