import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, Lock, TrendingUp } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

export const WalletConnection: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Wallet Connected</p>
              <p className="text-xs text-gray-500 font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => disconnect()}
            className="border-gray-300 hover:bg-gray-50"
          >
            Disconnect
          </Button>
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">Secure Bond Trading Enabled</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 shadow-lg p-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gray-100 animate-pulse">
            <Lock className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Connect Wallet for Bond Trading
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Connect your wallet to participate in confidential bond allocations and secure tokenized investments.
          </p>
        </div>
        
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button 
                        onClick={openConnectModal}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2"
                      >
                        <div className="flex items-center space-x-2">
                          <Wallet className="w-4 h-4" />
                          <span>Connect Wallet</span>
                        </div>
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button 
                        onClick={openChainModal}
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-2"
                      >
                        Wrong network
                      </Button>
                    );
                  }

                  return (
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={openAccountModal}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-2"
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </Button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </Card>
  );
};
