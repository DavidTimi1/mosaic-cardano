import React from 'react';
import { AlertCircleIcon } from 'lucide-react';

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 text-red-600 flex items-center gap-x-2 text-sm p-3 rounded-xl border border-red-200 mt-2">
      <AlertCircleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}
