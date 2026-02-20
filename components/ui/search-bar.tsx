"use client";

import Image from "next/image";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  placeholder = "Search for movies or TV series",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
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
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-transparent flex-1 text-preset-2-light text-white placeholder:text-white/50 focus:outline-none border-b border-transparent focus:border-blue-500 pb-4 transition-colors caret-red-500"
      />
    </div>
  );
}
