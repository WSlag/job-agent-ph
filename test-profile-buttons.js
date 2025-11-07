/**
 * Profile Page Button Functionality Test Script
 *
 * Run this script in your browser console on the profile page (192.168.1.3:3000/profile)
 * to test all button functionality programmatically.
 *
 * Usage:
 * 1. Open browser DevTools (F12)
 * 2. Navigate to Console tab
 * 3. Copy and paste this entire script
 * 4. Press Enter to execute
 * 5. Review the test results
 */

(function() {
  'use strict';

  console.clear();
  console.log('%c🧪 Profile Button Functionality Test Suite', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
  console.log('%c═══════════════════════════════════════════', 'color: #3b82f6;');
  console.log('Starting automated button tests...\n');

  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  /**
   * Test helper functions
   */
  function testButton(name, selector, description) {
    const element = document.querySelector(selector);

    if (!element) {
      results.failed.push({ name, reason: 'Button not found in DOM', selector });
      console.log(`❌ ${name}: NOT FOUND`);
      return false;
    }

    // Check if button has click handler
    const hasClickHandler = element.onclick ||
                           element.getAttribute('onclick') ||
                           element.hasAttribute('href');

    if (!hasClickHandler) {
      results.warnings.push({ name, reason: 'No obvious click handler detected', selector });
      console.log(`⚠️  ${name}: Found but handler unclear`);
      return 'warning';
    }

    // Check if button is disabled
    if (element.disabled || element.classList.contains('disabled')) {
      results.warnings.push({ name, reason: 'Button is currently disabled', selector });
      console.log(`⚠️  ${name}: Found but currently disabled`);
      return 'warning';
    }

    results.passed.push({ name, description, selector });
    console.log(`✅ ${name}: Found and clickable`);
    return true;
  }

  function testMultipleButtons(name, selector, expectedCount) {
    const elements = document.querySelectorAll(selector);

    if (elements.length === 0) {
      results.failed.push({ name, reason: 'No buttons found', selector, expected: expectedCount });
      console.log(`❌ ${name}: NOT FOUND (expected ${expectedCount})`);
      return false;
    }

    if (expectedCount && elements.length !== expectedCount) {
      results.warnings.push({
        name,
        reason: `Found ${elements.length} buttons, expected ${expectedCount}`,
        selector
      });
      console.log(`⚠️  ${name}: Found ${elements.length} (expected ${expectedCount})`);
      return 'warning';
    }

    results.passed.push({ name, count: elements.length, selector });
    console.log(`✅ ${name}: Found ${elements.length} buttons`);
    return true;
  }

  /**
   * Run Tests
   */
  console.log('\n📋 Testing Navigation Buttons...');
  console.log('─────────────────────────────────');
  testButton('Back Button', 'button:has(svg) span:has-text("Back")', 'Top-left back navigation');

  console.log('\n📱 Testing Bottom Navigation (Mobile)...');
  console.log('─────────────────────────────────');
  const bottomNav = document.querySelector('nav.fixed.bottom-0');
  if (bottomNav) {
    if (window.innerWidth >= 768) {
      console.log('⚠️  Bottom nav hidden on desktop (resize to mobile view)');
      results.warnings.push({
        name: 'Bottom Navigation',
        reason: 'Hidden on desktop view - resize to < 768px width to test'
      });
    } else {
      testMultipleButtons('Bottom Nav Links', 'nav.fixed.bottom-0 a', 5);
    }
  } else {
    results.warnings.push({
      name: 'Bottom Navigation',
      reason: 'Nav bar not found - may need to be logged in as job hunter'
    });
  }

  console.log('\n📑 Testing Tab Buttons...');
  console.log('─────────────────────────────────');
  testButton('Profile Information Tab', 'button:has-text("Profile Information")', 'Switch to profile tab');
  testButton('Security Tab', 'button:has-text("Security")', 'Switch to security tab');

  console.log('\n✏️  Testing Profile Form Buttons...');
  console.log('─────────────────────────────────');
  testButton('Add Skill Button', 'button:has-text("Add")', 'Add skill to profile');
  testMultipleButtons('Remove Skill Buttons', 'span.bg-blue-100 button', null);
  testButton('Save Changes Button', 'button:has-text("Save Changes")', 'Save profile data');
  testButton('Cancel Button', 'button:has-text("Cancel")', 'Discard changes');

  console.log('\n🔒 Testing Security Tab Button...');
  console.log('─────────────────────────────────');
  testButton('Update Password Button', 'button:has-text("Update Password")', 'Change user password');

  console.log('\n📊 Testing Profile Checklist Buttons...');
  console.log('─────────────────────────────────');
  const checklist = document.querySelector('.bg-gradient-to-br.from-blue-50');
  if (checklist) {
    testButton('Checklist Expand/Collapse', '.bg-gradient-to-br.from-blue-50 > div:first-child', 'Toggle checklist visibility');
    testMultipleButtons('Checklist Item Buttons', '.bg-gradient-to-br.from-blue-50 button:has-text("Upload Resume"), .bg-gradient-to-br.from-blue-50 button:has-text("Add Skills"), .bg-gradient-to-br.from-blue-50 button:has-text("Set Location"), .bg-gradient-to-br.from-blue-50 button:has-text("Write Bio")', null);
    testButton('Dismiss Button', 'button:has-text("Dismiss")', 'Hide completed checklist');
  } else {
    results.warnings.push({
      name: 'Profile Checklist',
      reason: 'Checklist not found - may only appear for job hunters'
    });
    console.log('⚠️  Profile Checklist: Not visible (job hunters only)');
  }

  console.log('\n📎 Testing File Input Buttons...');
  console.log('─────────────────────────────────');
  testButton('Resume File Input', 'input[type="file"][accept*="pdf"]', 'Upload resume');
  testMultipleButtons('Profile Picture Inputs', 'input[type="file"][accept*="image"]', null);

  /**
   * Additional Checks
   */
  console.log('\n🔍 Additional Checks...');
  console.log('─────────────────────────────────');

  // Check for form validation
  const fullNameInput = document.querySelector('input[type="text"][placeholder*="John"]');
  if (fullNameInput) {
    const value = fullNameInput.value;
    if (!value || value.length < 2) {
      results.warnings.push({
        name: 'Form Validation',
        reason: 'Full name is empty or < 2 characters - this will prevent saving'
      });
      console.log('⚠️  Full Name field needs at least 2 characters');
    } else {
      console.log('✅ Full Name field has valid value');
    }
  }

  // Check for console errors
  console.log('\n🐛 Checking Console Errors...');
  console.log('─────────────────────────────────');
  console.log('ℹ️  Check above for any red error messages');
  console.log('ℹ️  Common errors to look for:');
  console.log('   - Firebase authentication errors');
  console.log('   - Network request failures');
  console.log('   - JavaScript runtime errors');

  /**
   * Print Summary
   */
  console.log('\n');
  console.log('%c═══════════════════════════════════════════', 'color: #3b82f6;');
  console.log('%c📊 Test Summary', 'font-size: 18px; font-weight: bold; color: #3b82f6;');
  console.log('%c═══════════════════════════════════════════', 'color: #3b82f6;');
  console.log(`\n✅ Passed: ${results.passed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n%c❌ Failed Tests:', 'font-weight: bold; color: #ef4444;');
    results.failed.forEach(({ name, reason, selector }) => {
      console.log(`   • ${name}: ${reason}`);
      console.log(`     Selector: ${selector}`);
    });
  }

  if (results.warnings.length > 0) {
    console.log('\n%c⚠️  Warnings:', 'font-weight: bold; color: #f59e0b;');
    results.warnings.forEach(({ name, reason }) => {
      console.log(`   • ${name}: ${reason}`);
    });
  }

  console.log('\n%c═══════════════════════════════════════════', 'color: #3b82f6;');

  if (results.failed.length === 0) {
    console.log('%c✅ All button tests passed!', 'font-size: 16px; font-weight: bold; color: #10b981; background: #d1fae5; padding: 8px 16px; border-radius: 4px;');
  } else {
    console.log('%c⚠️ Some tests failed - review above', 'font-size: 16px; font-weight: bold; color: #ef4444; background: #fee2e2; padding: 8px 16px; border-radius: 4px;');
  }

  console.log('\n💡 Tips:');
  console.log('   1. Try clicking buttons manually to verify interactivity');
  console.log('   2. Check Network tab for failed API requests');
  console.log('   3. Resize browser to mobile view (< 768px) to test bottom nav');
  console.log('   4. Enter at least 2 characters in "Full Name" to test save functionality');
  console.log('\n📖 Full test report: PROFILE_BUTTON_TEST_REPORT.md');
  console.log('%c═══════════════════════════════════════════\n', 'color: #3b82f6;');

  // Return results for programmatic access
  return results;
})();
