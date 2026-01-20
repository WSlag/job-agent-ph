'use client';

import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { FileSpreadsheet, Download } from 'lucide-react';
import { parseOutreachCSV, generateSampleCSV, downloadCSV, MAX_FILE_SIZE, MAX_BATCH_SIZE } from '@/lib/csv-helpers';
import { ParsedCSVRow } from '@/types';

interface CSVUploadZoneProps {
  onFileAccepted: (data: ParsedCSVRow[], fileName: string) => void;
  onError: (error: string) => void;
  isDisabled?: boolean;
}

export default function CSVUploadZone({
  onFileAccepted,
  onError,
  isDisabled = false,
}: CSVUploadZoneProps) {
  const handleDownloadSample = (e: React.MouseEvent) => {
    e.stopPropagation();
    const csv = generateSampleCSV();
    downloadCSV(csv, 'outreach-sample.csv');
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          onError('File is too large. Maximum size is 1MB.');
        } else if (error.code === 'file-invalid-type') {
          onError('Invalid file type. Please upload a CSV file.');
        } else {
          onError(error.message);
        }
        return;
      }

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (!content) {
          onError('Failed to read file content.');
          return;
        }

        const result = parseOutreachCSV(content);

        if (result.errors.length > 0) {
          onError(result.errors.join('; '));
          return;
        }

        if (result.data.length === 0) {
          onError('CSV file is empty or has no valid data rows.');
          return;
        }

        if (result.data.length > MAX_BATCH_SIZE) {
          onError(`Too many rows. Maximum is ${MAX_BATCH_SIZE} recipients per batch. Your file has ${result.data.length} rows.`);
          return;
        }

        onFileAccepted(result.data, file.name);
      };

      reader.onerror = () => {
        onError('Failed to read file.');
      };

      reader.readAsText(file);
    },
    [onFileAccepted, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: isDisabled,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <FileSpreadsheet className={`w-12 h-12 mx-auto mb-3 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        <p className="text-base font-medium text-gray-700 mb-1">
          {isDragActive ? 'Drop the CSV file here' : 'Drag & drop your CSV file here'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse
        </p>
        <div className="flex flex-col items-center gap-2 text-xs text-gray-400">
          <p>CSV Format: recipientEmail, agencyName, messageType</p>
          <p>Max {MAX_BATCH_SIZE} recipients per batch</p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleDownloadSample}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          <Download className="w-4 h-4" />
          Download sample CSV
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <h4 className="font-medium text-gray-700 mb-2">CSV Column Format:</h4>
        <ul className="space-y-1 text-xs">
          <li><strong>recipientEmail</strong> (required) - Agency email address</li>
          <li><strong>agencyName</strong> (optional) - Agency name for personalization</li>
          <li><strong>messageType</strong> (optional) - short, standard, or formal (defaults to standard)</li>
        </ul>
      </div>
    </div>
  );
}
