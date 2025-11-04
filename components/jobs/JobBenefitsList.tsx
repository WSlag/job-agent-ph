'use client';

import { Gift, Home, Plane, Heart, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface JobBenefitsListProps {
  benefits: string[];
}

const getBenefitIcon = (benefit: string) => {
  const lower = benefit.toLowerCase();
  if (lower.includes('accommodation') || lower.includes('housing')) return Home;
  if (lower.includes('flight') || lower.includes('ticket')) return Plane;
  if (lower.includes('medical') || lower.includes('insurance') || lower.includes('health')) return Heart;
  if (lower.includes('leave') || lower.includes('vacation')) return Calendar;
  if (lower.includes('salary') || lower.includes('tax')) return DollarSign;
  if (lower.includes('development') || lower.includes('training')) return TrendingUp;
  return Gift;
};

export default function JobBenefitsList({ benefits }: JobBenefitsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Gift className="text-purple-600" size={24} />
        Benefits
      </h2>
      <div className="grid md:grid-cols-2 gap-3">
        {benefits.map((benefit, index) => {
          const Icon = getBenefitIcon(benefit);
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Icon size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-800">{benefit}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
