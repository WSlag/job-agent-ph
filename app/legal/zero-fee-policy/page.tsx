import React from 'react';
import { Metadata } from 'next';
import { Shield, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'No Placement Fee Policy | JobAgentPH.com',
  description: 'Know your rights about placement fees for overseas Filipino workers',
};

export default function ZeroFeePolicyPage() {
  const zeroFeeCountries = [
    { name: 'Canada', flag: '🇨🇦', note: 'All provinces' },
    { name: 'United States', flag: '🇺🇸', note: 'Including Guam' },
    { name: 'United Kingdom', flag: '🇬🇧', note: '' },
    { name: 'Austria', flag: '🇦🇹', note: '' },
    { name: 'Netherlands', flag: '🇳🇱', note: '' },
    { name: 'Ireland', flag: '🇮🇪', note: 'Republic and Northern' },
    { name: 'Qatar', flag: '🇶🇦', note: '' },
    { name: 'UAE', flag: '🇦🇪', note: 'United Arab Emirates' },
  ];

  const redFlags = [
    'Agency asks for payment before deployment',
    'Requests fees via GCash, PayMaya, or personal bank transfer',
    'Meets you outside their registered business address',
    'Pressures you to pay "express processing" fees',
    'Promises job placement in exchange for payment',
    'Requests fees for a zero-fee country job',
  ];

  const neverPayFor = [
    'Placement or processing fees (in zero-fee countries)',
    'Excessive fees (over 1 month salary where fees allowed)',
    'Fees for jobs that don\'t materialize',
    'DMW clearance or government documentation fees',
    'Medical exam fees (beyond authorized costs)',
    'Fees requested via electronic transfer to personal accounts',
    'Any fees during meetings outside the agency\'s registered office',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-12 rounded-lg shadow-lg mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">No Placement Fee Policy</h1>
          <p className="text-xl text-center text-green-100">Know Your Rights</p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">IMPORTANT NOTICE TO JOB SEEKERS</h2>
              <p className="text-gray-800 font-semibold">
                Under Philippine law and Department of Migrant Workers regulations, recruitment agencies are <span className="underline">generally PROHIBITED from charging placement fees</span> to workers.
              </p>
            </div>
          </div>
        </div>

        {/* Zero-Fee Countries */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <XCircle className="w-7 h-7 text-red-600 mr-2" />
            Zero-Fee Countries (NO fees allowed)
          </h2>
          <p className="text-gray-700 mb-6">
            Licensed agencies <strong>CANNOT charge ANY placement fees</strong> for jobs in:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zeroFeeCountries.map((country, index) => (
              <div key={index} className="flex items-center bg-green-50 p-4 rounded-lg border border-green-200">
                <span className="text-3xl mr-3">{country.flag}</span>
                <div>
                  <p className="font-semibold text-gray-900">{country.name}</p>
                  {country.note && <p className="text-sm text-gray-600">{country.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Limited-Fee Countries */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limited-Fee Countries</h2>
          <p className="text-gray-700 mb-4">
            For other countries, fees are capped at <strong>maximum one (1) month basic salary</strong> and must be:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Stated clearly in your employment contract</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Deducted from your salary in installments (not paid upfront)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Authorized by destination country law</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Approved by DMW</span>
            </li>
          </ul>
        </div>

        {/* What You Should NEVER Pay For */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <XCircle className="w-7 h-7 text-red-600 mr-2" />
            What You Should NEVER Pay For
          </h2>
          <div className="space-y-3">
            {neverPayFor.map((item, index) => (
              <div key={index} className="flex items-start bg-red-50 p-3 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-7 h-7 text-yellow-600 mr-2" />
            Red Flags - Report Immediately
          </h2>
          <div className="space-y-3">
            {redFlags.map((flag, index) => (
              <div key={index} className="flex items-start bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                <span className="text-yellow-600 mr-3 font-bold">⚠</span>
                <span className="text-gray-800">{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Know Your Rights */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle2 className="w-7 h-7 text-blue-600 mr-2" />
            Know Your Rights
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <span>You have the right to work abroad without paying illegal fees</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <span>Employers should shoulder recruitment costs (employer-pay principle)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <span>You can report violations without fear of retaliation</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <span>You can recover illegal fees paid to agencies</span>
            </li>
          </ul>
        </div>

        {/* How to Protect Yourself */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Protect Yourself</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Verify</h3>
                <p className="text-gray-700">
                  Check the agency's DMW license at{' '}
                  <a
                    href="https://dmw.gov.ph/licensed-recruitment-agencies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    dmw.gov.ph
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Ask</h3>
                <p className="text-gray-700">
                  Ask about all fees upfront and get written confirmation
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Visit</h3>
                <p className="text-gray-700">
                  Visit the agency only at their registered business address
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Read</h3>
                <p className="text-gray-700">
                  Read all contracts carefully before signing
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Keep</h3>
                <p className="text-gray-700">
                  Keep copies of all documents and receipts
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                6
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Report</h3>
                <p className="text-gray-700">
                  Report any suspicious fee requests immediately
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Illegal Fee Requests */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Report Illegal Fee Requests</h2>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">DMW Anti-Illegal Recruitment Hotline</h3>
              <p className="text-xl font-bold">+63 2 8721-0619</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-xl font-bold">email@dmw.gov.ph</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Facebook</h3>
              <p>DMW Anti-Illegal Recruitment and Trafficking in Persons Program</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">JobAgentPH.com</h3>
              <p className="text-xl font-bold">
                <a href="mailto:contact@jobagentph.com" className="hover:underline">
                  contact@jobagentph.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Remember */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-800 font-semibold mb-4">
            Remember: If it sounds too good to be true, it probably is.
          </p>
          <p className="text-gray-700">
            Protect yourself by staying informed and reporting violations.
          </p>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">
              JobAgentPH.com is committed to worker protection and ethical recruitment practices.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
