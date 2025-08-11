import * as React from "react"

import { cn } from "@/lib/utils"

// Custom TimeInput component to allow custom dropdown for time selection
import { useState } from "react"

const defaultTimeOptions = [
  "08:00", "08:30", "09:00", "09:30", "10:00",
  "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00"
];

function TimeInput({
  className,
  value,
  onChange,
  options = defaultTimeOptions,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & {
  options?: string[]
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (option: string) => {
    if (onChange) {
      // Simulate a change event
      const event = {
        target: { value: option, name: props.name },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        data-slot="input"
        className={cn(
          "pr-8 pl-2 h-[36px] mt-1 w-full rounded-md border bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none " +
          "focus-visible:border-zinc-950 focus-visible:ring-zinc-950/50 focus-visible:ring-[3px] " +
          "dark:bg-zinc-200/30 dark:border-zinc-800 dark:focus-visible:border-zinc-300 dark:focus-visible:ring-zinc-300/50 " +
          "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 " +
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
          "appearance-none dark:text-zinc-50 text-zinc-950",
          className
        )}
        value={value}
        readOnly
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
        onMouseDown={e => { e.preventDefault(); setShowDropdown(v => !v); }}
        aria-label="Show time options"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {showDropdown && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg max-h-48 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              className={`px-3 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm ${option === value ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
              onMouseDown={e => { e.preventDefault(); handleSelect(option); }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  // If type is "time", use custom TimeInput for dropdown
  if (type === "time") {
    return <TimeInput className={className} {...props} />;
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-zinc-950 placeholder:text-zinc-500 selection:bg-zinc-900 selection:text-zinc-50 dark:bg-zinc-200/30 border-zinc-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:selection:bg-zinc-50 dark:selection:text-zinc-900 dark:dark:bg-zinc-800/30 dark:border-zinc-800",
        "focus-visible:border-zinc-950 focus-visible:ring-zinc-950/50 focus-visible:ring-[3px] dark:focus-visible:border-zinc-300 dark:focus-visible:ring-zinc-300/50",
        "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900",
        className
      )}
      {...props}
    />
  )
}

export { Input }
