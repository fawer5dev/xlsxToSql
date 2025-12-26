// Initialize arrays and mapping object
let excelColumns = [];
let mysqlColumns = [];
let mapping = {};
let totalRows = 0;

/**
 * Updates the step indicator UI
 * @param {number} stepNumber - The current step (1-4)
 */
function updateStepIndicator(stepNumber) {
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step-${i}`);
        if (i < stepNumber) {
            step.classList.remove('active');
            step.classList.add('completed');
        } else if (i === stepNumber) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    }
}

/**
 * Initializes drag and drop functionality for file upload
 */
function initDragAndDrop() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('drag-over');
        });
    });

    uploadArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    });

    fileInput.addEventListener('change', handleFileSelect);
}

/**
 * Handles file selection and displays file info
 */
function handleFileSelect() {
    const fileInput = document.getElementById('file');
    const loadBtn = document.getElementById('load-btn');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const uploadArea = document.getElementById('upload-area');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileName.textContent = file.name;
        uploadArea.style.display = 'none';
        fileInfo.style.display = 'flex';
        loadBtn.disabled = false;
    }
}

/**
 * Clears the selected file
 */
function clearFile() {
    const fileInput = document.getElementById('file');
    const loadBtn = document.getElementById('load-btn');
    const fileInfo = document.getElementById('file-info');
    const uploadArea = document.getElementById('upload-area');
    
    fileInput.value = '';
    uploadArea.style.display = 'block';
    fileInfo.style.display = 'none';
    loadBtn.disabled = true;
}

/**
 * Loads columns from the selected Excel file
 * Gets the headers from the first row and prepares for mapping
 */
function loadColumns() {
    const fileInput = document.getElementById('file');
    const mappingContainer = document.getElementById('column-mapping');

    if (!fileInput.files.length) {
        showNotification('Please select a file.', 'error');
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
            totalRows = rows.length - 1; // Exclude header row

            // Display the mapping container
            document.getElementById('mapping-container').style.display = 'flex';

            // Clear any previous mapping UI
            mappingContainer.innerHTML = '';

            // Update step indicator
            updateStepIndicator(2);

            showNotification(`Successfully loaded ${excelColumns.length} columns and ${totalRows} rows!`, 'success');
        } catch (error) {
            showNotification(`Error loading file: ${error.message}`, 'error');
        }
    };

    reader.readAsArrayBuffer(file);
}

/**
 * Shows a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // You can implement a more sophisticated notification system here
    // For now, we'll use console and alerts for important messages
    if (type === 'error') {
        alert(message);
    }
    console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Generates SQL INSERT statement based on the Excel data and column mappings
 * Reads the file data, applies the mapping, and formats the SQL query
 */
function generateSQL() {
    const output = document.getElementById('output');
    const outputCard = document.getElementById('output-card');
    const tableNameInput = document.getElementById('table-name');
    const mysqlColumnsInput = document.getElementById('mysql-columns');
    const mappingContainer = document.getElementById('column-mapping');

    // Validate table name
    const tableName = tableNameInput.value.trim();
    if (!tableName) {
        showNotification('Please enter the MySQL table name.', 'error');
        return;
    }

    // Get MySQL columns from user input
    mysqlColumns = mysqlColumnsInput.value.split(',').map(column => column.trim());
    if (mysqlColumns.some(column => !column)) {
        showNotification('MySQL columns cannot be empty.', 'error');
        return;
    }

    // Validate that all columns are mapped
    const mappedColumns = Object.keys(mapping).filter(key => mapping[key]);
    if (mappedColumns.length === 0) {
        showNotification('Please map at least one column.', 'error');
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
            const columns = Object.values(mapping).filter(val => val); // MySQL columns
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
            const valuesString = queryParts.join(',\n');
            const sqlQuery = `INSERT INTO ${tableName} (${columnsString})\nVALUES\n${valuesString};`;

            // Display the generated query
            output.textContent = sqlQuery;
            outputCard.style.display = 'block';
            
            // Display statistics
            displayStats(tableName, columns.length, rows.length);

            // Update step indicator
            updateStepIndicator(4);

            // Scroll to output
            outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            showNotification('SQL query generated successfully!', 'success');
        } catch (error) {
            showNotification(`Error processing file: ${error.message}`, 'error');
        }
    };

    reader.readAsArrayBuffer(fileInput.files[0]);
}

/**
 * Displays statistics about the generated SQL
 * @param {string} tableName - The table name
 * @param {number} columnCount - Number of columns
 * @param {number} rowCount - Number of rows
 */
function displayStats(tableName, columnCount, rowCount) {
    const outputStats = document.getElementById('output-stats');
    outputStats.innerHTML = `
        <div class="stat-item">
            <i class="fas fa-table"></i>
            <span><span class="stat-value">${tableName}</span> <span class="stat-label">table</span></span>
        </div>
        <div class="stat-item">
            <i class="fas fa-columns"></i>
            <span><span class="stat-value">${columnCount}</span> <span class="stat-label">columns</span></span>
        </div>
        <div class="stat-item">
            <i class="fas fa-database"></i>
            <span><span class="stat-value">${rowCount}</span> <span class="stat-label">rows</span></span>
        </div>
    `;
}

/**
 * Creates the UI for mapping Excel columns to MySQL columns
 * Dynamically generates dropdown selectors for each Excel column
 */
function createMapping() {
    const mappingContainer = document.getElementById('column-mapping');
    const mappingCard = document.getElementById('mapping-card');
    const mysqlColumnsInput = document.getElementById('mysql-columns');

    // Get MySQL columns from user input
    mysqlColumns = mysqlColumnsInput.value.split(',').map(column => column.trim());
    if (mysqlColumns.some(column => !column)) {
        mappingCard.style.display = 'none';
        return;
    }

    // Clear any previous mapping UI
    mappingContainer.innerHTML = '';
    mapping = {}; // Reset mapping

    // Create mapping fields for each Excel column
    excelColumns.forEach((excelColumn, index) => {
        const mappingRow = document.createElement('div');
        mappingRow.classList.add('mapping-row');

        const label = document.createElement('label');
        label.textContent = excelColumn;

        const arrow = document.createElement('i');
        arrow.classList.add('fas', 'fa-arrow-right', 'mapping-arrow');

        const select = document.createElement('select');
        select.setAttribute('data-index', index);

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select column --';
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
        mappingRow.appendChild(arrow);
        mappingRow.appendChild(select);
        mappingContainer.appendChild(mappingRow);
    });

    // Show mapping card and update step indicator
    mappingCard.style.display = 'block';
    updateStepIndicator(3);

    // Scroll to mapping card
    mappingCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Copies the generated SQL to clipboard
 */
function copyToClipboard() {
    const output = document.getElementById('output');
    const copyBtn = document.getElementById('copy-btn');
    
    navigator.clipboard.writeText(output.textContent).then(() => {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = 'var(--success-color)';
        copyBtn.style.color = 'white';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
        }, 2000);
    }).catch(err => {
        showNotification('Failed to copy to clipboard', 'error');
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initDragAndDrop();
    updateStepIndicator(1);

    // Listen for changes in the MySQL columns input field
    document.getElementById('mysql-columns').addEventListener('input', createMapping);
});



