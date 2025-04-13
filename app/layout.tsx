import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import GoogleAnalytics from "@/components/google-analytics";

export const metadata: Metadata = {
  title: "Open XLSX File Online For Free - Instant Spreadsheet Viewer",
  description: "Easily open, edit and view your XLSX, XLS, and CSV files online for free with our simple file uploader. No installation required.",
  keywords: ["open xlsx file online", "excel sheet online open", "excel file online open", "xlsx online opener", "xlsx file online viewer", "xlsx file online viewer free", "xlxs file viewer online free"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics/>
      <body>
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
