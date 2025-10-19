# 💰 Finance Tracker

A beautiful, locally-running React application for tracking and visualizing your personal finances. Upload your transaction CSV files and get instant insights into your spending patterns!

## ✨ Features

- 📁 **CSV File Upload** - Drag & drop or select CSV files from your computer
- 📊 **Visual Analytics** - Beautiful charts showing spending by category
- 💳 **Credit/Debit Tracking** - Color-coded transactions (green for credits, pink for debits)
- 🔐 **Secure Account Storage** - Safely store account numbers locally in your browser
- 📈 **Financial Overview** - See total credits, debits, and net balance at a glance
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations

## 🚀 Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (typically `http://localhost:5173`)

### Usage

1. **Upload Your Data**: Drag and drop your CSV file or click to browse
2. **View Dashboard**: See your financial overview with colorful charts and breakdowns
3. **Manage Accounts**: Click "Manage Accounts" to securely store account numbers
4. **Load New Data**: Click "Load New File" to analyze different CSV files

## 📄 CSV Format

Your CSV file should contain the following columns (column names are flexible):

- **Date** - Transaction date (e.g., `2024-01-15`)
- **Description** - Transaction description or merchant name
- **Amount** - Transaction amount (positive for credits, negative for debits)
- **Category** - (Optional) Transaction category

### Example CSV:

```csv
Date,Description,Amount,Category
2024-01-15,Salary Deposit,3500.00,Income
2024-01-16,Grocery Store,-125.50,Groceries
2024-01-17,Gas Station,-45.00,Transportation
```

A sample CSV file (`sample-transactions.csv`) is included in the project for testing.

## 🔒 Security

- Account numbers are stored locally in your browser using localStorage with base64 encoding
- No data is sent to any external servers - everything runs locally
- CSV files are processed in-browser and never uploaded anywhere
- For maximum security, avoid using on shared computers

## 🛠️ Built With

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Recharts** - Beautiful, responsive charts
- **PapaParse** - CSV parsing
- **Lucide React** - Icon library

## 📱 Browser Support

Works in all modern browsers that support:
- ES6+
- LocalStorage
- File API

## 🎨 Color Scheme

- **Credits**: Green gradient (#43e97b → #38f9d7)
- **Debits**: Pink/Yellow gradient (#fa709a → #fee140)
- **Primary**: Purple gradient (#667eea → #764ba2)

## 📝 License

See LICENSE file for details.