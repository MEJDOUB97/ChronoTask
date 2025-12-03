import React from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '../types';

interface CalendarWidgetProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  tasks: Task[];
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ currentDate, onDateSelect, tasks }) => {
  const [viewDate, setViewDate] = React.useState(new Date(currentDate));

  // Sync internal view state if currentDate changes significantly (optional, but good for UX if changed externally)
  React.useEffect(() => {
    if (!isSameMonth(currentDate, viewDate)) {
      setViewDate(currentDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => setViewDate(subMonths(viewDate, 1));

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  // Helper to check if a day has tasks
  const getDayStatus = (d: Date) => {
    const dayStr = format(d, 'yyyy-MM-dd');
    const dayTasks = tasks.filter(t => t.date === dayStr);
    if (dayTasks.length === 0) return 'none';
    const allDone = dayTasks.every(t => t.completed);
    return allDone ? 'complete' : 'pending';
  };

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const isSelected = isSameDay(day, currentDate);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const status = getDayStatus(day);

      days.push(
        <div
          key={day.toString()}
          className={`
            relative p-2 w-10 h-10 flex items-center justify-center cursor-pointer rounded-full transition-all duration-200
            ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}
            ${isSelected ? 'bg-indigo-600 text-white shadow-md font-semibold' : 'hover:bg-slate-100'}
          `}
          onClick={() => onDateSelect(cloneDay)}
        >
          <span className="text-sm z-10">{formattedDate}</span>
          
          {/* Status Indicators */}
          {!isSelected && status !== 'none' && (
            <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${status === 'complete' ? 'bg-green-400' : 'bg-orange-400'}`}></div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="flex justify-between mb-1" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
    <div key={d} className="w-10 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
      {d}
    </div>
  ));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon size={20} className="text-indigo-600"/>
            {format(viewDate, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-1">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between mb-2 border-b border-slate-50 pb-2">
        {weekDays}
      </div>
      <div>{rows}</div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span>All Done</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-400"></div>
          <span>Pending</span>
        </div>
        <button 
          onClick={() => {
              const today = new Date();
              setViewDate(today);
              onDateSelect(today);
          }}
          className="ml-auto text-indigo-600 font-medium hover:text-indigo-800"
        >
            Jump to Today
        </button>
      </div>
    </div>
  );
};

export default CalendarWidget;
