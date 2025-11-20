'use client';

import React from 'react';
import { FileText, Upload, X, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface CertificationUploadFieldProps {
  label: string;
  required?: boolean;
  value?: string; // Existing file URL
  file?: File; // New file to upload
  onChange: (file: File | null) => void;
  error?: string;
  accept?: Record<string, string[]>;
  helperText?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const DEFAULT_ACCEPT = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

/**
 * CertificationUploadField Component
 *
 * Reusable file upload field for agency certifications
 * Supports: PDF, JPG, PNG files (max 5MB)
 * Shows existing uploaded files with download option
 */
export default function CertificationUploadField({
  label,
  required = false,
  value,
  file,
  onChange,
  error,
  accept = DEFAULT_ACCEPT,
  helperText,
}: CertificationUploadFieldProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          // Error will be handled by parent component
          return;
        } else if (error.code === 'file-invalid-type') {
          return;
        }
      }

      if (acceptedFiles.length > 0) {
        onChange(acceptedFiles[0]);
      }
    },
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileName = (): string => {
    if (file) return file.name;
    if (value) {
      const parts = value.split('/');
      return parts[parts.length - 1] || 'Uploaded file';
    }
    return '';
  };

  const hasFile = file || value;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {!hasFile ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className={`w-10 h-10 mx-auto mb-2 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600 mb-1">
            {isDragActive ? 'Drop the file here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-gray-500">
            PDF, JPG, or PNG (max 5MB)
          </p>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getFileName()}
                </p>
                {file && (
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                )}
                {value && !file && (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Uploaded
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {value && !file && (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                </a>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
