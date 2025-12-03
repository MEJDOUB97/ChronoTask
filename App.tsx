import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Plus, CheckCircle2, History } from 'lucide-react';

import { Task, Priority } from './types';
import { getStoredTasks, saveTasksToStorage, generateId, getTasksForDate } from './services/storage';

import CalendarWidget from './components/CalendarWidget';
import TaskItem from './components/TaskItem';
import ProductivityChart from './components/ProductivityChart';
import AIInsight from './components/AIInsight';

const App: React.FC = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // New Task State
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>(Priority.MEDIUM);

  // Initialize
  useEffect(() => {
    const stored = getStoredTasks();
    setTasks(stored);
  }, []);

  // Persist
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Derived
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const daysTasks = useMemo(() => getTasksForDate(tasks, selectedDateStr), [tasks, selectedDateStr]);
  const completedCount = daysTasks.filter(t => t.completed).length;
  const totalCount = daysTasks.length;
  const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  // Handlers
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: generateId(),
      text: newTaskText,
      completed: false,
      priority: newTaskPriority,
      date: selectedDateStr,
      createdAt: Date.now(),
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskText('');
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row max-w-7xl mx-auto">
      
      {/* Left Sidebar / Calendar Area */}
      <aside className="w-full md:w-[350px] lg:w-[400px] p-6 flex flex-col gap-6 border-r border-slate-200 bg-white md:min-h-screen z-10 relative">
        <header className="mb-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <History className="text-indigo-600" />
                ChronoTask
            </h1>
            <p className="text-slate-500 text-sm mt-1">Time travel for your productivity.</p>
        </header>

        <CalendarWidget 
          currentDate={selectedDate} 
          onDateSelect={setSelectedDate} 
          tasks={tasks}
        />

        <div className="hidden md:block flex-1">
             <ProductivityChart tasks={tasks} currentDate={selectedDate} />
        </div>
        
        {/* Mobile only chart spacer */}
        <div className="md:hidden">
             <ProductivityChart tasks={tasks} currentDate={selectedDate} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 flex flex-col h-full overflow-y-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {format(selectedDate, "EEEE, MMMM do")}
            </h2>
            <p className="text-slate-500 mt-1 font-medium">
               {totalCount === 0 
                 ? "No tasks planned for this day." 
                 : `You have completed ${completedCount} of ${totalCount} tasks.`}
            </p>
          </div>
          
          {/* Progress Bar (Visual Flair) */}
          <div className="w-full md:w-48">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">
                <span>Daily Progress</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                />
            </div>
          </div>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Task List Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Plus className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                type="text" 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add a new task..." 
                className="w-full pl-12 pr-32 py-4 bg-white rounded-2xl shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                 <select 
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                    className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg px-2 py-2 focus:outline-none mr-2 hover:bg-slate-100 cursor-pointer"
                 >
                    {Object.values(Priority).map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                 </select>
                 <button 
                    type="submit"
                    disabled={!newTaskText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors shadow-md shadow-indigo-200"
                 >
                    <Plus size={20} />
                 </button>
              </div>
            </form>

            {/* Tasks List */}
            <div className="space-y-3">
               {daysTasks.length === 0 ? (
                   <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                       <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                           <CheckCircle2 className="text-slate-300" size={32} />
                       </div>
                       <p className="text-slate-500 font-medium">No tasks found.</p>
                       <p className="text-slate-400 text-sm">Start planning your day above.</p>
                   </div>
               ) : (
                   daysTasks.map(task => (
                       <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={handleToggleTask} 
                            onDelete={handleDeleteTask} 
                        />
                   ))
               )}
            </div>
          </div>

          {/* Right Column (AI & Extra) */}
          <div className="flex flex-col gap-6">
            <AIInsight tasks={daysTasks} dateStr={selectedDateStr} />
            
            {/* Legend / Info */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Task Priorities</h4>
                <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-red-400 mr-3"></span>
                        High - Urgent & Important
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 mr-3"></span>
                        Medium - Routine Tasks
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-3"></span>
                        Low - Nice to have
                    </div>
                </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
