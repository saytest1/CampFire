import React from 'react';
import clsx from 'clsx';

export function Card({ children, className }) {
  return (
    <div className={clsx("rounded-2xl border bg-white p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx("mb-4 flex items-center justify-between", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h2 className={clsx("text-base font-semibold text-gray-700", className)}>
      {children}
    </h2>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={clsx("text-sm text-gray-900", className)}>
      {children}
    </div>
  );
}
