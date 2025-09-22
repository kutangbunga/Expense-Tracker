# Expense Tracker

A minimal, responsive **Expense Tracker** built with plain **HTML + CSS + JavaScript**.  
Add expenses via a form and see them instantly rendered into a log table—no frameworks, no build step.

---

## ✨ Features

- **Zero‑dependency**: Vanilla HTML/CSS/JS, works offline.
- **Clean UI**: Card layout, soft shadows, and responsive grid.
- **Fast entry**: Amount, Category, Description → **Add to log**.
- **Instant rendering**: New rows are inserted at the **top** of the table.
- **Locale‑aware formatting**: Dates and currency follow the user’s locale.
- **Accessible focus states**: Clear focus ring + smooth transitions.
- **Design tokens**: Theming via CSS custom properties (variables).

---

## 🚀 Quick Start

1. **Clone or download** this repository.
2. Open `index.html` in your browser.
   - (Optional) Use a local server for a nicer dev flow:
     ```bash
     # Python 3
     python -m http.server 5173
     # then visit http://localhost:5173
     ```

> No build tools required. Works out of the box.

---

## 📁 Project Structure

```
.
├── index.html      # Markup: app shell, form, table
├── index.css       # Styles: tokens, layout, theming, responsive
└── script.js       # Logic: form handling, DOM updates
```

---

## 🧠 How It Works (high level)

- **Form wiring**: `script.js` selects the form and critical inputs:
  - `#expense-amount` (number), `#expense-category` (select), `#expense-description` (text)
- **Submission flow**:
  1. Prevents default page refresh with `event.preventDefault()`.
  2. Triggers native validation via `form.reportValidity()`.
  3. Parses and validates **amount** (`Number.parseFloat` + `Number.isFinite`).
  4. Reads **category** label (human‑friendly `selectedOptions[0].textContent`).
  5. Builds a `<tr>` with **Date / Category / Description / Amount**.
  6. Removes the placeholder **“No expenses”** row if present.
  7. **Prepends** the new row to the table body (most recent first).
  8. Resets the form and focuses back on **Amount** for speedy entry.
- **Formatting**:
  - Currency: `Intl.NumberFormat` (style: `'currency'`, currency: `'NTD'`, 2 decimals)
  - Date: `Intl.DateTimeFormat` (e.g., `Apr 19, 2026`, locale‑aware)

---

## 🎨 Design & Theming

All key styles are driven by CSS variables in `:root` so you can theme quickly:

```css
:root {
  color-scheme: light;
  --bg: #f5f7fb;
  --surface: #ffffff;
  --surface-alt: #eef1f8;
  --border: #d8deeb;
  --text: #1f2742;
  --muted: #556080;
  --accent: #3d5afe;
  --accent-dark: #3148d2;
  --radius-lg: 18px;
  --radius-sm: 10px;
  --shadow-soft: 0 18px 40px -25px rgba(23, 42, 112, 0.35);
  --shadow-raised: 0 18px 45px -20px rgba(31, 58, 148, 0.23);
}
```

**Interaction polish**:

- Inputs & selects share styles and animate on focus:
  ```css
  transition: border 0.2s ease, box-shadow 0.2s ease;
  ```
- Buttons use a subtle lift on hover and compress on active.

**Responsive layout**:

- Two‑column form on wide screens → single column under `720px`.
- Table wraps in a scroll container on narrow screens.

---

## ♿ Accessibility Notes

- Semantic labels (`<label>` + `.field-label`) bind to inputs for screen readers.
- Visible, high‑contrast focus states on form controls.
- Hover highlight on table rows helps scanning.
- `reportValidity()` surfaces native validation UI/messages.

> Tip: You can improve keyboard nav further by adding `:focus-visible` styles and ARIA live regions for “row added” announcements.

---

## 🔧 Configuration Ideas

- **Currency**: To use a different currency, change the formatter in `script.js`:
  ```js
  const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "TWD", // e.g., "IDR", "USD", "TWD"
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  ```
- **Persist data**: Add `localStorage` (or IndexedDB) to save/restore the log.
- **Delete rows**: Add a fifth column with a “Remove” button per row.
- **Totals**: Compute per‑category and overall totals and show a summary bar.
- **Export**: Allow CSV/JSON export of the table contents.

---

## ✅ Definition of Done (current scope)

- [x] Inputs validate required values before insert.
- [x] New entries appear at the **top** of the log.
- [x] Dates/currency format via `Intl` APIs.
- [x] Clear focus styles and smooth transitions.
- [x] No external dependencies; runs by opening `index.html`.

---

## 🛣️ Roadmap (nice‑to‑haves)

- [ ] Persist entries to `localStorage`.
- [ ] Edit/Delete actions per row.
- [ ] Category filters and search.
- [ ] Dark mode (toggle or prefers‑color‑scheme).
- [ ] Totals and per‑category analytics.
- [ ] Unit tests for formatting and DOM insertions.

---

## 🧪 Browser Support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari).  
`Intl` APIs are widely supported; for very old browsers you may need polyfills.

---

## 🤝 Contributing

PRs welcome! Please keep changes small and focused.  
For bigger ideas, open an issue and we can discuss scope/UX.

---

## 📄 License

MIT — do whatever you want, just don’t hold me liable.
