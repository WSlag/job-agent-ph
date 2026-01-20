'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { ParsedCSVRow, OutreachMessageType } from '@/types';

interface CSVPreviewTableProps {
  data: ParsedCSVRow[];
  onRemoveRow: (index: number) => void;
  onClear: () => void;
  maxDisplay?: number;
}

const MESSAGE_TYPE_LABELS: Record<OutreachMessageType, string> = {
  short: 'Short',
  standard: 'Standard',
  formal: 'Formal',
};

const MESSAGE_TYPE_COLORS: Record<OutreachMessageType, string> = {
  short: 'bg-yellow-100 text-yellow-800',
  standard: 'bg-blue-100 text-blue-800',
  formal: 'bg-purple-100 text-purple-800',
};

export default function CSVPreviewTable({
  data,
  onRemoveRow,
  onClear,
  maxDisplay = 50,
}: CSVPreviewTableProps) {
  const [showAll, setShowAll] = useState(false);

  const validCount = data.filter((row) => row.isValid).length;
  const invalidCount = data.filter((row) => !row.isValid).length;

  const displayData = showAll ? data : data.slice(0, maxDisplay);
  const hasMore = data.length > maxDisplay;

  return (
    <div className="space-y-4">
      {/* Stats Header */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="font-semibold text-gray-900">{data.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">Valid:</span>
          <span className="font-semibold text-green-600">{validCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-gray-600">Invalid:</span>
          <span className="font-semibold text-red-600">{invalidCount}</span>
        </div>
        <div className="ml-auto">
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-red-600 hover:text-red-700 hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agency Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">

                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayData.map((row, index) => (
                <tr
                  key={index}
                  className={`${!row.isValid ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                    {row.recipientEmail || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {row.agencyName || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${MESSAGE_TYPE_COLORS[row.messageType]}`}
                    >
                      {MESSAGE_TYPE_LABELS[row.messageType]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.isValid ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Valid</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600" title={row.validationError}>
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs truncate max-w-[100px]">
                          {row.validationError || 'Invalid'}
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onRemoveRow(index)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show More/Less */}
        {hasMore && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-center">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show All ({data.length - maxDisplay} more)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Invalid Rows Warning */}
      {invalidCount > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> {invalidCount} row(s) have validation errors and will be skipped.
            Only {validCount} valid email(s) will be sent.
          </p>
        </div>
      )}
    </div>
  );
}
