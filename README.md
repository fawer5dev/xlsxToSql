# Excel to SQL Converter

A browser-based tool that simplifies the process of converting Excel spreadsheet data into SQL INSERT statements for database import operations.

## Overview

This web application allows users to:
1. Upload an Excel (.xlsx) file
2. Specify a MySQL table name 
3. Define the MySQL table columns
4. Map Excel spreadsheet columns to MySQL table columns
5. Generate a properly formatted SQL INSERT statement

The tool is particularly useful for database administrators, developers, and data analysts who need to transfer data from Excel spreadsheets into MySQL databases without writing complex SQL queries manually.

## Features

- **Easy Excel File Upload**: Supports .xlsx files through a simple file input interface
- **Dynamic Column Mapping**: Automatically extracts column headers from the Excel file and allows custom mapping to database columns
- **Flexible Configuration**: Supports any table structure and column naming
- **SQL Escaping**: Properly escapes special characters (like single quotes) to prevent SQL injection issues
- **Instant Preview**: Shows the generated SQL query in real-time for verification

## How to Use

1. **Upload Your Excel File**:
   - Click "Select a .xlsx file" and choose your Excel spreadsheet
   - Click "Load Columns" to extract the column headers

2. **Configure Database Settings**:
   - Enter your MySQL table name
   - Enter the MySQL table columns (comma-separated)

3. **Map Columns**:
   - For each Excel column detected, select the corresponding MySQL column from the dropdown

4. **Generate SQL**:
   - Click "Generate SQL" to create the INSERT statement
   - The result will appear in the output area at the bottom of the page

5. **Use the SQL**:
   - Copy the generated SQL statement
   - Execute it in your MySQL client or database management tool

## Technical Details

The application uses:
- **SheetJS (xlsx)**: JavaScript library for parsing Excel files
- **HTML5 File API**: For client-side file handling
- **Pure JavaScript**: No server-side processing required - all conversion happens in the browser

## Requirements

- Modern web browser with JavaScript enabled
- Excel files in .xlsx format (Excel 2007 or newer)

## Limitations

- Limited to generating INSERT statements (no UPDATE or other SQL operations)
- Processes only the first sheet of multi-sheet Excel files
- Large files may cause performance issues in the browser

## Security Notes

This tool processes all data locally in your browser. No data is sent to any server, ensuring your data remains private and secure.

## License

[Your license information here]