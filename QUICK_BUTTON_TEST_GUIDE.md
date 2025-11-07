# Quick Button Test Guide
## Profile Page - Manual Testing Checklist

**Page:** `192.168.1.3:3000/profile`

---

## 🚀 Quick Start

### Option 1: Automated Console Test
1. Open browser DevTools (Press `F12`)
2. Go to **Console** tab
3. Copy contents of `test-profile-buttons.js`
4. Paste into console and press Enter
5. Review the test results

### Option 2: Manual Click Testing
Follow the checklist below and click each button to verify it works.

---

## ✅ Manual Test Checklist

### 1. Navigation (2 buttons)
- [ ] **Back Button** (top-left with arrow) → Goes to previous page
- [ ] **Bottom Nav Bar** (mobile only, 5 buttons at bottom):
  - [ ] Home
  - [ ] Jobs
  - [ ] Companies
  - [ ] Saved
  - [ ] Profile (should be highlighted blue)

---

### 2. Tabs (2 buttons)
- [ ] **Profile Information** tab → Shows profile form
- [ ] **Security** tab → Shows password change form

---

### 3. Profile Form (4 main buttons)
In the **Profile Information** tab:

- [ ] **Add** button (next to skills input):
  - Type a skill and click Add
  - Skill appears as blue chip below
  - Input field clears

- [ ] **× buttons** on each skill chip:
  - Click × on any skill chip
  - Skill disappears

- [ ] **Save Changes** button:
  - **IMPORTANT:** Enter at least 2 characters in "Full Name" first!
  - Click Save Changes
  - Should show "Saving..." then success message
  - If you see error "Full name must be at least 2 characters", enter a valid name

- [ ] **Cancel** button:
  - Goes back to previous page

---

### 4. Security Tab (1 button)
Switch to **Security** tab:

- [ ] **Update Password** button:
  - Enter new password in both fields
  - Click Update Password
  - Should show success message
  - Try with mismatched passwords (should show error)

---

### 5. Profile Checklist (6 buttons)
Look for "Complete Your Profile" section:

- [ ] **Expand/Collapse** (click anywhere on header):
  - Checklist items show/hide with animation
  - Chevron icon changes direction

- [ ] **Upload Resume** button → Scrolls to resume section
- [ ] **Add Skills** button → Scrolls to skills section
- [ ] **Set Location** button → Scrolls to location field
- [ ] **Write Bio** button → Scrolls to bio field

- [ ] **Dismiss** button (only visible at 100% completion):
  - Complete all 4 checklist items first
  - Save profile
  - Click Dismiss
  - Checklist disappears

---

### 6. File Uploads (2 inputs)
- [ ] **Resume upload** (Choose File button):
  - Select a PDF file
  - File name appears below
  - Try invalid file type (should show error)

- [ ] **Profile Picture upload** (Choose File button):
  - Select an image (JPG/PNG)
  - File name appears below
  - Try invalid file type (should show error)

---

## 🐛 What to Look For

### ✅ WORKING Button Signs:
- Button changes color on hover
- Cursor changes to pointer
- Action happens when clicked (navigation, form update, etc.)
- No console errors appear
- Appropriate loading states ("Saving...", "Updating...")
- Success/error messages display correctly

### ❌ BROKEN Button Signs:
- Button doesn't respond to clicks
- Console shows JavaScript errors (open DevTools → Console tab)
- Nothing happens when clicked
- Page freezes or becomes unresponsive
- Network errors in DevTools → Network tab

---

## 🔍 Console Error Check

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for red error messages
4. Common errors:
   - `Firebase: Error (auth/...)` → Authentication issues
   - `Failed to fetch` → Network/API issues
   - `Cannot read property of undefined` → JavaScript errors

---

## 📸 Current Issue from Screenshot

Your screenshot shows:
> **"Full name must be at least 2 characters"**

### ✅ This is NOT a bug - it's validation working correctly!

**To fix:**
1. Find the "Full Name" input field
2. Enter at least 2 characters (e.g., "John Doe")
3. Try clicking "Save Changes" again
4. Should now save successfully

---

## 🎯 Critical Buttons to Test First

These are the most important for basic functionality:

1. ✅ **Save Changes** button (with valid data)
2. ✅ **Tab switching** (Profile Information ↔ Security)
3. ✅ **Add Skill** button
4. ✅ **Checklist scroll buttons**
5. ✅ **Back button**

---

## 📊 Expected Results

**All 22 buttons should be working!**

Based on code analysis, all buttons have:
- ✅ Proper onClick handlers
- ✅ State management
- ✅ Loading/disabled states
- ✅ Error handling
- ✅ Validation logic

---

## 🛠️ If You Find a Broken Button

Document:
1. **Which button** is broken?
2. **What happens** when you click it? (nothing, error, wrong behavior)
3. **Console errors** (screenshot or copy error text)
4. **Steps to reproduce** (what did you do before clicking?)

Then share this information for debugging.

---

## ✨ Pro Tips

- **Mobile view:** Resize browser to < 768px width to see bottom navigation
- **Keyboard testing:** Press Tab key to navigate between buttons
- **Network issues:** Check DevTools → Network tab for failed requests
- **Firebase errors:** Most common issue is authentication expiration (logout/login again)

---

**For detailed technical information, see:** `PROFILE_BUTTON_TEST_REPORT.md`
