import React from 'react'
import { Button } from '../ui/button';

type SuggestionButtonProps = {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}
const SuggestionButton = ({ label, icon: Icon, onClick }: SuggestionButtonProps) => {
  return (
    <button
  onClick={onClick}
  className="
    flex items-center justify-center gap-2
    px-4 py-2 rounded-full text-sm font-medium

    bg-gray/5
    border border-gray/10
    backdrop-blur-md

    hover:bg-primary/10 hover:border-primary/40
    hover:text-primary

    transition-all duration-200
  "
>
  <Icon className="h-4 w-4 opacity-80" />
  <span>{label}</span>
</button>
  );
};

export default SuggestionButton