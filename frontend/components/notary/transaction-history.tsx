'use client'

import React, { useState, useMemo } from 'react'
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ExternalLink, 
  Filter,
  Calendar,
  Hash,
  Trash2,
  Download,
  Search,
  ArrowUpDown,
  Clock,
  Fuel
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useNotaryContract, type NotarizeTransaction } from '@/hooks/use-notary-contract'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'

interface TransactionHistoryProps {
  className?: string
}

type SortField = 'timestamp' | 'fileName' | 'status' | 'blockNumber'
type SortDirection = 'asc' | 'desc'
type StatusFilter = 'all' | 'pending' | 'confirming' | 'confirmed' | 'failed'

export function TransactionHistory({ className }: TransactionHistoryProps) {
  const { isConnected } = useAccount()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortField, setSortField] = useState<SortField>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const {
    transactions,
    transactionStats,
    removeTransaction,
    clearTransactions,
  } = useNotaryContract()

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.txHash?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter)
    }

    // Sort transactions
    return filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'timestamp':
          aValue = a.timestamp
          bValue = b.timestamp
          break
        case 'fileName':
          aValue = a.fileName.toLowerCase()
          bValue = b.fileName.toLowerCase()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'blockNumber':
          aValue = a.blockNumber || 0n
          bValue = b.blockNumber || 0n
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [transactions, searchTerm, statusFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleExportTransactions = () => {
    if (filteredAndSortedTransactions.length === 0) {
      toast.error('No transactions to export')
      return
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalTransactions: filteredAndSortedTransactions.length,
      filters: {
        searchTerm,
        statusFilter,
        sortField,
        sortDirection,
      },
      transactions: filteredAndSortedTransactions.map(tx => ({
        id: tx.id,
        fileName: tx.fileName,
        hash: tx.hash,
        status: tx.status,
        txHash: tx.txHash,
        blockNumber: tx.blockNumber?.toString(),
        gasUsed: tx.gasUsed?.toString(),
        explorerUrl: tx.explorerUrl,
        error: tx.error,
        timestamp: new Date(tx.timestamp).toISOString(),
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notarization-history-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Transaction history exported')
  }

  const getStatusIcon = (status: NotarizeTransaction['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'confirming':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: NotarizeTransaction['status']) => {
    const variants = {
      pending: 'bg-blue-100 text-blue-800',
      confirming: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    }

    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (!isConnected) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert>
            <History className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to view transaction history
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`legal-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View and manage your blockchain notarization transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 mx-auto mb-4 text-legal-secondary" />
            <h3 className="text-lg font-medium text-legal-dark-text mb-2">
              No Transactions Yet
            </h3>
            <p className="text-legal-secondary">
              Start notarizing documents to see your transaction history here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-legal-beige/30 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-legal-dark-text">{transactionStats.total}</div>
                <div className="text-xs text-legal-secondary">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{transactionStats.confirmed}</div>
                <div className="text-xs text-legal-secondary">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">{transactionStats.confirming}</div>
                <div className="text-xs text-legal-secondary">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{transactionStats.failed}</div>
                <div className="text-xs text-legal-secondary">Failed</div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by filename, hash, or transaction..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirming">Confirming</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportTransactions}
                  disabled={filteredAndSortedTransactions.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearTransactions}
                  disabled={transactions.length === 0}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Transactions Table */}
            {filteredAndSortedTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-8 w-8 mx-auto mb-2 text-legal-secondary" />
                <p className="text-legal-secondary">No transactions match your filters</p>
              </div>
            ) : (
              <div className="border border-legal-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('fileName')}
                          className="h-8 p-0 font-medium hover:bg-transparent"
                        >
                          File Name
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('status')}
                          className="h-8 p-0 font-medium hover:bg-transparent"
                        >
                          Status
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('timestamp')}
                          className="h-8 p-0 font-medium hover:bg-transparent"
                        >
                          Date
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('blockNumber')}
                          className="h-8 p-0 font-medium hover:bg-transparent"
                        >
                          Block
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(transaction.status)}
                            <div>
                              <div className="font-medium text-sm">{transaction.fileName}</div>
                              <div className="text-xs text-legal-secondary font-mono">
                                {transaction.hash.slice(0, 8)}...{transaction.hash.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-legal-secondary">
                            {new Date(transaction.timestamp).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {transaction.blockNumber ? (
                            <div className="text-sm font-mono">
                              {transaction.blockNumber.toString()}
                            </div>
                          ) : (
                            <div className="text-xs text-legal-secondary">-</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {transaction.explorerUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-8 w-8 p-0"
                              >
                                <a
                                  href={transaction.explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="View on Explorer"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTransaction(transaction.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              title="Remove Transaction"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 