# 🧪 Testing Guide - Excel to SQL Converter

## Quick Start

Your application is now running at: **http://localhost:8000**

### Test Resources Available:
1. **Visual Test Suite**: http://localhost:8000/test-suite.html
2. **Main Application**: http://localhost:8000/index.html
3. **Automated Tests**: Run `tests.js` in browser console

---

## 📋 Manual Testing Checklist

### 1. File Upload Tests

#### Test 1.1: Basic File Upload
- [ ] Click "Choose File" button
- [ ] Select a valid .xlsx file
- [ ] Verify file name displays with green checkmark
- [ ] Verify "Load Columns" button is enabled
- [ ] Click "Load Columns"
- [ ] Verify step indicator moves to step 2

#### Test 1.2: Drag & Drop Upload
- [ ] Drag an .xlsx file over the upload area
- [ ] Verify upload area highlights with border change
- [ ] Drop the file
- [ ] Verify file is accepted and displayed
- [ ] Verify step indicator updates

#### Test 1.3: File Removal
- [ ] Upload a file
- [ ] Click the X button to remove
- [ ] Verify upload area is restored
- [ ] Verify "Load Columns" button is disabled

---

### 2. Column Configuration Tests

#### Test 2.1: Table Name Input
- [ ] Enter a valid table name (e.g., "users")
- [ ] Verify input accepts alphanumeric characters
- [ ] Leave empty and try to generate SQL
- [ ] Verify error message appears

#### Test 2.2: MySQL Columns Input
- [ ] Enter comma-separated columns (e.g., "id, name, email")
- [ ] Verify mapping interface appears automatically
- [ ] Verify step indicator moves to step 3
- [ ] Verify column mapping section displays
- [ ] Change column names
- [ ] Verify mapping updates dynamically

---

### 3. Column Mapping Tests

#### Test 3.1: Dropdown Population
- [ ] Verify each Excel column has a dropdown
- [ ] Verify dropdowns contain MySQL columns
- [ ] Verify "-- Select column --" is default option
- [ ] Select different mappings for each column
- [ ] Verify mappings are saved

#### Test 3.2: Visual Feedback
- [ ] Verify Excel columns show with emoji icon
- [ ] Verify arrow indicator between columns
- [ ] Hover over mapping rows
- [ ] Verify hover effect works
- [ ] Verify responsive layout on smaller screens

---

### 4. SQL Generation Tests

#### Test 4.1: Valid SQL Generation
- [ ] Complete all mappings
- [ ] Click "Generate SQL Query"
- [ ] Verify output card appears
- [ ] Verify SQL syntax is correct
- [ ] Verify table name matches input
- [ ] Verify column names match mappings
- [ ] Verify data is properly escaped

#### Test 4.2: SQL Output Display
- [ ] Verify SQL is syntax-highlighted
- [ ] Verify code is readable with proper formatting
- [ ] Verify scrollbar appears for long queries
- [ ] Verify statistics display (table, columns, rows)
- [ ] Verify step indicator moves to step 4

#### Test 4.3: Copy to Clipboard
- [ ] Click "Copy" button
- [ ] Verify button shows "Copied!" feedback
- [ ] Paste in text editor
- [ ] Verify complete SQL is copied
- [ ] Verify button reverts after 2 seconds

---

### 5. Data Validation Tests

