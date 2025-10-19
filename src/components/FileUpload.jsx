import { useState, useRef } from 'react'
import Papa from 'papaparse'
import { Upload, FileText } from 'lucide-react'
import CreditPayments from '../types/CreditPayments'
import Required from '../types/Required'
import Subscriptions from '../types/Subscriptions'
import './FileUpload.css'

function FileUpload({ onDataLoaded }) {
    const [isDragging, setIsDragging] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState(null)
    const fileInputRef = useRef(null)

    const processFile = (file) => {
        if (!file) return

        if (!file.name.endsWith('.csv')) {
            setError('Please upload a CSV file')
            return
        }

        setIsProcessing(true)
        setError(null)

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data && results.data.length > 0) {
                    // Process the data
                    const processedData = results.data.map((row, index) => {
                        // Try to detect common CSV formats
                        // Handle separate Debit/Credit columns
                        let amount = 0
                        if (row.Debit || row.debit) {
                            amount = parseFloat(row.Debit || row.debit)
                        } else if (row.Credit || row.credit) {
                            amount = -parseFloat(row.Credit || row.credit)
                        } else {
                            amount = parseFloat(
                                row.Amount || row.amount ||
                                row['Transaction Amount'] ||
                                0
                            )
                        }

                        const description =
                            row.Description || row.description ||
                            row.Merchant || row.merchant ||
                            row.Name || row.name ||
                            row['Transaction Description'] ||
                            'Unknown'

                        const date =
                            row.Date || row.date ||
                            row['Transaction Date'] ||
                            row['Post Date'] ||
                            new Date().toISOString()

                        let category =
                            row.Category || row.category ||
                            row.Type || row.type ||
                            'Uncategorized'

                        // Check if this is a credit card payment using the enum (wildcard match)
                        const isCreditCard = Object.values(CreditPayments).some(payment => {
                            const match = description.toUpperCase().includes(payment.toUpperCase())
                            if (match) console.log(`💳 Credit Card Match: "${description}" contains "${payment}"`)
                            return match
                        })

                        // Check if this is a required payment using the enum (wildcard match)
                        const isRequired = Object.values(Required).some(payment => {
                            const match = description.toUpperCase().includes(payment.toUpperCase())
                            if (match) console.log(`⭐ Required Match: "${description}" contains "${payment}"`)
                            return match
                        })

                        // Check if this is a subscription using the enum (wildcard match)
                        const isSubscription = Object.values(Subscriptions).some(payment => {
                            const match = description.toUpperCase().includes(payment.toUpperCase())
                            if (match) console.log(`📺 Subscription Match: "${description}" contains "${payment}"`)
                            return match
                        })

                        // Check if this is a payroll payment (wildcard match)
                        const isPayroll = description.toUpperCase().includes('PAYROLL')
                        if (isPayroll) console.log(`💼 Payroll Match: "${description}" contains "PAYROLL"`)

                        // Check if this is a transfer (wildcard match)
                        const isTransfer = description.toUpperCase().includes('TRANSFER')
                        if (isTransfer) console.log(`🔄 Transfer Match: "${description}" contains "TRANSFER"`)

                        // Override category based on enum matches
                        if (isTransfer) {
                            category = 'Transfer'
                        } else if (isPayroll) {
                            category = 'Payroll'
                        } else if (isCreditCard) {
                            category = 'Credit Card Payment'
                        } else if (isRequired) {
                            category = 'Required Payment'
                        } else if (isSubscription) {
                            category = 'Subscription'
                        }

                        const isCredit = amount < 0  // Negative amounts are credits (money in)

                        // Debug logging
                        console.log(`Transaction: "${description}" | Amount: ${amount} | IsCredit: ${isCredit}`)

                        return {
                            id: index,
                            date: date,
                            description: description,
                            amount: amount,
                            category: category,
                            isCredit: isCredit,
                            isCreditCard: isCreditCard,
                            isRequired: isRequired,
                            isSubscription: isSubscription,
                            isPayroll: isPayroll,
                            isTransfer: isTransfer
                        }
                    })

                    onDataLoaded(processedData)
                } else {
                    setError('No data found in CSV file')
                }
                setIsProcessing(false)
            },
            error: (error) => {
                setError(`Error parsing CSV: ${error.message}`)
                setIsProcessing(false)
            }
        })
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        processFile(file)
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        processFile(file)
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="file-upload-container">
            <div
                className={`drop-zone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                {isProcessing ? (
                    <div className="processing-state">
                        <div className="spinner"></div>
                        <p>Processing your file...</p>
                    </div>
                ) : (
                    <>
                        <Upload size={64} className="upload-icon" />
                        <h2>Drop your CSV file here</h2>
                        <p>or click to browse</p>
                        <div className="file-info">
                            <FileText size={20} />
                            <span>Accepts .csv files</span>
                        </div>
                    </>
                )}
            </div>

            {error && (
                <div className="error-message">
                    <p>⚠️ {error}</p>
                </div>
            )}

            <div className="info-box">
                <h3>📊 Expected CSV Format</h3>
                <p>Your CSV should contain columns like:</p>
                <ul>
                    <li><strong>Date</strong> - Transaction date</li>
                    <li><strong>Description</strong> - Transaction description or merchant</li>
                    <li><strong>Amount</strong> - Transaction amount (positive for credits, negative for debits)</li>
                    <li><strong>Category</strong> - (Optional) Transaction category</li>
                </ul>
                <p className="note">The app will try to auto-detect your CSV format!</p>
            </div>
        </div>
    )
}

export default FileUpload

