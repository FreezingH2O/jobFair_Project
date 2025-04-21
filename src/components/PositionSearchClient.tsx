// "use client";

// import { useState } from "react";
// import PositionCatalog from "./PositionCatalog";
// import SearchBar from "./SearchBar";
// import { PositionJson, PositionItem } from "@/../../interface";

// interface Props {
//   positions: PositionJson;
//   tags: string[];
// }

// export default function PositionSearchClient({ positions, tags}: Props) {
//   const [searchKey, setSearchKey] = useState("");
//   const [filterTags, setFilterTags] = useState<string[]>([]);

//  // console.log("Passing tags to SearchBar:", tags); 
//   const filteredData = {
//     ...positions,
//     data: positions.data.filter((position: PositionItem) => {
//       const matchName =
//         !searchKey || position.name.toLowerCase().includes(searchKey.toLowerCase());

//       const matchTags =
//         !filterTags.length ||
//         position.tags?.some((tag: string) =>
//           filterTags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
//         );

//       return matchName && matchTags;
//     }),
//   };

//   return (
//     <>
//     <div className="mb-8">
//       <SearchBar
      
//         searchKey={searchKey}
//         onSearchChange={setSearchKey}
//         display="Search positions by name..."
//         tags={tags} 
//         selectedTags={filterTags}
//         onTagToggle={(tag) => {
//             setFilterTags((prev) =>
//             prev.includes(tag)
//                 ? prev.filter((t) => t !== tag) // remove if selected
//                 : [...prev, tag] // add if not selected
//             );
//         }}
//         onClearTags={() => setFilterTags([])}

       
//         />
//     </div>

//       <PositionCatalog
//         positionJson={filteredData}
//         searchKey={searchKey}
//         filterTags={filterTags}
//       />
//     </>
//   );
// }
