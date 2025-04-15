"use client"

import * as React from "react"
import { useState } from "react"
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileChange?: (file: File | null) => void
  className?: string
}

export function FileUpload({ onFileChange, className, ...props }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const allowedTypes = [
    "application/vnd.ms-excel", // xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
    "text/csv", // csv
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (selectedFile: File | null) => {
    setError(null)

    if (!selectedFile) {
      setFile(null)
      if (onFileChange) onFileChange(null)
      return
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please upload only XLS, XLSX, or CSV files.")
      setFile(null)
      if (onFileChange) onFileChange(null)
      return
    }

    setFile(selectedFile)
    if (onFileChange) onFileChange(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0] || null
    validateAndSetFile(droppedFile)
  }

  const removeFile = () => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ""
    if (onFileChange) onFileChange(null)
  }

  const openFileDialog = () => {
    inputRef.current?.click()
  }

  return (
    <div className={cn("w-full max-w-md", className)}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept=".xls,.xlsx,.csv"
        className="hidden"
        {...props}
      />

      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragging ? "border-primary bg-muted/30" : "border-muted-foreground/25",
          file ? "bg-muted/10" : "",
        )}
      >
        <CardContent
          className="flex flex-col items-center justify-center gap-4 p-6 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!file ? openFileDialog : undefined}
        >
          {!file ? (
            <>
              <div className="rounded-full bg-muted p-4">
                <UploadCloudIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  <span className="text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">XLS, XLSX, or CSV </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  openFileDialog()
                }}
              >
                Select File
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <div className="rounded-md bg-muted p-2 mr-2">
                <FileIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
