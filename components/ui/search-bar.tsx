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
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center gap-4 lg:gap-8">
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
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent flex-1 text-preset-2-light text-white placeholder:text-white/50 focus:outline-none caret-red-500 leading-none py-0"
        />
      </div>
      <div className="h-px bg-blue-500" />
    </div>
  );
}
