
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { data } from "./data";
import "./Table.css";

// Constants for virtualization
const ITEMS_PER_PAGE = 10; // Adjust the number of items per page as needed
const VISIBLE_PAGES = 5; // Number of visible page buttons in pagination

function Table() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = useCallback(
    (e) => {
      const lowercaseSearchText = e.target.value.toLowerCase(); // Convert to lowercase
      setSearchText(lowercaseSearchText); // Store the lowercase version
      setCurrentPage(1); // Reset to the first page when the search text changes
    },
    [setCurrentPage, setSearchText]
  );
  

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.values(row).some(
        (value) => value && value.toString().toLowerCase().includes(searchText)
      );
    });
  }, [searchText]);

  // Virtualization
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const visiblePageNumbers = Array.from(
    { length: Math.min(totalPages, VISIBLE_PAGES) },
    (_, i) => i + 1
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div>
      <input
        className="myInput"
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={handleSearch}
      />
      <table className="myTable">
        <thead>
          <tr className="header">
            <th>INSTRUMENT</th>
            <th>SYMBOL</th>
            <th>Expiry Date</th>
            <th>Option Type</th>
            <th>Strike Prize</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Settle Pr</th>
            <th>Contracts</th>
            <th>Value In Lakh</th>
            <th>Open Int</th>
            <th>Change in OI</th>
            <th>Time Stamp</th>
            <th>Zero</th>{" "}
          </tr>
        </thead>
        <tbody>
          {visibleData.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        {visiblePageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            className={pageNumber === currentPage ? "active" : ""}
          >
            {pageNumber}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Table;
