'use client';

import React, { useState } from 'react';
import { FileText, Upload, X, CheckCircle2, AlertCircle, Download, File } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { CertificationFile } from '@/types';

interface MultiCertificationUploadFieldProps {
  label: string;
  required?: boolean;
  existingFiles?: CertificationFile[]; // Already uploaded files
  newFiles?: File[]; // New files to upload
  onChange: (files: File[]) => void;
  onRemoveExisting: (file: CertificationFile) => void;
  error?: string;
  helperText?: string;
  maxFiles?: number;
  accept?: Record<string, string[]>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_MAX_FILES = 5;

const DEFAULT_ACCEPT = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

/**
 * MultiCertificationUploadField Component
 *
 * Reusable multi-file upload field for agency certifications
 * Supports: PDF, JPG, PNG files (max 5MB each, up to 5 files)
 * Shows existing uploaded files with download/remove options
 * Simple list view design
 */
export default function MultiCertificationUploadField({
  label,
  required = false,
  existingFiles = [],
  newFiles = [],
  onChange,
  onRemoveExisting,
  error,
  helperText,
  maxFiles = DEFAULT_MAX_FILES,
  accept = DEFAULT_ACCEPT,
}: MultiCertificationUploadFieldProps) {
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const totalFilesCount = existingFiles.length + newFiles.length;
  const canAddMore = totalFilesCount < maxFiles;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles: maxFiles - totalFilesCount,
    maxSize: MAX_FILE_SIZE,
    disabled: !canAddMore,
    onDrop: (acceptedFiles, rejectedFiles) => {
      const errors: string[] = [];

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach((rejected) => {
          const error = rejected.errors[0];
          if (error.code === 'file-too-large') {
            errors.push(`${rejected.file.name}: File too large (max 5MB)`);
          } else if (error.code === 'file-invalid-type') {
            errors.push(`${rejected.file.name}: Invalid file type (PDF, JPG, PNG only)`);
          } else if (error.code === 'too-many-files') {
            errors.push(`Maximum ${maxFiles} files allowed`);
          }
        });
      }

      setFileErrors(errors);

      if (acceptedFiles.length > 0) {
        const combinedFiles = [...newFiles, ...acceptedFiles];
        onChange(combinedFiles);
      }
    },
  });

  const handleRemoveNew = (index: number) => {
    const updatedFiles = newFiles.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <FileText className="w-6 h-6 text-blue-500" />;
    }
    return <File className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* Upload Zone */}
      {canAddMore && (
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
          <Upload className={`w-8 h-8 mx-auto mb-2 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600 mb-1">
            {isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-gray-500">
            PDF, JPG, or PNG (max 5MB each, {totalFilesCount}/{maxFiles} files)
          </p>
        </div>
      )}

      {!canAddMore && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Maximum {maxFiles} files reached. Remove a file to upload more.
          </p>
        </div>
      )}

      {/* Existing Files List */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600 uppercase">
            Uploaded Files ({existingFiles.length})
          </p>
          {existingFiles.map((file, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.fileName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span>{formatFileSize(file.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(file.uploadedAt)}</span>
                      <CheckCircle2 className="w-3 h-3 text-green-600 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Download file"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(file)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Files List (pending upload) */}
      {newFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600 uppercase">
            New Files ({newFiles.length}) - Will be uploaded on save
          </p>
          {newFiles.map((file, index) => (
            <div
              key={index}
              className="border border-blue-200 rounded-lg p-3 bg-blue-50"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {formatFileSize(file.size)} • Pending upload
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRemoveNew(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Files Message */}
      {existingFiles.length === 0 && newFiles.length === 0 && !error && (
        <p className="text-sm text-gray-500 text-center py-2">
          No files uploaded yet
        </p>
      )}

      {/* Error Messages */}
      {error && (
        <div className="flex items-center space-x-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {fileErrors.length > 0 && (
        <div className="space-y-1">
          {fileErrors.map((err, index) => (
            <div key={index} className="flex items-center space-x-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
