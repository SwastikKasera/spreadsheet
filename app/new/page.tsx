"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ViewerPage() {
  const [data, setData] = useState<any[][]>([]);

  useEffect(() => {
    const rawData = localStorage.getItem("excelData");
    if (rawData) {
      const parsedData = JSON.parse(rawData);
      const paddedData = parsedData.map((row: any[]) => {
        const newRow = [...row];
        while (newRow.length < 12) {
          newRow.push(""); // Fill empty columns to reach 12
        }
        return newRow;
      });
      setData(paddedData);
    }
  }, []);

  const columnHeaders = Array.from({ length: 12 }, (_, i) =>
    String.fromCharCode(65 + i)
  ); // A to L

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/">
          <Button variant="outline">+ Open New File</Button>
        </Link>
        <Button onClick={() => alert("Export feature not implemented yet")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          🡇 Export to
        </Button>
      </div>

      <div className="overflow-auto border border-gray-700 rounded">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-gray-600 px-2 py-1 bg-gray-800 w-8">#</th>
              {columnHeaders.map((col) => (
                <th key={col} className="border border-gray-600 px-2 py-1 bg-gray-800">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-gray-600 px-2 py-1 bg-gray-800 text-center">
                  {rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-600 px-2 py-1">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
