'use client';

interface UsageMeterProps {
  current: number;
  limit: number;
  label?: string;
  showPercentage?: boolean;
}

export default function UsageMeter({
  current,
  limit,
  label = 'Usage',
  showPercentage = false,
}: UsageMeterProps) {
  // Calculate percentage (handle unlimited case)
  const percentage = limit === -1 ? 0 : Math.min((current / limit) * 100, 100);

  // Determine color based on usage
  const getColor = () => {
    if (limit === -1) return 'bg-green-500'; // Unlimited
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getBgColor = () => {
    if (limit === -1) return 'bg-green-100';
    if (percentage >= 100) return 'bg-red-100';
    if (percentage >= 80) return 'bg-yellow-100';
    return 'bg-blue-100';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {current} / {limit === -1 ? '∞' : limit}
          {showPercentage && limit !== -1 && (
            <span className="text-gray-500 ml-1">({percentage.toFixed(0)}%)</span>
          )}
        </span>
      </div>
      <div className={`w-full h-3 rounded-full overflow-hidden ${getBgColor()}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: limit === -1 ? '100%' : `${percentage}%` }}
        />
      </div>
      {limit !== -1 && current >= limit && (
        <p className="text-xs text-red-600 mt-1 font-medium">Limit reached</p>
      )}
      {limit !== -1 && current >= limit * 0.8 && current < limit && (
        <p className="text-xs text-yellow-600 mt-1">Approaching limit</p>
      )}
    </div>
  );
}