#### Test 5.1: Special Characters
Test with data containing:
- [ ] Single quotes (e.g., "O'Reilly")
- [ ] Double quotes (e.g., "Said \"Hello\"")
- [ ] New lines
- [ ] Special characters (@, #, $, %)
- [ ] Verify all are properly escaped in output

#### Test 5.2: Empty Values
- [ ] Test with empty cells in Excel
- [ ] Verify empty strings are handled
- [ ] Verify no errors occur

#### Test 5.3: Large Datasets
- [ ] Test with 100 rows
- [ ] Test with 1000 rows
- [ ] Verify performance is acceptable
- [ ] Verify all rows are processed

---

### 6. UI/UX Tests

#### Test 6.1: Visual Design
- [ ] Verify gradient background displays
- [ ] Verify cards have shadows
- [ ] Verify colors match design system
- [ ] Verify icons display correctly (Font Awesome)
- [ ] Verify buttons have hover effects
- [ ] Verify animations are smooth

#### Test 6.2: Step Indicators
- [ ] Verify step 1 is active initially
- [ ] Load file and verify step 2 activates
- [ ] Configure table and verify step 3 activates
- [ ] Generate SQL and verify step 4 activates
- [ ] Verify completed steps show checkmarks

#### Test 6.3: Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768px width)
- [ ] Test on mobile (375px width)
- [ ] Verify layout adapts appropriately
- [ ] Verify all features work on mobile

---

### 7. Error Handling Tests

#### Test 7.1: Missing Inputs
- [ ] Try to load without selecting file
- [ ] Try to generate without table name
- [ ] Try to generate without MySQL columns
- [ ] Try to generate without mappings
- [ ] Verify appropriate error messages

#### Test 7.2: Invalid Files
- [ ] Try to upload .xls file (old format)
- [ ] Try to upload .csv file
- [ ] Try to upload .txt file
- [ ] Verify file type validation

---

## 🤖 Automated Testing

### Running Automated Tests

1. **Browser Console Method**:
   ```javascript
   // Open browser console (F12)
   // Create script element
   const script = document.createElement('script');
   script.src = 'tests.js';
   document.head.appendChild(script);
   ```

2. **Test Suite Page**:
   - Navigate to http://localhost:8000/test-suite.html
   - Click "Run All Tests"
   - View test results

### Test Coverage

The automated test suite covers:
- ✅ Dependency loading (SheetJS)
- ✅ Core functions (SQL escape, mapping)
- ✅ Browser API support (FileReader, Clipboard)
- ✅ Data processing logic
- ✅ Validation functions
- ✅ Complete workflow simulation

---

## 📊 Sample Data Generator

Use the test suite to generate sample Excel files:

1. Navigate to http://localhost:8000/test-suite.html
2. Choose file size:
   - **Small**: 10 rows (quick testing)
   - **Medium**: 100 rows (standard testing)
   - **Large**: 1000 rows (performance testing)
3. Click generate button
4. File downloads automatically
5. Use file to test the main application

### Sample Data Structure
```
Columns: ID, Name, Email, Phone, City, Status
Data: Randomly generated user information
```

### Suggested Test Configuration
```
Table name: users
MySQL columns: id, name, email, phone, city, status
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Please select a file" error
**Solution**: Ensure you've selected a valid .xlsx file before clicking "Load Columns"

### Issue 2: Mapping interface doesn't appear
**Solution**: Enter MySQL columns first (comma-separated), then it will auto-populate

### Issue 3: Copy button doesn't work
**Solution**: Browser might block clipboard access. Check browser permissions.

### Issue 4: File won't upload
**Solution**: Ensure file is .xlsx format (not .xls or other formats)

### Issue 5: SQL has syntax errors
**Solution**: Verify column mappings are correct and all required columns are mapped

---

## ✅ Acceptance Criteria

The application passes testing if:

1. ✅ All file upload methods work (button click & drag-drop)
2. ✅ Column loading extracts correct headers
3. ✅ Table configuration accepts valid inputs
4. ✅ Column mapping creates proper associations
5. ✅ SQL generation produces valid INSERT statements
6. ✅ Special characters are properly escaped
7. ✅ Copy to clipboard functions correctly
8. ✅ Step indicators update throughout workflow
9. ✅ UI is responsive on all screen sizes
10. ✅ All animations and transitions work smoothly
11. ✅ Error messages display for invalid inputs
12. ✅ Performance is acceptable for large datasets

---

## 📈 Performance Benchmarks

Expected performance metrics:

| Operation | Expected Time |
|-----------|---------------|
| File upload (100 rows) | < 1 second |
| Column loading | < 0.5 seconds |
| SQL generation (100 rows) | < 2 seconds |
| SQL generation (1000 rows) | < 5 seconds |
| Copy to clipboard | Instant |

---

## 🎯 Next Steps After Testing

1. ✅ Verify all manual tests pass
2. ✅ Run automated test suite
3. ✅ Test with real Excel files from your use case
4. ✅ Verify SQL executes correctly in MySQL
5. ✅ Test edge cases specific to your data
6. ✅ Get feedback from other users

---

## 📞 Support

If you encounter any issues during testing:
1. Check the browser console for errors (F12)
2. Verify all files are loaded correctly
3. Ensure browser is up to date
4. Try in different browser (Chrome, Firefox, Edge)

---

**Happy Testing! 🚀**
