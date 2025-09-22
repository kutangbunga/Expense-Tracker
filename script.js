// Expense Tracker form wiring logic.
// The goal: watch the form, collect the user input, and render it into the log table.
const expenseForm = document.getElementById('expense-form');
const amountInput = document.getElementById('expense-amount');
const descriptionInput = document.getElementById('expense-description');
const categorySelect = document.getElementById('expense-category');
const logTableBody = document.querySelector('#expense-log tbody');

// Only proceed if every critical DOM node is present.
if (
  expenseForm &&
  amountInput &&
  descriptionInput &&
  categorySelect &&
  logTableBody
) {
  // Formatter that turns raw numbers into locale-aware dollars (e.g. 12.5 -> $12.50).
  const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Formatter that prints dates like "Apr 19, 2026" using the visitor's locale.
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Listen for the Add Expense form submission.
  expenseForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Stop the browser from refreshing the page.

    // Trigger built-in validation so required fields show their messages if empty.
    if (!expenseForm.reportValidity()) {
      return;
    }

    // Convert the amount from string -> number; guard against bad values ("", NaN).
    const amount = Number.parseFloat(amountInput.value);
    if (!Number.isFinite(amount)) {
      return;
    }

    // Clean up whitespace and figure out which category label the user selected.
    const description = descriptionInput.value.trim();
    const categoryLabel = categorySelect.selectedOptions[0]
      ? categorySelect.selectedOptions[0].textContent
      : categorySelect.value;

    // Build the new table row entirely in memory before inserting into the DOM.
    const row = document.createElement('tr');

    // Column 1: current date (users typically want to know when the expense occurred).
    const dateCell = document.createElement('td');
    dateCell.textContent = dateFormatter.format(new Date());
    row.appendChild(dateCell);

    // Column 2: category (stored as the option label so it is human-friendly).
    const categoryCell = document.createElement('td');
    categoryCell.textContent = categoryLabel;
    row.appendChild(categoryCell);

    // Column 3: user description (e.g. "Grocery run").
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = description;
    row.appendChild(descriptionCell);

    // Column 4: amount formatted as currency and right-aligned via .amount-col.
    const amountCell = document.createElement('td');
    amountCell.className = 'amount-col';
    amountCell.textContent = currencyFormatter.format(amount);
    row.appendChild(amountCell);

    // Remove the placeholder "No expenses" row once we have real data to show.
    const emptyRow = logTableBody.querySelector('.empty');
    if (emptyRow) {
      emptyRow.remove();
    }

    // Insert the newest entry at the top so recent spending is easiest to spot.
    logTableBody.prepend(row);

    // Reset the form for the next entry and place focus back on the amount field.
    expenseForm.reset();
    amountInput.focus();
  });
}
