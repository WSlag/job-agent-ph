'use client';

import React, { useState } from 'react';
import { FileText, Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface DocumentUploadData {
  resume?: File;
  certificates?: File[];
  validId?: File;
}

interface DocumentUploadStepProps {
  data?: DocumentUploadData;
  onNext: () => void;
  onUpdate: (data: DocumentUploadData) => void;
  isSubmitting?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const RESUME_ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const CERTIFICATE_ACCEPT = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

const ID_ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
};

/**
 * DocumentUploadStep Component
 *
 * Step 5 of Profile Setup Wizard (100% complete)
 * Collects: Resume, Certificates, Valid ID
 * All fields are optional but encouraged
 */
export default function DocumentUploadStep({
  data,
  onNext,
  onUpdate,
  isSubmitting = false,
}: DocumentUploadStepProps) {
  const [formData, setFormData] = useState<DocumentUploadData>(
    data || {
      resume: undefined,
      certificates: [],
      validId: undefined,
    }
  );

  const [uploadErrors, setUploadErrors] = useState<{
    resume?: string;
    certificates?: string;
    validId?: string;
  }>({});

  const handleChange = (field: keyof DocumentUploadData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  // Resume dropzone
  const resumeDropzone = useDropzone({
    accept: RESUME_ACCEPT,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          setUploadErrors({ ...uploadErrors, resume: 'File size exceeds 5MB' });
        } else if (error.code === 'file-invalid-type') {
          setUploadErrors({ ...uploadErrors, resume: 'Only PDF and DOC files are accepted' });
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        handleChange('resume', acceptedFiles[0]);
        setUploadErrors({ ...uploadErrors, resume: undefined });
      }
    },
  });

  // Certificates dropzone
  const certificatesDropzone = useDropzone({
    accept: CERTIFICATE_ACCEPT,
    maxFiles: 5,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          setUploadErrors({ ...uploadErrors, certificates: 'File size exceeds 5MB' });
        } else if (error.code === 'file-invalid-type') {
          setUploadErrors({ ...uploadErrors, certificates: 'Only PDF, JPG, and PNG files are accepted' });
        } else if (error.code === 'too-many-files') {
          setUploadErrors({ ...uploadErrors, certificates: 'Maximum 5 files allowed' });
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const currentCertificates = formData.certificates || [];
        const newCertificates = [...currentCertificates, ...acceptedFiles].slice(0, 5);
        handleChange('certificates', newCertificates);
        setUploadErrors({ ...uploadErrors, certificates: undefined });
      }
    },
  });

  // Valid ID dropzone
  const validIdDropzone = useDropzone({
    accept: ID_ACCEPT,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          setUploadErrors({ ...uploadErrors, validId: 'File size exceeds 5MB' });
        } else if (error.code === 'file-invalid-type') {
          setUploadErrors({ ...uploadErrors, validId: 'Only JPG, PNG, and PDF files are accepted' });
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        handleChange('validId', acceptedFiles[0]);
        setUploadErrors({ ...uploadErrors, validId: undefined });
      }
    },
  });

  const removeResume = () => {
    handleChange('resume', undefined);
    setUploadErrors({ ...uploadErrors, resume: undefined });
  };

  const removeCertificate = (index: number) => {
    const certificates = formData.certificates || [];
    const updated = certificates.filter((_, i) => i !== index);
    handleChange('certificates', updated);
  };

  const removeValidId = () => {
    handleChange('validId', undefined);
    setUploadErrors({ ...uploadErrors, validId: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Documents
        </h2>
        <p className="text-gray-600">
          Optional, but helps agencies trust you more
        </p>
      </div>

      {/* Resume/CV Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume / CV <span className="text-gray-400">(Optional)</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          PDF or DOC, max 5MB
        </p>

        {!formData.resume ? (
          <div
            {...resumeDropzone.getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
              ${
                resumeDropzone.isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }
              ${uploadErrors.resume ? 'border-error-500 bg-error-50' : ''}
            `}
          >
            <input {...resumeDropzone.getInputProps()} />
            <Upload size={32} className="mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {resumeDropzone.isDragActive
                ? 'Drop your resume here'
                : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 5MB)</p>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 flex items-center gap-3">
            <div className="flex-shrink-0">
              <CheckCircle2 size={24} className="text-success-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {formData.resume.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(formData.resume.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={removeResume}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-error-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {uploadErrors.resume && (
          <div className="mt-2 flex items-center gap-2 text-sm text-error-600">
            <AlertCircle size={16} />
            <span>{uploadErrors.resume}</span>
          </div>
        )}
      </div>

      {/* Certificates Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certificates <span className="text-gray-400">(Optional)</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Training certificates, licenses, etc. (Max 5 files, 5MB each)
        </p>

        {/* Upload zone */}
        <div
          {...certificatesDropzone.getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all mb-3
            ${
              certificatesDropzone.isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }
            ${uploadErrors.certificates ? 'border-error-500 bg-error-50' : ''}
          `}
        >
          <input {...certificatesDropzone.getInputProps()} />
          <FileText size={28} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {certificatesDropzone.isDragActive
              ? 'Drop certificates here'
              : 'Click to upload certificates'}
          </p>
          <p className="text-xs text-gray-500">PDF, JPG, PNG (max 5MB each)</p>
        </div>

        {uploadErrors.certificates && (
          <div className="mb-3 flex items-center gap-2 text-sm text-error-600">
            <AlertCircle size={16} />
            <span>{uploadErrors.certificates}</span>
          </div>
        )}

        {/* Uploaded certificates list */}
        {formData.certificates && formData.certificates.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600">
              {formData.certificates.length}/5 files uploaded
            </p>
            {formData.certificates.map((file, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-3 flex items-center gap-3"
              >
                <div className="flex-shrink-0">
                  <FileText size={20} className="text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeCertificate(index)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-error-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Valid ID Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valid ID <span className="text-gray-400">(Optional)</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Government-issued ID (Passport, Driver's License, etc.)
        </p>

        {!formData.validId ? (
          <div
            {...validIdDropzone.getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
              ${
                validIdDropzone.isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }
              ${uploadErrors.validId ? 'border-error-500 bg-error-50' : ''}
            `}
          >
            <input {...validIdDropzone.getInputProps()} />
            <Upload size={32} className="mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {validIdDropzone.isDragActive
                ? 'Drop your ID here'
                : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">JPG, PNG, PDF (max 5MB)</p>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 flex items-center gap-3">
            <div className="flex-shrink-0">
              <CheckCircle2 size={24} className="text-success-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {formData.validId.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(formData.validId.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={removeValidId}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-error-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {uploadErrors.validId && (
          <div className="mt-2 flex items-center gap-2 text-sm text-error-600">
            <AlertCircle size={16} />
            <span>{uploadErrors.validId}</span>
          </div>
        )}
      </div>

      {/* Skip option info */}
      <div className="bg-info-50 border border-info-200 rounded-lg p-4">
        <p className="text-sm text-info-800 font-medium mb-1">
          💡 Why upload documents?
        </p>
        <ul className="text-sm text-info-700 space-y-1">
          <li>• Get 3x more interview invitations</li>
          <li>• Stand out from other applicants</li>
          <li>• Build trust with agencies faster</li>
          <li>• You can always add these later in your profile</li>
        </ul>
      </div>

      {/* Info message */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600 text-center">
          All documents are optional. You can skip this step and add them later from your
          profile settings.
        </p>
      </div>
    </form>
  );
}
