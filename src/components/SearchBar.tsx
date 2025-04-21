import { useState } from "react";
interface SearchBarProps {
    searchKey: string;
    onSearchChange: (value: string) => void;
    display: string;
    tags: string[];
    selectedTags: string[];
    onTagToggle: (tag: string) => void;
    onClearTags: () => void;

  }
  
  export default function SearchBar({
    searchKey,
    onSearchChange,
    display,
    tags,
    selectedTags,
    onTagToggle,
    onClearTags,
  }: SearchBarProps) {
    const [showTags, setShowTags] = useState(false);

   
    return (
      <div>
        <div className="flex flex-row items-center gap-4 m-7">
            <input
            type="text"
            value={searchKey}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={display}
            className="w-full h-9 px-4 py-6 border border-gray-400 rounded-full bg-white text-black"
            />

            <button
            onClick={() => setShowTags(!showTags)}
            className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-3 rounded-full whitespace-nowrap flex items-center text-sm"

            >
            {showTags ? "Hide tags" : "Show tags"}
            </button>
        </div>

  
        {showTags && (
        <div className="flex flex-wrap gap-2 m-2 justify-center">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1 text-sm rounded-full border  
                            transition-transform duration-100 hover:bg-blue-300 hover:scale-[1.025]
                    ${
                  isSelected
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>)}
        {selectedTags.length > 0 && (
            <button
                onClick={() => onClearTags()}
                className="mt-4 px-4 py-1 text-sm border border-red-400 bg-red-500 rounded-full hover:bg-red-800 transition"
            >
                Clear All Tags
            </button>
            )}

      </div>
    );
  }
  