import React from "react";
import { Label } from "./Label";

export const Filter = ({ onFilterChange }) => {
  return (
    <React.Fragment>
      <div className="py-2 px-4 flex flex-col items-center gap-y-2">
        <div className="flex items-center gap-x-4">
          <Label label={"Titlu:"} outlined={true} />
          <input
            name="title"
            type="text"
            placeholder="Title..."
            className="placeholder-black bg-transparent rounded-xl border-none outline-none outline outline-1 outline-offset-0 outline-black focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black p-2"
            onChange={(e) =>
              onFilterChange({ type: "title", value: e.target.value })
            }
          />
        </div>
        <div className="flex items-center gap-x-4">
          <Label label={"Tag:"} outlined={true} />
          <input
            name="tag"
            type="text"
            placeholder="Tag..."
            className="placeholder-black bg-transparent rounded-xl border-none outline-none outline outline-1 outline-offset-0 outline-black focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black p-2"
            onChange={(e) =>
              onFilterChange({ type: "tag", value: e.target.value })
            }
          />
        </div>
        <div className="flex items-center gap-x-4">
          <Label label={"Cuvinte cheie:"} outlined={true} />
          <input
            name="content"
            type="text"
            placeholder="Content..."
            className="placeholder-black bg-transparent rounded-xl border-none outline-none outline outline-1 outline-offset-0 outline-black focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black p-2"
            onChange={(e) =>
              onFilterChange({ type: "content", value: e.target.value })
            }
          />
        </div>
        <div className="flex items-center gap-x-4">
          <Label label={"Data:"} outlined={true} />
          <select
            name="dataOrder"
            className="placeholder-black bg-transparent rounded-xl border-none outline-none outline outline-1 outline-offset-0 outline-black focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black p-2"
            onChange={(e) =>
              onFilterChange({ type: "dataOrder", value: e.target.value })
            }
          >
            <option value="none">NO CHOICE</option>
            <option value="asc">ASCENDING</option>
            <option value="desc">DESCENDING</option>
          </select>
        </div>
      </div>
    </React.Fragment>
  );
};
