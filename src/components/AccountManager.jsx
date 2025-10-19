import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Eye, EyeOff, Lock } from 'lucide-react'
import './AccountManager.css'

function AccountManager({ onClose }) {
    const [accounts, setAccounts] = useState([])
    const [newAccount, setNewAccount] = useState({ name: '', number: '' })
    const [visibleAccounts, setVisibleAccounts] = useState(new Set())

    useEffect(() => {
        // Load accounts from localStorage
        const stored = localStorage.getItem('finance_accounts')
        if (stored) {
            try {
                const decrypted = atob(stored) // Simple base64 encoding for local storage
                setAccounts(JSON.parse(decrypted))
            } catch (e) {
                console.error('Error loading accounts:', e)
            }
        }
    }, [])

    const saveAccounts = (updatedAccounts) => {
        // Simple base64 encoding for localStorage
        const encrypted = btoa(JSON.stringify(updatedAccounts))
        localStorage.setItem('finance_accounts', encrypted)
        setAccounts(updatedAccounts)
    }

    const addAccount = () => {
        if (newAccount.name && newAccount.number) {
            const updated = [...accounts, { ...newAccount, id: Date.now() }]
            saveAccounts(updated)
            setNewAccount({ name: '', number: '' })
        }
    }

    const deleteAccount = (id) => {
        const updated = accounts.filter(acc => acc.id !== id)
        saveAccounts(updated)
        setVisibleAccounts(prev => {
            const newSet = new Set(prev)
            newSet.delete(id)
            return newSet
        })
    }

    const toggleVisibility = (id) => {
        setVisibleAccounts(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const maskAccountNumber = (number) => {
        if (number.length <= 4) return number
        return '••••' + number.slice(-4)
    }

    return (
        <div className="account-manager-overlay" onClick={onClose}>
            <div className="account-manager" onClick={(e) => e.stopPropagation()}>
                <div className="manager-header">
                    <h2>🔐 Account Manager</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="security-notice">
                    <Lock size={20} />
                    <p>Account numbers are stored locally in your browser using base64 encoding. For maximum security, avoid storing sensitive information on shared computers.</p>
                </div>

                <div className="add-account-form">
                    <h3>Add New Account</h3>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Account Name (e.g., Chase Checking)"
                            value={newAccount.name}
                            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Account Number"
                            value={newAccount.number}
                            onChange={(e) => setNewAccount({ ...newAccount, number: e.target.value })}
                        />
                        <button className="add-btn" onClick={addAccount}>
                            <Plus size={20} />
                            Add
                        </button>
                    </div>
                </div>

                <div className="accounts-list">
                    <h3>Saved Accounts</h3>
                    {accounts.length === 0 ? (
                        <p className="empty-state">No accounts saved yet. Add one above!</p>
                    ) : (
                        <div className="accounts-grid">
                            {accounts.map((account) => (
                                <div key={account.id} className="account-item">
                                    <div className="account-info">
                                        <h4>{account.name}</h4>
                                        <p className="account-number">
                                            {visibleAccounts.has(account.id)
                                                ? account.number
                                                : maskAccountNumber(account.number)
                                            }
                                        </p>
                                    </div>
                                    <div className="account-actions">
                                        <button
                                            className="visibility-btn"
                                            onClick={() => toggleVisibility(account.id)}
                                            title={visibleAccounts.has(account.id) ? 'Hide' : 'Show'}
                                        >
                                            {visibleAccounts.has(account.id) ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteAccount(account.id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AccountManager

