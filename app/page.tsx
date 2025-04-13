"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Navbar } from "@/components/navbar";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (!selectedFile) return;

    const isCSV = selectedFile.name.endsWith(".csv");
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;

      let workbook;
      if (isCSV) {
        workbook = XLSX.read(result, { type: "binary" });
      } else {
        const data = new Uint8Array(result as ArrayBuffer);
        workbook = XLSX.read(data, { type: "array" });
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      localStorage.setItem("excelData", JSON.stringify(jsonData));
    };

    if (isCSV) {
      reader.readAsText(selectedFile);
    } else {
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleOpenClick = () => {
    if (file) {
      router.push("/viewer");
    }
  };

  return (
    <>
      <Head>
        <title>Open XLSX File Online - Instant Spreadsheet Viewer</title>
        <meta
          name="description"
          content="Easily open and view your XLSX, XLS, and CSV files online. Fast, secure, and browser-based spreadsheet viewer."
        />
        <meta
          name="keywords"
          content="open xlsx file online, xlsx viewer, view excel online, upload xlsx file, excel reader online"
        />
      </Head>

      <Navbar />

      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <section className="w-full max-w-md space-y-6">
          <header className="text-center">
            <h1 className="text-3xl font-bold">Open XLSX/XLS File Online</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              View XLSX, XLS, and CSV spreadsheet files directly in your browser. <br />No Excel required.
            </p>
          </header>

          <FileUpload onFileChange={handleFileChange} />

          <Button
            className="w-full bg-green-500 hover:bg-green-600 cursor-pointer font-bold"
            disabled={!file}
            onClick={handleOpenClick}
          >
            Open This File
          </Button>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-center">
              How to Open XLSX Files Online
            </h2>
            <div className="list-decimal ml-6 mt-3 text-center text-sm text-muted-foreground">
              <p className="pb-2">1. Select or drag your XLSX, XLS, or CSV file above.</p>
              <p className="pb-2">2. We&apos;ll instantly convert and preview it in your browser.</p>
              <p className="pb-2">3. Click “Open This File” to view the content online.</p>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
