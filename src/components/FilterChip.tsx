import { Check } from 'lucide-react';

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`filter-chip ${active ? 'active' : ''}`}
    >
      {active && <Check className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </button>
  );
}
