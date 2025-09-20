export const contractAddress = '0x0000000000000000000000000000000000000000'; // Placeholder - will be updated after deployment

export const contractABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "uint256", "name": "_totalAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "_minimumInvestment", "type": "uint256"},
      {"internalType": "uint256", "name": "_maximumInvestment", "type": "uint256"},
      {"internalType": "uint256", "name": "_interestRate", "type": "uint256"},
      {"internalType": "uint256", "name": "_maturityPeriod", "type": "uint256"}
    ],
    "name": "createBondTranche",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "trancheId", "type": "uint256"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "allocateBond",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "allocationId", "type": "uint256"},
      {"internalType": "uint256", "name": "bondAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "interestRate", "type": "uint256"}
    ],
    "name": "issueCertificate",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "certificateId", "type": "uint256"}],
    "name": "redeemBond",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "trancheId", "type": "uint256"}],
    "name": "getTrancheInfo",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint8", "name": "totalAmount", "type": "uint8"},
      {"internalType": "uint8", "name": "allocatedAmount", "type": "uint8"},
      {"internalType": "uint8", "name": "minimumInvestment", "type": "uint8"},
      {"internalType": "uint8", "name": "maximumInvestment", "type": "uint8"},
      {"internalType": "uint8", "name": "interestRate", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isFullyAllocated", "type": "bool"},
      {"internalType": "address", "name": "issuer", "type": "address"},
      {"internalType": "uint256", "name": "creationTime", "type": "uint256"},
      {"internalType": "uint256", "name": "maturityTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "allocationId", "type": "uint256"}],
    "name": "getAllocationInfo",
    "outputs": [
      {"internalType": "uint8", "name": "amount", "type": "uint8"},
      {"internalType": "uint8", "name": "trancheId", "type": "uint8"},
      {"internalType": "address", "name": "investor", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "bool", "name": "isEncrypted", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "certificateId", "type": "uint256"}],
    "name": "getCertificateInfo",
    "outputs": [
      {"internalType": "uint8", "name": "bondAmount", "type": "uint8"},
      {"internalType": "uint8", "name": "interestEarned", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isRedeemed", "type": "bool"},
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "issueDate", "type": "uint256"},
      {"internalType": "uint256", "name": "maturityDate", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "investor", "type": "address"}],
    "name": "getInvestorProfile",
    "outputs": [
      {"internalType": "uint8", "name": "totalInvested", "type": "uint8"},
      {"internalType": "uint8", "name": "reputationScore", "type": "uint8"},
      {"internalType": "uint8", "name": "riskTolerance", "type": "uint8"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "bool", "name": "isInstitutional", "type": "bool"},
      {"internalType": "uint256", "name": "joinDate", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
