# 🚀 Quick Start Guide

## Installation & Running

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open your browser to `http://localhost:5173`

## First Time Setup

1. **Test with Sample Data**
   - Use the included `sample-transactions.csv` file to test the app
   - Drag it onto the upload area or click to select it

2. **Prepare Your Own CSV**
   - Export transactions from your bank (most banks offer CSV export)
   - Ensure it has columns for: Date, Description, Amount, Category (optional)
   - Positive amounts = credits (money in)
   - Negative amounts = debits (money out)

3. **Store Account Numbers (Optional)**
   - Click "Manage Accounts" in the header
   - Add your account names and numbers
   - They're stored securely in your browser's localStorage
   - Toggle visibility with the eye icon

## Tips

- **CSV Format**: The app auto-detects common CSV formats from major banks
- **Categories**: If your CSV doesn't have categories, transactions will be marked as "Uncategorized"
- **Privacy**: Everything runs locally - no data leaves your computer
- **Multiple Files**: Click "Load New File" to analyze different CSV files
- **Browser Storage**: Account numbers persist between sessions in the same browser

## Troubleshooting

**CSV not loading?**
- Check that it's a valid CSV file (not Excel .xlsx)
- Ensure it has headers in the first row
- Try the sample-transactions.csv file first

**Charts not showing?**
- Make sure your CSV has transaction data
- Check that amounts are numbers (not text)

**Account numbers not saving?**
- Ensure your browser allows localStorage
- Check that you're not in private/incognito mode

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` folder. You can serve them with any static file server.

