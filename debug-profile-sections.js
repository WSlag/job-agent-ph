/**
 * Profile Sections Debug Script
 *
 * Run this in browser console to diagnose why sections aren't rendering
 */

(function() {
  console.clear();
  console.log('%c🔍 Profile Sections Diagnostic', 'font-size: 18px; font-weight: bold; color: #ef4444;');
  console.log('═══════════════════════════════════════════\n');

  // Check if sections exist
  const sections = {
    '#location-section': document.querySelector('#location-section'),
    '#skills-section': document.querySelector('#skills-section'),
    '#bio-section': document.querySelector('#bio-section'),
    '#resume-section': document.querySelector('#resume-section')
  };

  console.log('📋 Section Existence Check:');
  Object.entries(sections).forEach(([id, element]) => {
    if (element) {
      console.log(`✅ ${id}: FOUND`);
    } else {
      console.log(`❌ ${id}: NOT FOUND`);
    }
  });

  // Check what IS in the page
  console.log('\n📄 Page Content Analysis:');

  const profileCard = document.querySelector('.space-y-6');
  if (profileCard) {
    console.log('✅ Profile card container found');
    console.log('   Child elements:', profileCard.children.length);

    // List all divs with IDs
    const divsWithIds = document.querySelectorAll('div[id]');
    console.log(`\n🏷️  All DIVs with IDs found (${divsWithIds.length}):`);
    divsWithIds.forEach(div => {
      console.log(`   - #${div.id}`);
    });
  } else {
    console.log('❌ Profile card container NOT found');
  }

  // Check profile checklist
  const checklist = document.querySelector('.bg-gradient-to-br.from-blue-50');
  console.log('\n📊 Profile Checklist:');
  if (checklist) {
    console.log('✅ Checklist component found');
    const buttons = checklist.querySelectorAll('button');
    console.log(`   Buttons found: ${buttons.length}`);
  } else {
    console.log('❌ Checklist component NOT found');
  }

  // Check for conditional rendering issues
  console.log('\n🔐 User Context Check:');
  console.log('   (Check React DevTools for actual state)');

  // Check if we're on the right tab
  const profileTab = document.querySelector('button:has-text("Profile Information")');
  const securityTab = document.querySelector('button:has-text("Security")');

  console.log('\n📑 Active Tab:');
  if (profileTab) {
    const isActive = profileTab.className.includes('border-blue-600');
    console.log(isActive ? '✅ Profile Information tab is ACTIVE' : '⚠️  Profile Information tab is INACTIVE');
  }
  if (securityTab) {
    const isActive = securityTab.className.includes('border-blue-600');
    console.log(isActive ? '⚠️  Security tab is ACTIVE (sections won\'t render here)' : '✅ Security tab is INACTIVE');
  }

  // Check if form inputs exist at all
  console.log('\n📝 Form Inputs:');
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
  console.log(`   Total form inputs found: ${inputs.length}`);

  if (inputs.length === 0) {
    console.log('   ❌ NO FORM INPUTS FOUND!');
    console.log('   This means the form isn\'t rendering at all.');
  } else {
    console.log('   Form inputs present:');
    inputs.forEach((input, i) => {
      const placeholder = input.getAttribute('placeholder');
      const value = input.value;
      console.log(`   ${i + 1}. ${input.tagName} - placeholder: "${placeholder || 'none'}" - value: "${value || 'empty'}"`);
    });
  }

  // Final diagnosis
  console.log('\n');
  console.log('%c═══════════════════════════════════════════', 'color: #ef4444;');
  console.log('%c🎯 Diagnosis', 'font-size: 16px; font-weight: bold; color: #ef4444;');
  console.log('%c═══════════════════════════════════════════', 'color: #ef4444;');

  const foundSections = Object.values(sections).filter(Boolean).length;

  if (foundSections === 4) {
    console.log('%c✅ All sections found! Buttons should work.', 'color: #10b981; font-weight: bold;');
  } else if (foundSections > 0) {
    console.log(`%c⚠️  Only ${foundSections}/4 sections found. Partial rendering issue.`, 'color: #f59e0b; font-weight: bold;');
  } else if (inputs.length > 0) {
    console.log('%c❌ Form exists but sections have no IDs!', 'color: #ef4444; font-weight: bold;');
    console.log('   The form is rendering but the ID attributes are missing.');
  } else {
    console.log('%c❌ Form is NOT rendering at all!', 'color: #ef4444; font-weight: bold;');
    console.log('\n   Possible causes:');
    console.log('   1. User is not logged in as a job hunter');
    console.log('   2. Profile data hasn\'t loaded yet (missing \'fullName\' property)');
    console.log('   3. On wrong tab (Security instead of Profile Information)');
    console.log('   4. Profile object doesn\'t meet conditional requirements');
    console.log('\n   Check React DevTools to inspect:');
    console.log('   - userType value');
    console.log('   - profile object structure');
    console.log('   - activeTab value');
  }

  console.log('\n');

  return {
    sections,
    foundSections,
    totalInputs: inputs.length
  };
})();
