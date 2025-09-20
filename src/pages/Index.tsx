import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletConnection } from '@/components/WalletConnection';
import { useCloakedBondFlow } from '@/hooks/useCloakedBondFlow';
import { useAccount } from 'wagmi';
import { 
  Plus, 
  DollarSign, 
  FileText,
  Building,
  Users,
  Shield,
  Clock,
  Percent
} from 'lucide-react';

interface BondTranche {
  id: number;
  name: string;
  description: string;
  totalAmount: number;
  allocatedAmount: number;
  minimumInvestment: number;
  maximumInvestment: number;
  interestRate: number;
  maturityPeriod: number;
  isActive: boolean;
  isFullyAllocated: boolean;
  issuer: string;
  creationTime: number;
  maturityTime: number;
  isEncrypted: boolean;
}

const Index = () => {
  const { address, isConnected } = useAccount();
  const { createBondTranche, allocateBond, issueCertificate, isLoading } = useCloakedBondFlow();
  const [selectedTranche, setSelectedTranche] = useState<BondTranche | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTranche, setNewTranche] = useState({
    name: '',
    description: '',
    totalAmount: '',
    minimumInvestment: '',
    maximumInvestment: '',
    interestRate: '',
    maturityPeriod: '',
  });

  // Mock data for demonstration
  const bondTranches: BondTranche[] = [
    {
      id: 1,
      name: "Senior Tranche A",
      description: "High-grade corporate bonds with AAA rating",
      totalAmount: 50000000,
      allocatedAmount: 25000000,
      minimumInvestment: 100000,
      maximumInvestment: 5000000,
      interestRate: 4.25,
      maturityPeriod: 365,
      isActive: true,
      isFullyAllocated: false,
      issuer: "0x1234...5678",
      creationTime: Date.now() - 86400000,
      maturityTime: Date.now() + 31536000000,
      isEncrypted: true,
    },
    {
      id: 2,
      name: "Mezzanine Tranche B",
      description: "Medium-risk bonds with competitive returns",
      totalAmount: 30000000,
      allocatedAmount: 30000000,
      minimumInvestment: 50000,
      maximumInvestment: 2000000,
      interestRate: 5.75,
      maturityPeriod: 730,
      isActive: true,
      isFullyAllocated: true,
      issuer: "0x8765...4321",
      creationTime: Date.now() - 172800000,
      maturityTime: Date.now() + 63072000000,
      isEncrypted: true,
    },
    {
      id: 3,
      name: "Subordinate Tranche C",
      description: "Higher yield bonds for sophisticated investors",
      totalAmount: 20000000,
      allocatedAmount: 8000000,
      minimumInvestment: 25000,
      maximumInvestment: 1000000,
      interestRate: 7.50,
      maturityPeriod: 1095,
      isActive: true,
      isFullyAllocated: false,
      issuer: "0xABCD...EFGH",
      creationTime: Date.now() - 259200000,
      maturityTime: Date.now() + 94608000000,
      isEncrypted: true,
    },
  ];

  const handleCreateTranche = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    try {
      await createBondTranche(
        newTranche.name,
        newTranche.description,
        parseFloat(newTranche.totalAmount),
        parseFloat(newTranche.minimumInvestment),
        parseFloat(newTranche.maximumInvestment),
        parseFloat(newTranche.interestRate),
        parseFloat(newTranche.maturityPeriod) * 24 * 60 * 60
      );
      setShowCreateForm(false);
      setNewTranche({
        name: '',
        description: '',
        totalAmount: '',
        minimumInvestment: '',
        maximumInvestment: '',
        interestRate: '',
        maturityPeriod: '',
      });
    } catch (error) {
      console.error('Error creating tranche:', error);
    }
  };

  const handleAllocateBond = async (tranche: BondTranche) => {
    if (!isConnected || !investmentAmount) return;

    try {
      await allocateBond(tranche.id, parseFloat(investmentAmount));
      setInvestmentAmount('');
      setSelectedTranche(null);
    } catch (error) {
      console.error('Error allocating bond:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cloaked Bond Flow</h1>
                <p className="text-sm text-gray-600">FHE-Encrypted Bond Trading</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-blue-200 text-blue-800 bg-blue-50">
                <Building className="w-3 h-3 mr-1" />
                FHE Encrypted
              </Badge>
              <div className="flex-shrink-0">
                <WalletConnection />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="tranches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tranches">Bond Tranches</TabsTrigger>
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          {/* Bond Tranches Tab */}
          <TabsContent value="tranches" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available Bond Tranches</h2>
                <p className="text-gray-600">Invest in encrypted bond allocations with institutional-grade security</p>
              </div>
              {isConnected && (
                <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Tranche
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Bond Tranche</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateTranche} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Tranche Name</label>
                          <Input
                            value={newTranche.name}
                            onChange={(e) => setNewTranche({...newTranche, name: e.target.value})}
                            placeholder="e.g., Senior Tranche A"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Interest Rate (%)</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newTranche.interestRate}
                            onChange={(e) => setNewTranche({...newTranche, interestRate: e.target.value})}
                            placeholder="e.g., 4.25"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Total Amount (USD)</label>
                          <Input
                            type="number"
                            value={newTranche.totalAmount}
                            onChange={(e) => setNewTranche({...newTranche, totalAmount: e.target.value})}
                            placeholder="e.g., 50000000"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Maturity Period (Days)</label>
                          <Input
                            type="number"
                            value={newTranche.maturityPeriod}
                            onChange={(e) => setNewTranche({...newTranche, maturityPeriod: e.target.value})}
                            placeholder="e.g., 365"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Minimum Investment (USD)</label>
                          <Input
                            type="number"
                            value={newTranche.minimumInvestment}
                            onChange={(e) => setNewTranche({...newTranche, minimumInvestment: e.target.value})}
                            placeholder="e.g., 100000"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Maximum Investment (USD)</label>
                          <Input
                            type="number"
                            value={newTranche.maximumInvestment}
                            onChange={(e) => setNewTranche({...newTranche, maximumInvestment: e.target.value})}
                            placeholder="e.g., 5000000"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <Input
                          value={newTranche.description}
                          onChange={(e) => setNewTranche({...newTranche, description: e.target.value})}
                          placeholder="Describe the bond tranche..."
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreateForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          {isLoading ? 'Creating...' : 'Create Tranche'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bondTranches.map((tranche) => (
                <Card key={tranche.id} className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{tranche.name}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {tranche.isEncrypted && (
                          <Badge variant="outline" className="border-green-200 text-green-800 bg-green-50">
                            <Building className="w-3 h-3 mr-1" />
                            Encrypted
                          </Badge>
                        )}
                        {tranche.isFullyAllocated && (
                          <Badge variant="outline" className="border-blue-200 text-blue-800 bg-blue-50">
                            <Users className="w-3 h-3 mr-1" />
                            Fully Allocated
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{tranche.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Allocation Progress</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${(tranche.allocatedAmount / 1000000).toFixed(1)}M / ${(tranche.totalAmount / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <Progress 
                        value={(tranche.allocatedAmount / tranche.totalAmount) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Percent className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-lg font-semibold text-gray-900">{tranche.interestRate}%</span>
                        </div>
                        <p className="text-xs text-gray-600">Interest Rate</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="w-4 h-4 text-blue-600 mr-1" />
                          <span className="text-lg font-semibold text-gray-900">{tranche.maturityPeriod}</span>
                        </div>
                        <p className="text-xs text-gray-600">Days to Maturity</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Min Investment:</span>
                        <span className="font-medium">${(tranche.minimumInvestment / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Max Investment:</span>
                        <span className="font-medium">${(tranche.maximumInvestment / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>

                    {isConnected && !tranche.isFullyAllocated && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            onClick={() => setSelectedTranche(tranche)}
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Invest Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invest in {tranche.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Investment Amount (USD)</label>
                              <Input
                                type="number"
                                value={investmentAmount}
                                onChange={(e) => setInvestmentAmount(e.target.value)}
                                placeholder="Enter investment amount"
                                min={tranche.minimumInvestment}
                                max={tranche.maximumInvestment}
                              />
                            </div>
                            <div className="flex justify-end space-x-3">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedTranche(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleAllocateBond(tranche)}
                                disabled={isLoading || !investmentAmount}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                              >
                                {isLoading ? 'Processing...' : 'Invest'}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Portfolio</h2>
              <p className="text-gray-600">Track your encrypted bond investments and performance</p>
            </div>
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg p-6">
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investments Yet</h3>
                <p className="text-gray-600 mb-4">Start investing in bond tranches to build your portfolio</p>
                {!isConnected && (
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Connect Wallet to Start
                  </Button>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bond Certificates</h2>
              <p className="text-gray-600">Manage your encrypted bond certificates and redemptions</p>
            </div>
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg p-6">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
                <p className="text-gray-600 mb-4">Certificates will appear here after successful investments</p>
                {!isConnected && (
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Connect Wallet to View
                  </Button>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
// Force Vercel to use latest commit Sat Sep 20 21:35:19 CST 2025
