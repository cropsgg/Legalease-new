'use client'

import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, LogOut, AlertCircle } from 'lucide-react'
import { NETWORK_NAMES, isSupportedChain } from '@/lib/blockchain'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()

  // Check if current chain is supported
  const isChainSupported = chain ? isSupportedChain(chain.id) : false

  if (isConnected && address) {
    return (
      <Card className="legal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            Your wallet is connected and ready for document notarization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Address:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {address.slice(0, 6)}...{address.slice(-4)}
              </Badge>
            </div>
            
            {chain && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network:</span>
                <Badge 
                  variant={isChainSupported ? "default" : "destructive"}
                  className="text-xs"
                >
                  {NETWORK_NAMES[chain.id as keyof typeof NETWORK_NAMES] || chain.name}
                </Badge>
              </div>
            )}
          </div>

          {!isChainSupported && chain && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please switch to a supported network: Base, Base Goerli, or Base Sepolia
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={() => disconnect()} 
            variant="outline"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="legal-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to notarize documents on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'Failed to connect wallet'}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              variant="outline"
              className="w-full justify-start"
            >
              {getConnectorIcon(connector.name)}
              <span className="ml-2">
                {isPending ? 'Connecting...' : `Connect ${connector.name}`}
              </span>
            </Button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Supported networks:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Base Mainnet</li>
            <li>Base Goerli (Testnet)</li>
            <li>Base Sepolia (Testnet)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function getConnectorIcon(name: string) {
  // You can add specific icons for different wallet types
  switch (name.toLowerCase()) {
    case 'coinbase wallet':
      return <div className="w-4 h-4 bg-blue-500 rounded-full" />
    case 'walletconnect':
      return <div className="w-4 h-4 bg-blue-400 rounded-full" />
    case 'metamask':
    case 'injected':
    default:
      return <Wallet className="h-4 w-4" />
  }
} 