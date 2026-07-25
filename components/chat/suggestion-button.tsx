import React from "react";

type SuggestionButtonProps = {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
};

const SuggestionButton = ({
  label,
  icon: Icon,
  onClick,
}: SuggestionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-1.5
        px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs font-medium

        bg-white/70 dark:bg-card/60 backdrop-blur-md
        border whitespace-nowrap

        hover:border-primary/50 hover:bg-primary/10
        active:scale-95
      "
    >
      <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
      <span>{label}</span>
    </button>
  );
};

export default SuggestionButton;