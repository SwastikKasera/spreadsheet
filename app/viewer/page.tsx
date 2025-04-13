"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileSpreadsheet,
  FileJson,
  FileText,
  Plus,
} from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function ViewerPage() {
  const router = useRouter();
  const [sheetData, setSheetData] = useState<any[][]>([]);

  // Memoize these functions to improve performance
  const addExtraRows = useCallback((data: any[][], count = 20) => {
    const colLength = data[0]?.length || 0;
    const emptyRow = Array(colLength).fill({ value: "" });
    const newRows = Array(count)
      .fill(null)
      .map(() => [...emptyRow]);
    return [...data, ...newRows];
  }, []);

  const addExtraCols = useCallback((data: any[][], extraColCount = 3) => {
    const maxColLength = Math.max(...data.map((row) => row.length));
    const targetColLength = maxColLength + extraColCount;

    return data.map((row) => {
      const missingCols = targetColLength - row.length;
      const extraCols = Array(missingCols).fill({ value: "" });
      return [...row, ...extraCols];
    });
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("excelData");
    if (!stored) {
      const extendedRows = addExtraRows([], 10);
      const extendedGrid = addExtraCols(extendedRows, 12);
      setSheetData(extendedGrid);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const formatted = parsed.map((row: any[]) =>
        row.map((cell: any) => ({ value: cell }))
      );

      const extendedRows = addExtraRows(formatted, 3);
      const extendedGrid = addExtraCols(extendedRows, 10);
      setSheetData(extendedGrid);
    } catch (err) {
      console.error("Error loading sheet data:", err);
      const extendedRows = addExtraRows([], 10);
      const extendedGrid = addExtraCols(extendedRows, 12);
      setSheetData(extendedGrid);
    }
  }, [router, addExtraRows, addExtraCols]);

  const getRawData = useCallback(() => {
    return sheetData.map((row) => row.map((cell) => cell?.value || ""));
  }, [sheetData]);

  const downloadFile = useCallback(
    (type: "xlsx" | "xls" | "csv" | "json") => {
      const data = getRawData();
      if (type === "json") {
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "spreadsheet.json";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `spreadsheet.${type}`);
      }
    },
    [getRawData]
  );

  // Memoize the spreadsheet component to prevent unnecessary re-renders
  const spreadsheetComponent = useMemo(
    () => (
      <Spreadsheet
        data={sheetData}
        className="w-full max-w-full [&_.Spreadsheet__cell]:bg-neutral-800 [&_.Spreadsheet__cell]:text-white 
        [&_.Spreadsheet__cell]:border-gray-700 [&_.Spreadsheet__header]:bg-neutral-900 [&_.Spreadsheet__header]:text-gray-300"
      />
    ),
    [sheetData]
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <header className="p-4 md:p-6 bg-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-start gap-3">
              <Button
                className="flex items-center cursor-pointer gap-1"
                onClick={() => router.push("/")}
              >
                <Plus className="h-4 w-4" />
                Open New File
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2 bg-chart-2 hover:bg-chart-2/80 cursor-pointer">
                    <Download className="h-4 w-4" />
                    Export to
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => downloadFile("xlsx")}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    <span>Export as XLSX</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadFile("xls")}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    <span>Export as XLS</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadFile("csv")}>
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Export as CSV</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadFile("json")}>
                    <FileJson className="h-4 w-4 mr-2" />
                    <span>Export as JSON</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto relative">
            <div className="flex">
              {/* Main content - using CSS grid for better performance */}
              {/* <div className="w-full lg:w-10/12 overflow-auto"> */}
              <div className="w-full overflow-auto">
                {/* <div className="min-w-[600px] rounded border border-gray-600 bg-neutral-800 p-2"> */}
                  {spreadsheetComponent}
                {/* </div> */}
              </div>

              {/* Sidebar - positioned absolutely on mobile, relatively on desktop */}
              {/* <aside className="hidden lg:block lg:w-2/12 lg:pl-4">
                <div className="sticky top-4">
                  <div className="rounded bg-white p-4 shadow-lg text-black">
                    <h2 className="font-semibold mb-2">Sponsored</h2>
                    <div className="text-sm leading-relaxed">
                      <p>🚀 Boost your productivity with XYZ tool.</p>
                      <p className="mt-2">
                        🔗{" "}
                        <a href="#" className="text-blue-600 underline">
                          Check it out
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </aside> */}
            </div>

            {/* Mobile-only sidebar that appears at the bottom */}
            {/* <div className="lg:hidden fixed top-4 w-56 z-10">
              <div className="rounded bg-white p-4 shadow-lg text-black">
                <h2 className="font-semibold mb-2">Sponsored</h2>
                <div className="text-sm leading-relaxed">
                  <p>🚀 Boost your productivity with XYZ tool.</p>
                  <p className="mt-2">
                    🔗{" "}
                    <a href="#" className="text-blue-600 underline">
                      Check it out
                    </a>
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </main>
      </div>
    </>
  );
}
