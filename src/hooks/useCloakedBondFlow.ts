import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { contractAddress, contractABI } from '@/lib/contracts';

export const useCloakedBondFlow = () => {
  const { address } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const createBondTranche = async (
    name: string,
    description: string,
    totalAmount: number,
    minimumInvestment: number,
    maximumInvestment: number,
    interestRate: number,
    maturityPeriod: number
  ) => {
    try {
      const hash = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'createBondTranche',
        args: [
          name,
          description,
          totalAmount,
          minimumInvestment,
          maximumInvestment,
          interestRate,
          maturityPeriod
        ],
      });
      return hash;
    } catch (error) {
      console.error('Error creating bond tranche:', error);
      throw error;
    }
  };

  const allocateBond = async (trancheId: number, amount: number) => {
    try {
      const hash = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'allocateBond',
        args: [trancheId, amount],
        value: parseEther(amount.toString()),
      });
      return hash;
    } catch (error) {
      console.error('Error allocating bond:', error);
      throw error;
    }
  };

  const issueCertificate = async (allocationId: number, bondAmount: number, interestRate: number) => {
    try {
      const hash = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'issueCertificate',
        args: [allocationId, bondAmount, interestRate],
      });
      return hash;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      throw error;
    }
  };

  const redeemBond = async (certificateId: number) => {
    try {
      const hash = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'redeemBond',
        args: [certificateId],
      });
      return hash;
    } catch (error) {
      console.error('Error redeeming bond:', error);
      throw error;
    }
  };

  return {
    createBondTranche,
    allocateBond,
    issueCertificate,
    redeemBond,
    isLoading: isPending,
  };
};

export const useBondTranche = (trancheId: number) => {
  const { data: trancheInfo, isLoading } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getTrancheInfo',
    args: [trancheId],
  });

  return {
    trancheInfo,
    isLoading,
  };
};

export const useBondAllocation = (allocationId: number) => {
  const { data: allocationInfo, isLoading } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getAllocationInfo',
    args: [allocationId],
  });

  return {
    allocationInfo,
    isLoading,
  };
};

export const useCertificate = (certificateId: number) => {
  const { data: certificateInfo, isLoading } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getCertificateInfo',
    args: [certificateId],
  });

  return {
    certificateInfo,
    isLoading,
  };
};

export const useInvestorProfile = (investorAddress: string) => {
  const { data: profile, isLoading } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getInvestorProfile',
    args: [investorAddress],
  });

  return {
    profile,
    isLoading,
  };
};
