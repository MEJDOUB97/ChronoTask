import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Task } from '../types';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';

interface ProductivityChartProps {
  tasks: Task[];
  currentDate: Date;
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ tasks, currentDate }) => {
  // Generate data for the last 7 days ending at currentDate
  const data = React.useMemo(() => {
    const end = currentDate;
    const start = subDays(end, 6); // Last 7 days
    const interval = eachDayOfInterval({ start, end });

    return interval.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayTasks = tasks.filter(t => t.date === dateStr);
      const total = dayTasks.length;
      const completed = dayTasks.filter(t => t.completed).length;
      const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

      return {
        dateStr,
        dayName: format(date, 'EEE'),
        completed,
        rate,
      };
    });
  }, [tasks, currentDate]);

  const currentRate = data[data.length - 1].rate;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
           <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Weekly Momentum</h3>
           <p className="text-2xl font-bold text-indigo-600">{currentRate}% <span className="text-sm font-normal text-slate-400">completion today</span></p>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
                dataKey="dayName" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
                dy={10}
            />
            <Tooltip 
                cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRate)" 
                animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductivityChart;
