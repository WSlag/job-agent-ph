'use client';

import { CheckCircle } from 'lucide-react';

interface JobRequirementsListProps {
  requirements: string[];
  matchingRequirements?: string[];
}

export default function JobRequirementsList({
  requirements,
  matchingRequirements = [],
}: JobRequirementsListProps) {
  const isMatching = (requirement: string) => {
    return matchingRequirements.some(mr =>
      requirement.toLowerCase().includes(mr.toLowerCase()) ||
      mr.toLowerCase().includes(requirement.toLowerCase())
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CheckCircle className="text-green-600" size={24} />
        Requirements
      </h2>
      <ul className="space-y-3">
        {requirements.map((requirement, index) => {
          const matches = isMatching(requirement);
          return (
            <li
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                matches ? 'bg-green-50 border-l-4 border-green-500' : 'bg-gray-50'
              }`}
            >
              <CheckCircle
                size={20}
                className={`mt-0.5 flex-shrink-0 ${
                  matches ? 'text-green-600' : 'text-gray-400'
                }`}
              />
              <span className={`${matches ? 'font-medium text-green-900' : 'text-gray-700'}`}>
                {requirement}
              </span>
            </li>
          );
        })}
      </ul>
      {matchingRequirements.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            ✓ You meet {matchingRequirements.length} of {requirements.length} requirements
          </p>
        </div>
      )}
    </div>
  );
}
