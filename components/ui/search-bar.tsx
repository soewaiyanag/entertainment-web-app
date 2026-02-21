"use client";

import Image from "next/image";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search for movies or TV series",
}: SearchBarProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  return (
    <div className="flex items-center gap-4 lg:gap-8 w-full">
      <Image
        src="/assets/icon-search.svg"
        width={24}
        height={24}
        alt=""
        className="shrink-0 lg:w-8 lg:h-8"
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-transparent flex-1 text-preset-2-light text-white placeholder:text-white/50 focus:outline-none border-b border-transparent focus:border-blue-500 pb-4 transition-colors caret-red-500"
      />
    </div>
  );
}
