'use client';

import React, { useState, useEffect } from 'react';
import { X, Calculator, DollarSign, Info, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/ui';

interface CostCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  country: string;
  salary: { min?: number; max?: number; currency: string };
}

interface CostBreakdown {
  category: string;
  items: { name: string; cost: number; isOptional?: boolean }[];
}

/**
 * CostCalculatorModal Component
 *
 * Calculates deployment costs including processing, visa, medical, etc.
 * Shows detailed breakdown and payment timeline
 * Helps job seekers understand financial requirements
 */
export default function CostCalculatorModal({
  isOpen,
  onClose,
  jobTitle,
  country,
  salary,
}: CostCalculatorModalProps) {
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  // Helper to format number consistently (avoid locale-based hydration mismatch)
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Cost breakdown by category
  const costBreakdown: CostBreakdown[] = [
    {
      category: 'Agency Processing Fees',
      items: [
        { name: 'Document Processing', cost: 3000 },
        { name: 'Job Order Processing', cost: 2500 },
        { name: 'POEA Processing', cost: 1500 },
      ],
    },
    {
      category: 'Medical & Health',
      items: [
        { name: 'Medical Examination', cost: 2500 },
        { name: 'Laboratory Tests', cost: 1500 },
        { name: 'Chest X-Ray', cost: 500 },
        { name: 'Vaccinations', cost: 1000, isOptional: true },
      ],
    },
    {
      category: 'Government Requirements',
      items: [
        { name: 'Passport (if new)', cost: 1200, isOptional: true },
        { name: 'NBI Clearance', cost: 155 },
        { name: 'Police Clearance', cost: 150 },
        { name: 'OWWA Membership', cost: 1600 },
      ],
    },
    {
      category: 'Training & Seminars',
      items: [
        { name: 'PDOS (Pre-Departure Orientation)', cost: 500 },
        { name: 'Skills Training', cost: 3000, isOptional: true },
      ],
    },
    {
      category: 'Visa & Travel',
      items: [
        { name: 'Visa Application Fee', cost: 5000 },
        { name: 'Visa Stamping', cost: 2000 },
        { name: 'Airport Tax', cost: 850 },
        { name: 'Baggage Allowance', cost: 2000, isOptional: true },
      ],
    },
  ];

  // Calculate total cost
  useEffect(() => {
    let total = 0;
    costBreakdown.forEach((category) => {
      category.items.forEach((item) => {
        if (!item.isOptional || selectedOptionals.includes(item.name)) {
          total += item.cost;
        }
      });
    });
    setTotalCost(total);
  }, [selectedOptionals]);

  const toggleOptional = (itemName: string) => {
    setSelectedOptionals((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  // Calculate months to break even based on salary
  const monthsToBreakEven = salary.min
    ? Math.ceil(totalCost / salary.min)
    : 0;

  const handleDownloadBreakdown = () => {
    // In production, this would generate a PDF
    alert('Cost breakdown would be downloaded as PDF');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-success-600 to-success-700 text-white px-6 py-5 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calculator className="w-7 h-7" />
                Cost Calculator
              </h2>
              <p className="text-sm text-success-100 mt-1">
                {jobTitle} • {country}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Total Cost Summary */}
            <div className="bg-gradient-to-br from-success-50 to-success-100 border-2 border-success-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-success-700 mb-1">
                    Estimated Total Cost
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    ₱{formatNumber(totalCost)}
                  </p>
                </div>
                <div className="text-right">
                  {salary.min && (
                    <>
                      <p className="text-sm font-medium text-success-700 mb-1">
                        Break-even Period
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {monthsToBreakEven} months
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Progress bar showing cost vs first month salary */}
              {salary.min && (
                <div>
                  <p className="text-xs text-success-700 mb-2">
                    Cost as % of first month salary
                  </p>
                  <ProgressBar
                    value={Math.min((totalCost / salary.min) * 100, 100)}
                    variant="success"
                    size="md"
                    showPercentage
                  />
                </div>
              )}
            </div>

            {/* Info Notice */}
            <div className="bg-info-50 border border-info-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-info-700">
                  <p className="font-semibold mb-1">Important Notes:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Costs may vary depending on your location and requirements</li>
                    <li>Some fees may be shouldered by the employer</li>
                    <li>No placement fee should be charged by licensed agencies</li>
                    <li>Keep all official receipts for your records</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cost Breakdown by Category */}
            <div className="space-y-4">
              {costBreakdown.map((category, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-5"
                >
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-success-600" />
                    {category.category}
                  </h3>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {item.isOptional && (
                            <input
                              type="checkbox"
                              checked={selectedOptionals.includes(item.name)}
                              onChange={() => toggleOptional(item.name)}
                              className="w-5 h-5 text-primary-600 rounded"
                            />
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {item.name}
                            </span>
                            {item.isOptional && (
                              <span className="ml-2 text-xs text-gray-500">
                                (Optional)
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">
                          ₱{formatNumber(item.cost)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Subtotal
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₱
                      {formatNumber(
                        category.items
                          .filter(
                            (item) =>
                              !item.isOptional ||
                              selectedOptionals.includes(item.name)
                          )
                          .reduce((sum, item) => sum + item.cost, 0)
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Timeline */}
            <div className="bg-warning-50 border-2 border-warning-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">
                Typical Payment Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-warning-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Initial Payment (30-40%)
                    </p>
                    <p className="text-sm text-gray-600">
                      Upon job order approval and document processing start
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-warning-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Medical & Requirements (30-40%)
                    </p>
                    <p className="text-sm text-gray-600">
                      During medical examination and document submission
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-warning-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Final Payment (20-30%)
                    </p>
                    <p className="text-sm text-gray-600">
                      Before departure or upon visa approval
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Estimated Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ₱{formatNumber(totalCost)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadBreakdown}
                className="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
