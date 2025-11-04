'use client';

import { useState } from 'react';
import { Star, X, CheckCircle, XCircle } from 'lucide-react';
import { JobMatch } from '@/types';
import { getMatchColor } from '@/lib/placeholder-data';

interface JobMatchBadgeProps {
  match: JobMatch;
}

export default function JobMatchBadge({ match }: JobMatchBadgeProps) {
  const [showModal, setShowModal] = useState(false);
  const colors = getMatchColor(match.percentage);

  return (
    <>
      {/* Match Badge */}
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${colors.bg} ${colors.text} ${colors.border} hover:opacity-80 transition-opacity`}
      >
        <Star size={20} className="fill-current" />
        <span className="font-semibold">{match.percentage}% Match for you</span>
      </button>

      {/* Match Breakdown Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Job Match Breakdown</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {match.percentage}% match based on your skills
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Matching Skills */}
              {match.matchingSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="text-green-600" size={24} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Matching Skills ({match.matchingSkills.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {match.matchingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {match.missingSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="text-orange-600" size={24} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Skills to Develop ({match.missingSkills.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {match.missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium border border-orange-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Consider adding these skills to improve your match percentage
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
