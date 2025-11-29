// Simple test script for job matching algorithm
const { calculateJobMatch } = require('./lib/notifications/job-matching');

console.log('Testing Job Matching Algorithm\n');

// Test Case 1: High Match (Skills + Location + Salary)
const jobA = {
  title: 'Senior React Developer',
  category: 'Information Technology',
  location: 'Manila',
  country: 'Philippines',
  locationType: 'remote',
  jobType: 'full-time',
  salaryMin: 60000,
  salaryMax: 90000,
  currency: 'PHP',
  experienceRequired: 3,
  skills: ['React', 'JavaScript', 'TypeScript'],
};

const hunterA = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  location: 'Manila',
  skills: ['React', 'Node.js', 'TypeScript', 'JavaScript'],
  experience: 4,
  preferredCountries: ['Philippines'],
  preferredCategories: ['Information Technology'],
  preferredJobTypes: ['full-time'],
  preferredLocationType: ['remote', 'hybrid'],
  salaryExpectation: {
    min: 50000,
    max: 80000,
    currency: 'PHP',
  },
  jobMatchNotifications: true,
};

console.log('Test Case 1: High Match Scenario');
console.log('Job:', jobA.title);
console.log('Hunter Skills:', hunterA.skills.join(', '));
const resultA = calculateJobMatch(jobA, hunterA, 60);
console.log('Match Score:', resultA.totalScore + '/100');
console.log('Is Match:', resultA.isMatch);
console.log('Breakdown:', JSON.stringify(resultA.breakdown, null, 2));
console.log('Matching Skills:', resultA.matchingSkills.join(', '));
console.log('\n---\n');

// Test Case 2: Low Match (Different Skills + Location)
const jobB = {
  title: 'Python Django Developer',
  category: 'Information Technology',
  location: 'Singapore',
  country: 'Singapore',
  locationType: 'on-site',
  jobType: 'contract',
  salaryMin: 70000,
  salaryMax: 100000,
  currency: 'SGD',
  experienceRequired: 5,
  skills: ['Python', 'Django', 'PostgreSQL'],
};

console.log('Test Case 2: Low Match Scenario');
console.log('Job:', jobB.title);
console.log('Hunter Skills:', hunterA.skills.join(', '));
const resultB = calculateJobMatch(jobB, hunterA, 60);
console.log('Match Score:', resultB.totalScore + '/100');
console.log('Is Match:', resultB.isMatch);
console.log('Breakdown:', JSON.stringify(resultB.breakdown, null, 2));
console.log('Matching Skills:', resultB.matchingSkills.join(', ') || 'None');
console.log('\n---\n');

// Test Case 3: Medium Match (Some Skills Match)
const jobC = {
  title: 'Full Stack Developer',
  category: 'Information Technology',
  location: 'Cebu',
  country: 'Philippines',
  locationType: 'hybrid',
  jobType: 'full-time',
  salaryMin: 45000,
  salaryMax: 70000,
  currency: 'PHP',
  experienceRequired: 3,
  skills: ['React', 'Node.js', 'MongoDB'],
};

console.log('Test Case 3: Medium Match Scenario');
console.log('Job:', jobC.title);
console.log('Hunter Skills:', hunterA.skills.join(', '));
const resultC = calculateJobMatch(jobC, hunterA, 60);
console.log('Match Score:', resultC.totalScore + '/100');
console.log('Is Match:', resultC.isMatch);
console.log('Breakdown:', JSON.stringify(resultC.breakdown, null, 2));
console.log('Matching Skills:', resultC.matchingSkills.join(', '));
console.log('\n---\n');

console.log('Summary:');
console.log('Test Case 1 (High Match):', resultA.isMatch ? '✓ PASS' : '✗ FAIL');
console.log('Test Case 2 (Low Match):', !resultB.isMatch ? '✓ PASS' : '✗ FAIL');
console.log('Test Case 3 (Medium Match):', resultC.isMatch ? '✓ PASS' : '✗ FAIL');
