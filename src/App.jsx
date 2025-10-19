import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Dashboard from './components/Dashboard'
import AccountManager from './components/AccountManager'
import './App.css'

function App() {
    const [transactions, setTransactions] = useState([])
    const [showAccountManager, setShowAccountManager] = useState(false)

    const handleDataLoaded = (data) => {
        setTransactions(data)
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>💰 Finance Tracker</h1>
                <button
                    className="account-btn"
                    onClick={() => setShowAccountManager(!showAccountManager)}
                >
                    🔐 Manage Accounts
                </button>
            </header>

            {showAccountManager && (
                <AccountManager onClose={() => setShowAccountManager(false)} />
            )}

            {transactions.length === 0 ? (
                <FileUpload onDataLoaded={handleDataLoaded} />
            ) : (
                <Dashboard
                    transactions={transactions}
                    onReset={() => setTransactions([])}
                />
            )}
        </div>
    )
}

export default App

