import { useMemo } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Calendar, RefreshCw } from 'lucide-react'
import './Dashboard.css'

function Dashboard({ transactions, onReset }) {
    const stats = useMemo(() => {
        const totalCredits = transactions
            .filter(t => t.isCredit)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        const totalDebits = transactions
            .filter(t => !t.isCredit)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        const netBalance = totalCredits - totalDebits

        // Group by category
        const categoryTotals = {}
        transactions.forEach(t => {
            const cat = t.category || 'Uncategorized'
            if (!categoryTotals[cat]) {
                categoryTotals[cat] = { credits: 0, debits: 0 }
            }
            if (t.isCredit) {
                categoryTotals[cat].credits += Math.abs(t.amount)
            } else {
                categoryTotals[cat].debits += Math.abs(t.amount)
            }
        })

        const categoryData = Object.entries(categoryTotals).map(([name, values]) => ({
            name,
            credits: values.credits,
            debits: values.debits,
            total: values.debits // For pie chart, show debits
        }))

        return {
            totalCredits,
            totalDebits,
            netBalance,
            categoryData,
            transactionCount: transactions.length
        }
    }, [transactions])

    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0']

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value)
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>📈 Financial Overview</h2>
                <button className="reset-btn" onClick={onReset}>
                    <RefreshCw size={18} />
                    Load New File
                </button>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="card credit-card">
                    <div className="card-icon">
                        <TrendingUp size={32} />
                    </div>
                    <div className="card-content">
                        <h3>Total Credits</h3>
                        <p className="amount">{formatCurrency(stats.totalCredits)}</p>
                    </div>
                </div>

                <div className="card debit-card">
                    <div className="card-icon">
                        <TrendingDown size={32} />
                    </div>
                    <div className="card-content">
                        <h3>Total Debits</h3>
                        <p className="amount">{formatCurrency(stats.totalDebits)}</p>
                    </div>
                </div>

                <div className={`card balance-card ${stats.netBalance >= 0 ? 'positive' : 'negative'}`}>
                    <div className="card-icon">
                        <DollarSign size={32} />
                    </div>
                    <div className="card-content">
                        <h3>Net Balance</h3>
                        <p className="amount">{formatCurrency(stats.netBalance)}</p>
                    </div>
                </div>

                <div className="card info-card">
                    <div className="card-icon">
                        <Calendar size={32} />
                    </div>
                    <div className="card-content">
                        <h3>Transactions</h3>
                        <p className="amount">{stats.transactionCount}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-container">
                <div className="chart-card">
                    <h3>💸 Spending by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="total"
                            >
                                {stats.categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>📊 Credits vs Debits by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.categoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="credits" fill="#43e97b" name="Credits" />
                            <Bar dataKey="debits" fill="#fa709a" name="Debits" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transaction List */}
            <div className="transactions-list">
                <h3>📋 Recent Transactions</h3>
                <div className="transactions-table">
                    <div className="table-header">
                        <div>Date</div>
                        <div>Description</div>
                        <div>Category</div>
                        <div>Type</div>
                        <div>Amount</div>
                    </div>
                    {transactions.slice(0, 50).map((transaction) => {
                        const rowClasses = [
                            'table-row',
                            transaction.isCredit ? 'credit-row' : 'debit-row',
                            transaction.isTransfer ? 'transfer-row' : '',
                            transaction.isPayroll ? 'payroll-row' : '',
                            transaction.isCreditCard ? 'credit-card-row' : '',
                            transaction.isRequired ? 'required-row' : '',
                            transaction.isSubscription ? 'subscription-row' : ''
                        ].filter(Boolean).join(' ')

                        return (
                            <div
                                key={transaction.id}
                                className={rowClasses}
                            >
                                <div className="date-cell">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </div>
                                <div className="description-cell">
                                    {transaction.isTransfer && <span className="transfer-badge">🔄</span>}
                                    {transaction.isPayroll && <span className="payroll-badge">💼</span>}
                                    {transaction.isCreditCard && <span className="cc-badge">💳</span>}
                                    {transaction.isRequired && <span className="required-badge">⭐</span>}
                                    {transaction.isSubscription && <span className="subscription-badge">📺</span>}
                                    {transaction.description}
                                </div>
                                <div className="category-cell">
                                    <span className="category-badge">{transaction.category}</span>
                                </div>
                                <div className="type-cell">
                                    <span className={`type-badge ${transaction.isCredit ? 'credit-badge' : 'debit-badge'}`}>
                                        {transaction.isCredit ? '+ Credit' : '- Debit'}
                                    </span>
                                </div>
                                <div className={`amount-cell ${transaction.isCredit ? 'credit' : 'debit'}`}>
                                    {transaction.isCredit ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {transactions.length > 50 && (
                    <p className="showing-note">Showing first 50 of {transactions.length} transactions</p>
                )}
            </div>
        </div>
    )
}

export default Dashboard

