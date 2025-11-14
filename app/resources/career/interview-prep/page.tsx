'use client';

import Link from 'next/link';
import { ArrowLeft, Video, CheckCircle, AlertTriangle, MessageCircle, Users, Clock, Star } from 'lucide-react';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';

export default function InterviewPrepPage() {
  const commonQuestions = [
    {
      question: 'Tell me about yourself',
      tip: 'Give 2-minute summary: education, work experience, key skills, why you want this job. Don\'t tell life story.',
      example: '"I\'m a registered nurse with 5 years ICU experience in Manila. I specialize in critical care and patient monitoring. I\'m seeking this position because I want to work in a world-class facility and develop my skills further."',
    },
    {
      question: 'Why do you want to work abroad?',
      tip: 'Focus on professional growth, career opportunities, better compensation. Avoid saying only "money".',
      example: '"I want to gain international experience, work in advanced healthcare facilities, and provide better future for my family. This position aligns with my career goals."',
    },
    {
      question: 'Why should we hire you?',
      tip: 'Match your skills to job requirements. Give specific examples of achievements.',
      example: '"I have the exact qualifications you need: 5 years ICU experience, ACLS certified, and proven track record of handling 15+ patients daily. I consistently exceed performance targets."',
    },
    {
      question: 'What are your strengths?',
      tip: 'Choose 2-3 relevant strengths with examples. Don\'t be too humble.',
      example: '"My strengths are attention to detail and ability to work under pressure. In my previous role, I caught critical medication errors and handled emergency situations calmly."',
    },
    {
      question: 'What are your weaknesses?',
      tip: 'Choose real but minor weakness. Show how you\'re improving it. Never say "I have no weaknesses".',
      example: '"I sometimes focus too much on details and perfectionism. I\'m working on balancing quality with efficiency by setting time limits for tasks."',
    },
    {
      question: 'Where do you see yourself in 5 years?',
      tip: 'Show ambition but realistic goals related to the job. Don\'t say "in your position".',
      example: '"I see myself as a senior nurse in critical care, possibly mentoring junior staff. I want to continuously develop my expertise in this specialty."',
    },
    {
      question: 'How do you handle stress/pressure?',
      tip: 'Give specific example of stressful situation and how you handled it successfully.',
      example: '"I stay calm and prioritize tasks. During a code blue situation with multiple critical patients, I delegated tasks, communicated clearly, and all patients stabilized successfully."',
    },
    {
      question: 'Why did you leave your previous job?',
      tip: 'Stay positive. Never badmouth previous employer. Focus on growth opportunities.',
      example: '"I\'m seeking new challenges and opportunities to develop my skills in a larger, more advanced facility. I completed my contract successfully and received excellent recommendations."',
    },
    {
      question: 'Do you have any questions for us?',
      tip: 'ALWAYS ask questions. Shows interest. Ask about training, team structure, growth opportunities.',
      example: '"What training programs do you offer? What does a typical day look like? What are the opportunities for professional development?"',
    },
  ];

  const positionSpecificQuestions = {
    'Nurses & Healthcare': [
      'Describe a difficult patient situation and how you handled it',
      'How do you prioritize multiple patients with different needs?',
      'What would you do if you noticed a doctor\'s order that seems incorrect?',
      'How do you handle family members who are upset or difficult?',
    ],
    'Domestic Workers': [
      'Have you cared for children/elderly before? Describe your experience',
      'How do you handle homesickness?',
      'Can you cook? What dishes are you familiar with?',
      'Are you comfortable working long hours and on weekends?',
    ],
    'Engineers/IT': [
      'Describe a complex project you worked on and your role',
      'How do you stay updated with industry trends and technologies?',
      'Tell me about a time you solved a difficult technical problem',
      'Have you worked in international/multicultural teams before?',
    ],
    'Hospitality/Service': [
      'How do you handle angry or unsatisfied customers?',
      'Describe your experience working in fast-paced environments',
      'Can you work flexible hours including nights and weekends?',
      'How would you promote additional services to customers?',
    ],
  };

  const videoInterviewTips = [
    {
      title: 'Test Technology Beforehand',
      tips: [
        'Test camera, microphone, and internet connection 30 minutes before',
        'Download and familiarize yourself with the platform (Zoom, Skype, Teams)',
        'Have backup plan (phone number, alternative device)',
        'Close all other applications to prevent notifications',
      ],
    },
    {
      title: 'Create Professional Environment',
      tips: [
        'Choose quiet location with no interruptions',
        'Clean, neutral background (plain wall is best)',
        'Good lighting - face should be clearly visible (window/lamp in front)',
        'Camera at eye level (use books to elevate laptop if needed)',
      ],
    },
    {
      title: 'Dress Professionally',
      tips: [
        'Dress as if it\'s in-person interview (full professional attire)',
        'Avoid bright colors or busy patterns',
        'Test outfit on camera beforehand',
        'Look presentable even if interviewer can\'t see below waist',
      ],
    },
    {
      title: 'During the Interview',
      tips: [
        'Look at camera when speaking, not at screen (simulates eye contact)',
        'Speak clearly and slightly slower than normal',
        'Minimize hand gestures (can look exaggerated on camera)',
        'If connection freezes, stay calm and reconnect immediately',
      ],
    },
  ];

  const bodyLanguageTips = [
    { do: 'Smile and maintain friendly expression', dont: 'Look too serious or unfriendly' },
    { do: 'Sit up straight with good posture', dont: 'Slouch or lean back' },
    { do: 'Make eye contact (look at camera)', dont: 'Avoid eye contact or stare blankly' },
    { do: 'Use natural hand gestures when explaining', dont: 'Excessive or distracting movements' },
    { do: 'Nod to show engagement and understanding', dont: 'Sit completely still like a statue' },
    { do: 'Keep hands visible on desk/lap', dont: 'Hide hands or fidget constantly' },
  ];

  const beforeInterviewChecklist = [
    'Research the company (services, values, recent news)',
    'Review the job description and match your skills',
    'Prepare answers to common interview questions',
    'Prepare 3-5 questions to ask the interviewer',
    'Test technology (for video interviews)',
    'Choose and lay out professional outfit',
    'Print extra copies of resume and certificates',
    'Plan route and timing (arrive 10-15 minutes early)',
    'Prepare list of references with contact details',
    'Get good night sleep and eat before interview',
  ];

  const culturalTips = [
    {
      region: 'Middle East (Saudi Arabia, UAE, Qatar)',
      tips: [
        'Conservative dress - women should cover arms and legs',
        'Respect Islamic customs - avoid mentioning alcohol, pork',
        'Handshakes may be gentle, don\'t be too aggressive',
        'Address interviewers formally (Mr., Mrs., Dr.)',
        'Punctuality is important but flexibility expected',
      ],
    },
    {
      region: 'East Asia (Japan, Korea, Singapore)',
      tips: [
        'Bow slightly when greeting (especially Japan)',
        'Exchange business cards with both hands',
        'Be humble - don\'t boast excessively',
        'Punctuality is VERY important - arrive early',
        'Silence is okay - don\'t rush to fill pauses',
      ],
    },
    {
      region: 'Western Countries (USA, Canada, UK)',
      tips: [
        'Firm handshake expected',
        'Direct communication style appreciated',
        'Highlight individual achievements confidently',
        'Ask questions - shows interest and initiative',
        'Casual but professional atmosphere',
      ],
    },
  ];

  const redFlags = [
    'Interviewer asks for money or "processing fees"',
    'Interviewer is unprofessional or makes inappropriate comments',
    'Job details differ significantly from advertisement',
    'Interviewer pressures immediate decision',
    'Company has no online presence or reviews',
    'Interview location is strange (hotel room, residence)',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/resources" className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-5xl font-bold mb-6">Interview Preparation Guide</h1>
          <p className="text-xl text-indigo-100">
            Common interview questions, tips, and how to prepare for video interviews
          </p>
        </div>
      </Section>

      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              The interview is your opportunity to showcase your skills, personality, and fit for the role. Whether
              it's face-to-face, phone, or video interview, preparation is key to success. This guide covers everything
              you need to ace your OFW interview.
            </p>
          </div>

          {/* Common Questions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <MessageCircle className="text-indigo-600" size={32} />
              Common Interview Questions & How to Answer
            </h2>
            <div className="space-y-4">
              {commonQuestions.map((item, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">"{item.question}"</h3>
                  <div className="bg-indigo-50 p-4 rounded-lg mb-3">
                    <p className="text-sm font-medium text-indigo-900 mb-1">How to Answer:</p>
                    <p className="text-sm text-gray-700">{item.tip}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-900 mb-1">Example Answer:</p>
                    <p className="text-sm text-gray-700 italic">{item.example}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Position-Specific Questions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Position-Specific Questions</h2>
            <div className="space-y-4">
              {Object.entries(positionSpecificQuestions).map(([position, questions]) => (
                <Card key={position} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{position}</h3>
                  <ul className="space-y-2">
                    {questions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{q}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-600 mt-4 bg-yellow-50 p-3 rounded">
                    <strong>Tip:</strong> Prepare specific examples from your experience that demonstrate your skills
                    for these questions.
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Video Interview Tips */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Video className="text-indigo-600" size={32} />
              Video Interview Preparation
            </h2>
            <Card className="p-6 mb-4 bg-blue-50 border-blue-200">
              <p className="text-gray-700">
                Most international employers conduct initial interviews via video call (Zoom, Skype, Microsoft Teams).
                Technical preparation is just as important as content preparation.
              </p>
            </Card>
            <div className="grid md:grid-cols-2 gap-6">
              {videoInterviewTips.map((section, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Body Language */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Body Language & Presentation</h2>
            <Card className="p-6">
              <p className="text-gray-700 mb-4">
                55% of communication is non-verbal. Your body language can make or break your interview.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-green-100">
                        DO ✓
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-red-100">
                        DON'T ✗
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bodyLanguageTips.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-700 bg-green-50">{item.do}</td>
                        <td className="py-3 px-4 text-gray-700 bg-red-50">{item.dont}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Cultural Considerations */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="text-indigo-600" size={32} />
              Cultural Considerations by Region
            </h2>
            <div className="space-y-4">
              {culturalTips.map((region, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{region.region}</h3>
                  <ul className="space-y-2">
                    {region.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start gap-2">
                        <Star className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Before Interview Checklist */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Clock className="text-indigo-600" size={32} />
              Pre-Interview Checklist
            </h2>
            <Card className="p-6 bg-purple-50 border-purple-200">
              <p className="text-gray-700 mb-4 font-medium">
                Complete this checklist 24 hours before your interview:
              </p>
              <div className="space-y-2">
                {beforeInterviewChecklist.map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-3 cursor-pointer hover:bg-purple-100 p-2 rounded transition-colors"
                  >
                    <input type="checkbox" className="mt-1" />
                    <span className="text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* Red Flags */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={32} />
              Interview Red Flags
            </h2>
            <Card className="p-6 bg-red-50 border-red-200">
              <p className="text-gray-800 mb-4 font-medium">
                End the interview and report to DMW if you encounter any of these red flags:
              </p>
              <ul className="space-y-2">
                {redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{flag}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* After Interview */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">After the Interview</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Send Thank You Email</p>
                  <p className="text-sm text-gray-700">
                    Within 24 hours, send brief thank you email expressing appreciation and reiterating interest.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Follow Up Timeline</p>
                  <p className="text-sm text-gray-700">
                    If no response in 1-2 weeks, send polite follow-up email asking about timeline.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Reflect & Improve</p>
                  <p className="text-sm text-gray-700">
                    Write down questions you struggled with and prepare better answers for next time.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA Section */}
          <Card className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Apply?</h2>
            <p className="text-gray-700 mb-6">
              Browse jobs and put your interview skills to practice
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Browse Jobs
              </Link>
              <Link href="/resources/career/resume-tips" className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Resume Writing Tips
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
