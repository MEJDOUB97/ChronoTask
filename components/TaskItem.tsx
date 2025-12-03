import React from 'react';
import { Trash2, Check, Clock } from 'lucide-react';
import { Task, Priority } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  [Priority.HIGH]: 'bg-red-100 text-red-700 border-red-200',
  [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [Priority.LOW]: 'bg-green-100 text-green-700 border-green-200',
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div 
      className={`
        group flex items-center p-3 rounded-xl border transition-all duration-300
        ${task.completed 
          ? 'bg-slate-50 border-slate-100 opacity-75' 
          : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-100'
        }
      `}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`
          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mr-3
          ${task.completed 
            ? 'bg-indigo-500 border-indigo-500' 
            : 'border-slate-300 hover:border-indigo-400'
          }
        `}
      >
        {task.completed && <Check size={14} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p 
          className={`
            text-base font-medium truncate transition-all
            ${task.completed ? 'text-slate-400 line-through decoration-slate-400' : 'text-slate-800'}
          `}
        >
          {task.text}
        </p>
      </div>

      <div className="flex items-center gap-2 ml-3">
        <span 
          className={`
            text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border
            ${priorityColors[task.priority]}
          `}
        >
          {task.priority}
        </span>
        
        <button
          onClick={() => onDelete(task.id)}
          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
