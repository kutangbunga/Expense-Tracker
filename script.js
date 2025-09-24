// Load configuration from external file
// Make sure config.js exists and is not committed to version control
const APPS_SCRIPT_URL = CONFIG.APPS_SCRIPT_URL;
const APPS_SCRIPT_SECRET = CONFIG.APPS_SCRIPT_SECRET;

// Cache references to the form and its critical fields so we can read user input later.
const expenseForm = document.getElementById('expense-form');
const amountInput = document.getElementById('expense-amount');
const descriptionInput = document.getElementById('expense-description');
const categorySelect = document.getElementById('expense-category');

// Table body where new expense entries are rendered for the user.
const logTableBody = document.querySelector('#expense-log tbody');

// Only run the expense logic if all the required DOM elements actually exist.
if (
  expenseForm &&
  amountInput &&
  descriptionInput &&
  categorySelect &&
  logTableBody
) {
  // Formatter that turns raw numbers into localized currency strings.
  const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'NTD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Formatter that outputs readable dates (e.g. "Apr 19, 2026").
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Grab the submit button so we can show loading state and restore its default text later.
  const submitButton = expenseForm.querySelector('[type="submit"]');
  const submitButtonDefaultText = submitButton ? submitButton.textContent : '';

  // Handle the expense form submission and send data to Google Sheets via Apps Script.
  expenseForm.addEventListener('submit', async (event) => {
    // Keep the browser from performing its normal form submit + page refresh.
    event.preventDefault();

    // Let the browser display any native validation messages before continuing.
    if (!expenseForm.reportValidity()) {
      return;
    }

    // Parse the amount string into a real number; bail if the value is not valid.
    const amount = Number.parseFloat(amountInput.value);
    if (!Number.isFinite(amount)) {
      return;
    }

    // Pull the trimmed description text and the human-readable category label.
    const description = descriptionInput.value.trim();
    const categoryLabel = categorySelect.selectedOptions[0]
      ? categorySelect.selectedOptions[0].textContent
      : categorySelect.value;

    // Capture the time the entry is submitted to keep UI and sheet timestamps aligned.
    const submissionDate = new Date();

    // Assemble the payload the Apps Script expects, including the shared secret.
    const payload = {
      date: submissionDate.toISOString(),
      category: categoryLabel,
      description,
      amount,
      secret: APPS_SCRIPT_SECRET,
    };

    try {
      // Disable the button and show feedback while we talk to the backend.
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';
      }

      // Send the expense data to the Apps Script Web App as JSON without extra headers so it stays a simple POST.
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Attempt to parse the JSON response; fall back to an empty object on failure.
      const result = await response.json().catch(() => ({}));

      // Treat any HTTP error or non-"ok" status from the script as a failure.
      if (!response.ok || result.status !== 'ok') {
        throw new Error(result.message || `Request failed with status ${response.status}`);
      }

      // Build a new table row to reflect the expense back to the user immediately.
      const row = document.createElement('tr');

      // Column 1 displays the date the entry was submitted.
      const dateCell = document.createElement('td');
      dateCell.textContent = dateFormatter.format(submissionDate);
      row.appendChild(dateCell);

      // Column 2 shows the human-readable category name.
      const categoryCell = document.createElement('td');
      categoryCell.textContent = categoryLabel;
      row.appendChild(categoryCell);

      // Column 3 stores the user-provided description of the expense.
      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = description;
      row.appendChild(descriptionCell);

      // Column 4 holds the monetary amount, formatted as currency and right aligned.
      const amountCell = document.createElement('td');
      amountCell.className = 'amount-col';
      amountCell.textContent = currencyFormatter.format(amount);
      row.appendChild(amountCell);

      // Remove the placeholder "No expenses" row once we have a real entry to display.
      const emptyRow = logTableBody.querySelector('.empty');
      if (emptyRow) {
        emptyRow.remove();
      }

      // Place the most recent entry at the top of the table for quick visibility.
      logTableBody.prepend(row);

      // Clear the form inputs and focus the amount field to speed up repeat entry.
      expenseForm.reset();
      amountInput.focus();
    } catch (error) {
      // Log the failure for debugging and alert the user that saving was unsuccessful.
      console.error('Failed to save expense', error);
      alert('Unable to save expense right now. Please try again in a moment.');
    } finally {
      // Restore the button to its original state regardless of success or failure.
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButtonDefaultText;
      }
    }
  });
}




