import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function FileUpload({ onFileSelect, disabled = false }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="text-gray-600">
        {isDragActive ? (
          <p>Drop the PDF file here...</p>
        ) : (
          <>
            <p className="mb-2">Drag & drop your resume PDF here</p>
            <p className="text-sm text-gray-400">or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">Max file size: 5MB</p>
          </>
        )}
      </div>
    </div>
  )
}
