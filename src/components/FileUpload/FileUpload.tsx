import React, { useCallback, useState } from 'react'
import { readFileAsText, generateFileId, detectLanguage } from '../../utils/fileUpload'

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFileData[]) => void
  className?: string
}

export interface UploadedFileData {
  id: string
  name: string
  content: string
  language: string
  timestamp: Date
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const processFiles = useCallback(
    async (fileList: FileList) => {
      setIsProcessing(true)
      setErrorMessage(null)
      const skipped: string[] = []
      const uploadedFiles: UploadedFileData[] = []

      try {
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i]

          // Only accept text files
          if (!file.type.startsWith('text/') && !isCodeFile(file.name)) {
            skipped.push(file.name)
            continue
          }

          const content = await readFileAsText(file)
          uploadedFiles.push({
            id: generateFileId(file.name),
            name: file.name,
            content,
            language: detectLanguage(file.name),
            timestamp: new Date(),
          })
        }

        if (uploadedFiles.length > 0) {
          onFilesUploaded(uploadedFiles)
        }
        if (skipped.length > 0) {
          setErrorMessage(`Skipped unsupported files: ${skipped.join(', ')}`)
        }
      } catch (error) {
        console.error('Error processing files:', error)
        setErrorMessage('Error processing files. Please try again.')
      } finally {
        setIsProcessing(false)
      }
    },
    [onFilesUploaded]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
  }

  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".ts,.tsx,.js,.jsx,.py,.java,.cpp,.c,.cs,.go,.rb,.php,.swift,.kt,.rs,.txt,.md"
          aria-label="Upload code files"
        />

        <div className="pointer-events-none">
          {isProcessing ? (
            <>
              <div className="text-5xl mb-4 animate-pulse">⏳</div>
              <p className="text-lg font-semibold text-gray-900">Processing files...</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">📁</div>
              <p className="text-lg font-semibold text-gray-900 mb-2">Upload Your Code Files</p>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded">TypeScript</span>
                <span className="px-2 py-1 bg-gray-100 rounded">JavaScript</span>
                <span className="px-2 py-1 bg-gray-100 rounded">Python</span>
                <span className="px-2 py-1 bg-gray-100 rounded">Java</span>
                <span className="px-2 py-1 bg-gray-100 rounded">C/C++</span>
                <span className="px-2 py-1 bg-gray-100 rounded">Go</span>
                <span className="px-2 py-1 bg-gray-100 rounded">And more...</span>
              </div>
            </>
          )}
        </div>
      </div>
      {errorMessage && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

const isCodeFile = (fileName: string): boolean => {
  const codeExtensions = [
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.py',
    '.java',
    '.cpp',
    '.c',
    '.cs',
    '.go',
    '.rb',
    '.php',
    '.swift',
    '.kt',
    '.rs',
    '.txt',
    '.md',
  ]
  return codeExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
}
