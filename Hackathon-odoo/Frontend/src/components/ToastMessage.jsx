import React from 'react';

export default function ToastMessage({ toast, onClose }) {
  const { title, message, type = 'info' } = toast;

  const bgClass =
    type === 'success'
      ? 'bg-emerald-50/90'
      : type === 'error'
      ? 'bg-red-50/90'
      : type === 'warning'
      ? 'bg-amber-50/90'
      : 'bg-blue-50/90';

  const borderColor =
    type === 'success'
      ? 'bg-emerald-500'
      : type === 'error'
      ? 'bg-red-500'
      : type === 'warning'
      ? 'bg-amber-500'
      : 'bg-blue-500';

  const gradientBg =
    type === 'success'
      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
      : type === 'error'
      ? 'bg-gradient-to-br from-red-400 to-red-600'
      : type === 'warning'
      ? 'bg-gradient-to-br from-amber-400 to-amber-600'
      : 'bg-gradient-to-br from-blue-400 to-blue-600';

  const iconChar =
    type === 'success'
      ? '✓'
      : type === 'error'
      ? '✕'
      : type === 'warning'
      ? '!'
      : 'i';

  return (
    <div
      className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl transition-all duration-300 animate-slideIn ${bgClass}`}
    >
      {/* Left Border */}
      <div className={`absolute left-0 top-0 h-full w-1.5 ${borderColor}`} />

      <div className="flex items-start gap-4 p-5">
        {/* ICON */}
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg ${gradientBg}`}
        >
          {iconChar}
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <h4 className="text-[17px] font-semibold text-gray-900">{title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{message}</p>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => onClose(toast.id)}
          className="text-xl text-gray-400 transition hover:rotate-90 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className={`h-1 w-full animate-progress ${borderColor}`} />
    </div>
  );
}
