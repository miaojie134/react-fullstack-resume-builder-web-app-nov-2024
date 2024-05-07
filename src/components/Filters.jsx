import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { sildeUpDownWithScale } from "../animations";
import { FilterData } from "../utils/helpers";
import useFilters from "../hooks/useFilters";
import { useQueryClient } from "react-query";

const Filters = () => {
  const [isClearHovered, setIsClearHovered] = useState(false);

  const { data: filterData } = useFilters();

  const queryClient = useQueryClient();

  const handleFilterValue = (value) => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: value,
    });
  };

  const clearFilter = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  };
  return (
    <div className="w-full flex items-center justify-start py-4">
      <div
        onClick={clearFilter}
        className="border border-gray-300 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-md bg-gray-200 relative"
        onMouseEnter={() => setIsClearHovered(true)}
        onMouseLeave={() => setIsClearHovered(false)}
      >
        <MdLayersClear className="text-xl" />
        <AnimatePresence>
          {isClearHovered && (
            <motion.div
              {...sildeUpDownWithScale}
              className="absolute -top-8 -left-2 bg-white shadow-md rounded-md px-2 py-1"
            >
              <p className="whitespace-nowrap text-xs">Clear all</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex items-center justify-center overflow-x-scroll gap-6 scrollbar-none">
        {FilterData &&
          FilterData.map((item) => (
            <div
              key={item.id}
              className={`border border-gray-300 rounded-md px-6 py-2 cursor-pointer group hover:shadow-md ${
                filterData?.searchTerm === item.value && "bg-gray-300 shadow-md"
              }`}
              onClick={() => handleFilterValue(item.value)}
            >
              <p className="text-sm text-txtPrimary group-hover:text-txtDark whitespace-nowrap">
                {item.label}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Filters;
