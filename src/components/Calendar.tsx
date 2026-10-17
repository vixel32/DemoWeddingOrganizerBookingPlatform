import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Lock, Check } from 'lucide-react';

interface CalendarProps {
  lockedDates: Set<string>;
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  minDate?: Date;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function Calendar({ lockedDates, selectedDate, onDateSelect, minDate }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const minDateNormalized = useMemo(() => {
    if (!minDate) return today;
    const d = new Date(minDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [minDate]);

  const daysInMonth = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const startWeekday = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(new Date(viewYear, viewMonth, d));
    return cells;
  }, [viewYear, viewMonth]);

  const canGoPrev = useMemo(() => {
    return viewYear > minDateNormalized.getFullYear() ||
      (viewYear === minDateNormalized.getFullYear() && viewMonth > minDateNormalized.getMonth());
  }, [viewYear, viewMonth, minDateNormalized]);

  const goPrev = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isDateDisabled = (date: Date) => {
    if (!date) return true;
    const dateStr = toDateStr(date);
    if (lockedDates.has(dateStr)) return true;
    if (date < minDateNormalized) return true;
    return false;
  };

  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-ink-200 text-ink-600 hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-serif text-lg sm:text-xl text-ink-900">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h3>
        <button
          onClick={goNext}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-ink-200 text-ink-600 hover:bg-gold-50 hover:border-gold-300 hover:text-gold-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {DAY_NAMES.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-ink-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {daysInMonth.map((date, idx) => {
          if (!date) return <div key={idx} className="aspect-square" />;
          const dateStr = toDateStr(date);
          const disabled = isDateDisabled(date);
          const isSelected = selectedDate === dateStr;
          const isLocked = lockedDates.has(dateStr);
          const isToday = toDateStr(today) === dateStr;

          return (
            <button
              key={idx}
              onClick={() => !disabled && onDateSelect(dateStr)}
              disabled={disabled}
              className={`
                relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200
                ${isSelected
                  ? 'bg-gold-600 text-white shadow-lg shadow-gold-600/20 scale-105'
                  : isLocked
                    ? 'bg-rose-50 text-rose-400 cursor-not-allowed'
                    : disabled
                      ? 'text-ink-300 cursor-not-allowed'
                      : 'text-ink-700 hover:bg-gold-50 hover:text-gold-700 hover:scale-105'
                }
                ${isToday && !isSelected ? 'ring-2 ring-gold-300' : ''}
              `}
            >
              {date.getDate()}
              {isLocked && !isSelected && (
                <Lock className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5" />
              )}
              {isSelected && (
                <Check className="absolute bottom-0.5 right-0.5 w-3 h-3" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-ink-100">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-gold-600"></div>
          <span className="text-xs text-ink-500">Terpilih</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-rose-50 border border-rose-200 flex items-center justify-center">
            <Lock className="w-2 h-2 text-rose-400" />
          </div>
          <span className="text-xs text-ink-500">Sudah dibooking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border-2 border-gold-300"></div>
          <span className="text-xs text-ink-500">Hari ini</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-white border border-ink-200"></div>
          <span className="text-xs text-ink-500">Tersedia</span>
        </div>
      </div>
    </div>
  );
}
