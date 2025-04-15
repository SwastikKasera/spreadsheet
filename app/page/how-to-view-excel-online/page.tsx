"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Navbar } from "@/components/navbar";
import Head from "next/head";
import { Card } from "@/components/ui/card";

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
      router.push("/view");
    }
  };

  return (
    <>
      <Head>
        <title>View XLSX Online - Instant Spreadsheet Viewer</title>
        <meta
          name="description"
          content="Easily view XLSX, XLS, and CSV files online. Experience fast, secure, and browser-based spreadsheet viewing without any installations."
        />
        <meta
          name="keywords"
          content="view xlsx online, xlsx viewer, view excel online, upload xlsx file, excel reader online"
        />
      </Head>

      <Navbar />

      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <section className="w-full max-w-md space-y-6">
          <header className="text-center">
            <h1 className="text-3xl font-bold">View XLSX Online</h1>
            <p className="text-md mt-2 text-muted-foreground">
              Easily view XLSX, XLS, and CSV spreadsheet files directly in your browser. <br />
              No Excel installation required.
            </p>
          </header>

          <FileUpload onFileChange={handleFileChange} />

          <Button
            className="w-full bg-green-500 hover:bg-green-600 cursor-pointer font-bold"
            disabled={!file}
            onClick={handleOpenClick}
          >
            View This File
          </Button>
        </section>
        <Card className="p-6 mt-8">
          <section className="mt-8">
            <h2 className="text-3xl font-semibold mb-4">
              How to View XLSX Online
            </h2>
            <div className="list-decimal text-base text-muted-foreground">
              <p className="text-lg">
                1. Select or drag your XLSX, XLS, or CSV file above.
              </p>
              <p className="text-lg">
                2. We&apos;ll instantly convert and preview it in your browser.
              </p>
              <p className="text-lg">
                3. Click “View This File” to view XLSX online with ease.
              </p>
            </div>
          </section>
          <section>
            <h2 className="text-3xl font-semibold mt-8">
              Do Excel Formulas Work?
            </h2>
            <p className="text-lg mt-4 text-muted-foreground leading-relaxed">
              Yes, all Excel formulas work when you view XLSX online using our tool. Just type your formulas as needed. This app is designed to quickly load and display Excel files directly in your browser—perfect when you want to view your spreadsheets without opening a separate application.
            </p>
          </section>
          <section>
            <h2 className="text-3xl font-semibold mt-8">
              Why Choose Our Online XLSX Viewer?
            </h2>
            <p className="text-lg mt-4 text-muted-foreground leading-relaxed">
              Viewing XLSX online with our tool gives you instant access to your spreadsheet data without downloading or installing any software. Whether you are on a phone, tablet, or desktop, our browser-based viewer is the quickest way to view your Excel files.
            </p>
          </section>
          <section>
            <h2 className="text-3xl font-semibold mt-8">
              Supported File Types & Upload Limits
            </h2>
            <ul className="list-disc ml-6 mt-4 text-base text-muted-foreground space-y-2">
              <li>XLSX (Microsoft Excel Open XML Spreadsheet)</li>
              <li>XLS (Excel 97-2003 Workbook)</li>
              <li>CSV (Comma-Separated Values)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-3xl font-semibold mt-8">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 text-base space-y-6">
              <div>
                <strong className="text-xl text-muted-foreground">
                  Can I use this on mobile?
                </strong>
                <p className="text-lg">
                  Absolutely! You can view XLSX online on phones, tablets, and desktops without any issues.
                </p>
              </div>
              <div>
                <strong className="text-xl text-muted-foreground">
                  Do I need to sign up?
                </strong>
                <p className="text-lg">
                  No signup or login is required. Just upload your file and start viewing XLSX online for free.
                </p>
              </div>
              <div>
                <strong className="text-xl text-muted-foreground">
                  Can I edit the Excel file?
                </strong>
                <p className="text-lg">
                  Yes, you can edit, apply formulas, and export in various formats after you view XLSX online.
                </p>
              </div>
            </div>
          </section>
        </Card>
      </main>
    </>
  );
}
