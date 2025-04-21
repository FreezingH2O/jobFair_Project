"use client";

import { useState } from "react";
import CompanyCatalog from "./CompanyCatalog";
import SearchBar from "./SearchBar";
import { CompanyJson, CompanyItem } from "@/../../interface";

interface Props {
  companies: CompanyJson;
  userRole: string;
  tags: string[];
}

export default function CompanySearchClient({ companies, userRole , tags}: Props) {
  const [searchKey, setSearchKey] = useState("");
  const [filterTags, setFilterTags] = useState<string[]>([]);

 // console.log("Passing tags to SearchBar:", tags); 
  const filteredData = {
    ...companies,
    data: companies.data.filter((company: CompanyItem) => {
      const matchName =
        !searchKey || company.name.toLowerCase().includes(searchKey.toLowerCase());

      const matchTags =
        !filterTags.length ||
        company.tags?.some((tag: string) =>
          filterTags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
        );

      return matchName && matchTags;
    }),
  };

  return (
    <>
    <div className="mb-8">
      <SearchBar
      
        searchKey={searchKey}
        onSearchChange={setSearchKey}
        display="Search companies by name..."
        tags={tags} 
        selectedTags={filterTags}
        onTagToggle={(tag) => {
            setFilterTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag) // remove if selected
                : [...prev, tag] // add if not selected
            );
        }}
        onClearTags={() => setFilterTags([])}

       
        />
    </div>

      <CompanyCatalog
        companyJson={filteredData}
        searchKey={searchKey}
        filterTags={filterTags}
      />
    </>
  );
}
