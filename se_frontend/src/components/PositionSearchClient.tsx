"use client";

import { useState } from "react";
import PositionCatalog from "./PositionCatalog";
import SearchBar from "./SearchBar";
import { PositionJson, PositionItem } from "@/../../interface";

interface Props {
  positions: PositionJson;
  skills: string[];
}

export default function PositionSearchClient({ positions, skills }: Props) {
  const [searchKey, setSearchKey] = useState("");
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1_000_000,
  });

  const filteredData = {
    ...positions,
    data: positions.data.filter((position: PositionItem) => {
      const matchTitle =
        !searchKey || position.title.toLowerCase().includes(searchKey.toLowerCase());

      const matchSkills =
        !filterSkills.length ||
        position.skill?.some((skill: string) =>
          filterSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
        );

      const matchSalary =
        !position.salary ||
        (
          position.salary.min >= salaryRange.min &&
          position.salary.max <= salaryRange.max
        );

      return matchTitle && matchSkills && matchSalary;
    }),
  };

  return (
    <>
      <div className="mb-8">
        <SearchBar
          searchKey={searchKey}
          onSearchChange={setSearchKey}
          display="Search positions by title..."
          tags={skills} // renamed from tags
          selectedTags={filterSkills}
          onTagToggle={(skill) => {
            setFilterSkills((prev) =>
              prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
            );
          }}
          onClearTags={() => setFilterSkills([])}
        />

        {/* Optional Salary Range Filter UI */}
        <div className="flex items-center gap-4 mt-4 ml-7">
          <label className="text-sm font-medium text-gray-700">Salary:</label>
          <input
            type="number"
            placeholder="Min"
            className="w-[100px] px-2 py-1 border border-gray-300 rounded-xl bg-gray-200 text-black text-sm text-center"
            value={salaryRange.min}
            onChange={(e) =>
              setSalaryRange((prev) => ({ ...prev, min: Number(e.target.value) }))
            }
          />
          <span className="text-black">to</span>
          <input
            type="number"
            placeholder="Max"
           className="w-[100px] px-2 py-1 border border-gray-300 rounded-xl bg-gray-200 text-black text-sm text-center"
            value={salaryRange.max}
            onChange={(e) =>
              setSalaryRange((prev) => ({ ...prev, max: Number(e.target.value) }))
            }
          />
        </div>
      </div>

      <PositionCatalog
        positionJson={filteredData}
        searchKey={searchKey}
        filterSkills={filterSkills}
        salaryRange={salaryRange}
      />
    </>
  );
}
