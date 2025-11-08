export const JOB_FORM_HINTS = {
  title: 'Include seniority level (e.g., "Senior", "Junior") and be specific about the role',
  description: 'Include key responsibilities, required qualifications, benefits, and growth opportunities. Detailed descriptions attract more quality applications.',
  tagline: 'A short, catchy summary that appears on job cards. Leave empty to use the first sentence of your description.',
  companyName: 'Your registered company name from your profile',
  location: 'Specify the city or area (e.g., "Makati City", "NCR", "Remote")',
  country: 'Select the country where the job is based',
  employmentType: 'Full-time: 40+ hours/week | Part-time: Flexible hours | Contract: Fixed duration',
  workLocation: 'On-site: Physical office | Remote: Work from anywhere | Hybrid: Mix of both',
  experience: 'Set to 0 for entry-level positions. This is a key filter for job seekers.',
  skills: 'List skills separated by commas (e.g., "JavaScript, React, Node.js"). Be specific - generic skills get fewer qualified applicants.',
  salary: 'Providing a salary range helps attract qualified candidates. Jobs with salary information get 40% more applications.',
  salaryMin: 'Enter the minimum salary in your budget',
  salaryMax: 'Enter the maximum salary you\'re willing to offer',
  image: 'Add a company logo or job-related image. Professional images increase engagement by up to 30%.',
  deadline: 'Set an application deadline to create urgency. Leave empty for no deadline.',
}

export const JOB_FORM_TOOLTIPS = {
  description: {
    title: 'Writing an Effective Job Description',
    content: `
      <ul class="list-disc pl-4 space-y-1">
        <li>Start with a compelling overview of the role</li>
        <li>List 3-5 key responsibilities</li>
        <li>Specify required and preferred qualifications</li>
        <li>Highlight benefits and growth opportunities</li>
        <li>Keep it concise but informative (aim for 300-500 words)</li>
      </ul>
    `,
  },
  skills: {
    title: 'How to List Skills Effectively',
    content: `
      <ul class="list-disc pl-4 space-y-1">
        <li>Separate each skill with a comma</li>
        <li>Be specific: "React.js" instead of just "JavaScript"</li>
        <li>List technical and soft skills separately</li>
        <li>Prioritize must-have skills first</li>
        <li>Limit to 5-10 most important skills for better matches</li>
      </ul>
    `,
  },
  salary: {
    title: 'The Impact of Salary Transparency',
    content: `
      <p class="mb-2">Studies show that job postings with salary ranges:</p>
      <ul class="list-disc pl-4 space-y-1">
        <li>Receive 40% more applications</li>
        <li>Attract more qualified candidates</li>
        <li>Build trust with potential applicants</li>
        <li>Save time by filtering out mismatched expectations</li>
      </ul>
    `,
  },
}

export const CHARACTER_LIMITS = {
  title: { min: 5, max: 200 },
  description: { min: 10, max: 10000 },
  tagline: { max: 100 },
}

export const VALIDATION_MESSAGES = {
  titleTooShort: 'Title must be at least 5 characters',
  titleTooLong: 'Title cannot exceed 200 characters',
  descriptionTooShort: 'Description must be at least 10 characters',
  descriptionTooLong: 'Description cannot exceed 10,000 characters',
  salaryInvalid: 'Salary must be a positive number',
  salaryMinGreaterThanMax: 'Minimum salary cannot be greater than maximum salary',
  skillsLimit: 'You can add up to 50 skills',
}
