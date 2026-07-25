import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Headphones,
  Watch,
  Sparkles,
} from "lucide-react";
import SuggestionButton from "./suggestion-button";

const items = [
  { id: 1, label: "iPhone", value: "iphone", icon: Smartphone },
  { id: 2, label: "iPad", value: "ipad", icon: Tablet },
  { id: 3, label: "MacBook", value: "macbook", icon: Laptop },
  { id: 4, label: "iMac", value: "imac", icon: Monitor },
  { id: 5, label: "AirPods", value: "airpods", icon: Headphones },
  { id: 6, label: "Apple Watch", value: "iwatch", icon: Watch },
];

type SuggestionGridProps = {
  onSelect: (value: string) => void;
};

const SuggestionGrid = ({ onSelect }: SuggestionGridProps) => {
  return (
    <div className="flex flex-col gap-2.5 md:pl-12 mt-2 w-full overflow-hidden">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 uppercase select-none px-1">
        <Sparkles size={13} className="text-primary" />
        <span>Popular Categories</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth w-full">
        {items.map((item) => (
          <div key={item.id} className="shrink-0">
            <SuggestionButton
              label={item.label}
              icon={item.icon}
              onClick={() => onSelect(item.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionGrid;