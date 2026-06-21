"use client";

import type { CaseStudyCardVariant } from "@/components/CaseStudyCard";
import { Icon, type IconName } from "@/components/Icon";

export interface WorkViewToggleProps {
  /** Currently selected view. */
  value: CaseStudyCardVariant;
  /** Called when a different view is chosen. */
  onChange: (value: CaseStudyCardVariant) => void;
}

const OPTIONS: {
  value: CaseStudyCardVariant;
  label: string;
  icon: IconName;
}[] = [
  { value: "stack", label: "Stack view", icon: "stack" },
  { value: "card", label: "Card view", icon: "grid" },
  { value: "inline", label: "In-line view", icon: "list" },
];

/**
 * Three icon buttons that switch the work section's view. Unselected buttons
 * are ghost (icon only); the selected button gets a light-grey round border.
 * Controlled via `value` / `onChange`.
 */
export function WorkViewToggle({ value, onChange }: WorkViewToggleProps) {
  return (
    <div role="group" aria-label="Work view" className="flex items-center gap-4">
      {OPTIONS.map(({ value: optionValue, label, icon }) => {
        const selected = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            aria-label={label}
            aria-pressed={selected}
            onClick={() => onChange(optionValue)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors focus-visible:bg-surface focus-visible:outline-none ${
              selected
                ? "border border-border"
                : "border border-transparent hover:bg-surface active:bg-border"
            }`}
          >
            <Icon name={icon} />
          </button>
        );
      })}
    </div>
  );
}
