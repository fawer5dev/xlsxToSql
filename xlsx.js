// Initialize arrays and mapping object
let excelColumns = [];
let mysqlColumns = [];
let mapping = {};

/**
 * Loads columns from the selected Excel file
 * Gets the headers from the first row and prepares for mapping
 */
function loadColumns() {
    const fileInput = document.getElementById('file');
    const mappingContainer = document.getElementById('column-mapping');

    if (!fileInput.files.length) {
        alert('Please select a file.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Get the first sheet from the workbook
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet to array of rows
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Extract Excel column headers from the first row
            excelColumns = rows[0].map(header => String(header).trim());

            // Display the mapping container
            document.getElementById('mapping-container').style.display = 'block';

            // Clear any previous mapping UI
            mappingContainer.innerHTML = '';
        } catch (error) {
            document.getElementById('output').textContent = `Error loading file: ${error.message}`;
        }
    };

    reader.readAsArrayBuffer(file);
}

/**
 * Generates SQL INSERT statement based on the Excel data and column mappings
 * Reads the file data, applies the mapping, and formats the SQL query
 */
function generateSQL() {
    const output = document.getElementById('output');
    const tableNameInput = document.getElementById('table-name');
    const mysqlColumnsInput = document.getElementById('mysql-columns');
    const mappingContainer = document.getElementById('column-mapping');

    // Validate table name
    const tableName = tableNameInput.value.trim();
    if (!tableName) {
        output.textContent = 'Error: Please enter the MySQL table name.';
        return;
    }

    // Get MySQL columns from user input
    mysqlColumns = mysqlColumnsInput.value.split(',').map(column => column.trim());
    if (mysqlColumns.some(column => !column)) {
        output.textContent = 'Error: MySQL columns cannot be empty.';
        return;
    }

    // Validate that all columns are mapped
    if (Object.keys(mapping).length !== excelColumns.length) {
        output.textContent = 'Error: Please complete the mapping for all columns.';
        return;
    }

    const fileInput = document.getElementById('file');
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Get the first sheet from the workbook
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet to array of rows
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Remove the first row (headers)
            rows.shift();

            // Build the SQL query
            const columns = Object.values(mapping); // MySQL columns
            const queryParts = [];

            // Process each data row
            rows.forEach(row => {
                const values = columns.map(column => {
                    const excelIndex = excelColumns.indexOf(Object.keys(mapping).find(key => mapping[key] === column));
                    return `'${escapeSQL(String(row[excelIndex] || ''))}'`;
                }).join(', ');

                queryParts.push(`(${values})`);
            });

            // Format the final SQL query
            const columnsString = columns.join(', ');
            const valuesString = queryParts.join(', ');
            const sqlQuery = `INSERT INTO ${tableName} (${columnsString}) VALUES ${valuesString};`;

            // Display the generated query
            output.textContent = sqlQuery;
        } catch (error) {
            output.textContent = `Error processing file: ${error.message}`;
        }
    };

    reader.readAsArrayBuffer(fileInput.files[0]);
}

/**
 * Creates the UI for mapping Excel columns to MySQL columns
 * Dynamically generates dropdown selectors for each Excel column
 */
function createMapping() {
    const mappingContainer = document.getElementById('column-mapping');
    const mysqlColumnsInput = document.getElementById('mysql-columns');

    // Get MySQL columns from user input
    mysqlColumns = mysqlColumnsInput.value.split(',').map(column => column.trim());
    if (mysqlColumns.some(column => !column)) {
        alert('Error: MySQL columns cannot be empty.');
        return;
    }

    // Clear any previous mapping UI
    mappingContainer.innerHTML = '';

    // Create mapping fields for each Excel column
    excelColumns.forEach((excelColumn, index) => {
        const mappingRow = document.createElement('div');
        mappingRow.classList.add('mapping-row');

        const label = document.createElement('label');
        label.textContent = excelColumn;

        const select = document.createElement('select');
        select.setAttribute('data-index', index);

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select a column --';
        select.appendChild(defaultOption);

        // Add MySQL columns as options
        mysqlColumns.forEach(mysqlColumn => {
            const option = document.createElement('option');
            option.value = mysqlColumn;
            option.textContent = mysqlColumn;
            select.appendChild(option);
        });

        // Add event listener to save mapping
        select.addEventListener('change', function() {
            mapping[excelColumn] = this.value;
        });

        mappingRow.appendChild(label);
        mappingRow.appendChild(select);
        mappingContainer.appendChild(mappingRow);
    });
}

/**
 * Escapes special characters in SQL values
 * Currently handles single quotes by doubling them
 * 
 * @param {string} value - The string value to escape
 * @return {string} The escaped string
 */
function escapeSQL(value) {
    return value.replace(/'/g, "''");
}

// Listen for changes in the MySQL columns input field
document.getElementById('mysql-columns').addEventListener('input', createMapping);