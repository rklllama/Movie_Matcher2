import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

const STREAMING_SERVICES = [
  { id: 'netflix', name: 'Netflix', logo: 'https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg' },
  { id: 'prime', name: 'Prime Video', logo: 'https://image.tmdb.org/t/p/original/68MNrwlkpF7WnmNPXLah69CR5cb.jpg' },
  { id: 'hulu', name: 'Hulu', logo: 'https://image.tmdb.org/t/p/original/giwM8XX4V2AQb9vsoN7yti82tKK.jpg' },
  { id: 'disney', name: 'Disney+', logo: 'https://image.tmdb.org/t/p/original/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg' },
];

interface StreamingSelectorProps {
  selected: string[];
  onChange: (services: string[]) => void;
}

export function StreamingSelector({ selected, onChange }: StreamingSelectorProps) {
  const toggleService = (serviceId: string) => {
    const newSelected = selected.includes(serviceId)
      ? selected.filter((id) => id !== serviceId)
      : [...selected, serviceId];
    onChange(newSelected);
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {STREAMING_SERVICES.map((service) => (
        <button
          key={service.id}
          onClick={() => toggleService(service.id)}
          className={cn(
            'relative aspect-video rounded-lg border-2 p-2 transition-colors',
            selected.includes(service.id)
              ? 'border-red-500 bg-red-500/10'
              : 'border-gray-700 hover:border-gray-600'
          )}
        >
          {selected.includes(service.id) && (
            <div className="absolute right-2 top-2 rounded-full bg-red-500 p-1">
              <Check size={12} />
            </div>
          )}
          <img
            src={service.logo}
            alt={service.name}
            className="h-full w-full object-contain"
          />
        </button>
      ))}
    </div>
  );
}