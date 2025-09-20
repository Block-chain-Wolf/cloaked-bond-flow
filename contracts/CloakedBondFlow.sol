// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract CloakedBondFlow is SepoliaConfig {
    using FHE for *;
    
    struct BondTranche {
        euint32 trancheId;
        euint32 totalAmount;
        euint32 allocatedAmount;
        euint32 minimumInvestment;
        euint32 maximumInvestment;
        euint32 interestRate;
        euint32 maturityPeriod;
        bool isActive;
        bool isFullyAllocated;
        string name;
        string description;
        address issuer;
        uint256 creationTime;
        uint256 maturityTime;
    }
    
    struct BondAllocation {
        euint32 allocationId;
        euint32 amount;
        euint32 trancheId;
        address investor;
        uint256 timestamp;
        bool isEncrypted;
    }
    
    struct InvestorProfile {
        euint32 totalInvested;
        euint32 reputationScore;
        euint32 riskTolerance;
        bool isVerified;
        bool isInstitutional;
        address wallet;
        uint256 joinDate;
    }
    
    struct Certificate {
        euint32 certificateId;
        euint32 bondAmount;
        euint32 interestEarned;
        bool isActive;
        bool isRedeemed;
        address owner;
        uint256 issueDate;
        uint256 maturityDate;
    }
    
    mapping(uint256 => BondTranche) public bondTranches;
    mapping(uint256 => BondAllocation) public bondAllocations;
    mapping(address => InvestorProfile) public investorProfiles;
    mapping(uint256 => Certificate) public certificates;
    mapping(address => euint32) public investorReputation;
    mapping(address => euint32) public issuerReputation;
    
    uint256 public trancheCounter;
    uint256 public allocationCounter;
    uint256 public certificateCounter;
    
    address public owner;
    address public verifier;
    address public treasury;
    
    event BondTrancheCreated(uint256 indexed trancheId, address indexed issuer, string name);
    event BondAllocated(uint256 indexed allocationId, uint256 indexed trancheId, address indexed investor, uint32 amount);
    event CertificateIssued(uint256 indexed certificateId, address indexed owner, uint32 bondAmount);
    event BondRedeemed(uint256 indexed certificateId, address indexed owner, uint32 amount);
    event ReputationUpdated(address indexed user, uint32 reputation);
    event TrancheFullyAllocated(uint256 indexed trancheId);
    
    constructor(address _verifier, address _treasury) {
        owner = msg.sender;
        verifier = _verifier;
        treasury = _treasury;
    }
    
    function createBondTranche(
        string memory _name,
        string memory _description,
        uint256 _totalAmount,
        uint256 _minimumInvestment,
        uint256 _maximumInvestment,
        uint256 _interestRate,
        uint256 _maturityPeriod
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Tranche name cannot be empty");
        require(_totalAmount > 0, "Total amount must be positive");
        require(_minimumInvestment > 0, "Minimum investment must be positive");
        require(_maximumInvestment >= _minimumInvestment, "Maximum must be >= minimum");
        require(_maturityPeriod > 0, "Maturity period must be positive");
        
        uint256 trancheId = trancheCounter++;
        
        bondTranches[trancheId] = BondTranche({
            trancheId: FHE.asEuint32(0),
            totalAmount: FHE.asEuint32(0),
            allocatedAmount: FHE.asEuint32(0),
            minimumInvestment: FHE.asEuint32(0),
            maximumInvestment: FHE.asEuint32(0),
            interestRate: FHE.asEuint32(0),
            maturityPeriod: FHE.asEuint32(0),
            isActive: true,
            isFullyAllocated: false,
            name: _name,
            description: _description,
            issuer: msg.sender,
            creationTime: block.timestamp,
            maturityTime: block.timestamp + _maturityPeriod
        });
        
        emit BondTrancheCreated(trancheId, msg.sender, _name);
        return trancheId;
    }
    
    function allocateBond(
        uint256 trancheId,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(bondTranches[trancheId].issuer != address(0), "Tranche does not exist");
        require(bondTranches[trancheId].isActive, "Tranche is not active");
        require(!bondTranches[trancheId].isFullyAllocated, "Tranche is fully allocated");
        require(block.timestamp <= bondTranches[trancheId].maturityTime, "Tranche has expired");
        
        uint256 allocationId = allocationCounter++;
        
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        bondAllocations[allocationId] = BondAllocation({
            allocationId: FHE.asEuint32(0),
            amount: internalAmount,
            trancheId: FHE.asEuint32(0),
            investor: msg.sender,
            timestamp: block.timestamp,
            isEncrypted: true
        });
        
        bondTranches[trancheId].allocatedAmount = FHE.add(bondTranches[trancheId].allocatedAmount, internalAmount);
        
        ebool isFullyAllocated = FHE.gte(bondTranches[trancheId].allocatedAmount, bondTranches[trancheId].totalAmount);
        if (FHE.decrypt(isFullyAllocated)) {
            bondTranches[trancheId].isFullyAllocated = true;
            emit TrancheFullyAllocated(trancheId);
        }
        
        if (investorProfiles[msg.sender].wallet == address(0)) {
            investorProfiles[msg.sender] = InvestorProfile({
                totalInvested: internalAmount,
                reputationScore: FHE.asEuint32(100),
                riskTolerance: FHE.asEuint32(50),
                isVerified: false,
                isInstitutional: false,
                wallet: msg.sender,
                joinDate: block.timestamp
            });
        } else {
            investorProfiles[msg.sender].totalInvested = FHE.add(investorProfiles[msg.sender].totalInvested, internalAmount);
        }
        
        emit BondAllocated(allocationId, trancheId, msg.sender, 0);
        return allocationId;
    }
    
    function issueCertificate(
        uint256 allocationId,
        euint32 bondAmount,
        euint32 interestRate
    ) public returns (uint256) {
        require(bondAllocations[allocationId].investor != address(0), "Allocation does not exist");
        require(bondAllocations[allocationId].investor == msg.sender, "Only investor can issue certificate");
        
        uint256 certificateId = certificateCounter++;
        
        certificates[certificateId] = Certificate({
            certificateId: FHE.asEuint32(0),
            bondAmount: bondAmount,
            interestEarned: FHE.mul(bondAmount, interestRate) / FHE.asEuint32(100),
            isActive: true,
            isRedeemed: false,
            owner: msg.sender,
            issueDate: block.timestamp,
            maturityDate: block.timestamp + 365 days
        });
        
        emit CertificateIssued(certificateId, msg.sender, 0);
        return certificateId;
    }
    
    function redeemBond(uint256 certificateId) public {
        require(certificates[certificateId].owner == msg.sender, "Only certificate owner can redeem");
        require(certificates[certificateId].isActive, "Certificate is not active");
        require(!certificates[certificateId].isRedeemed, "Certificate already redeemed");
        require(block.timestamp >= certificates[certificateId].maturityDate, "Certificate not yet mature");
        
        certificates[certificateId].isRedeemed = true;
        certificates[certificateId].isActive = false;
        
        emit BondRedeemed(certificateId, msg.sender, 0);
    }
    
    function updateInvestorReputation(address investor, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(investor != address(0), "Invalid investor address");
        
        investorReputation[investor] = reputation;
        investorProfiles[investor].reputationScore = reputation;
        
        emit ReputationUpdated(investor, 0);
    }
    
    function updateIssuerReputation(address issuer, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(issuer != address(0), "Invalid issuer address");
        
        issuerReputation[issuer] = reputation;
        
        emit ReputationUpdated(issuer, 0);
    }
    
    function verifyInvestor(address investor, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify investors");
        require(investor != address(0), "Invalid investor address");
        
        investorProfiles[investor].isVerified = isVerified;
    }
    
    function setInstitutionalStatus(address investor, bool isInstitutional) public {
        require(msg.sender == verifier, "Only verifier can set institutional status");
        require(investor != address(0), "Invalid investor address");
        
        investorProfiles[investor].isInstitutional = isInstitutional;
    }
    
    function getTrancheInfo(uint256 trancheId) public view returns (
        string memory name,
        string memory description,
        uint8 totalAmount,
        uint8 allocatedAmount,
        uint8 minimumInvestment,
        uint8 maximumInvestment,
        uint8 interestRate,
        bool isActive,
        bool isFullyAllocated,
        address issuer,
        uint256 creationTime,
        uint256 maturityTime
    ) {
        BondTranche storage tranche = bondTranches[trancheId];
        return (
            tranche.name,
            tranche.description,
            0,
            0,
            0,
            0,
            0,
            tranche.isActive,
            tranche.isFullyAllocated,
            tranche.issuer,
            tranche.creationTime,
            tranche.maturityTime
        );
    }
    
    function getAllocationInfo(uint256 allocationId) public view returns (
        uint8 amount,
        uint8 trancheId,
        address investor,
        uint256 timestamp,
        bool isEncrypted
    ) {
        BondAllocation storage allocation = bondAllocations[allocationId];
        return (
            0,
            0,
            allocation.investor,
            allocation.timestamp,
            allocation.isEncrypted
        );
    }
    
    function getCertificateInfo(uint256 certificateId) public view returns (
        uint8 bondAmount,
        uint8 interestEarned,
        bool isActive,
        bool isRedeemed,
        address owner,
        uint256 issueDate,
        uint256 maturityDate
    ) {
        Certificate storage certificate = certificates[certificateId];
        return (
            0,
            0,
            certificate.isActive,
            certificate.isRedeemed,
            certificate.owner,
            certificate.issueDate,
            certificate.maturityDate
        );
    }
    
    function getInvestorProfile(address investor) public view returns (
        uint8 totalInvested,
        uint8 reputationScore,
        uint8 riskTolerance,
        bool isVerified,
        bool isInstitutional,
        uint256 joinDate
    ) {
        InvestorProfile storage profile = investorProfiles[investor];
        return (
            0,
            0,
            0,
            profile.isVerified,
            profile.isInstitutional,
            profile.joinDate
        );
    }
    
    function getInvestorReputation(address investor) public view returns (uint8) {
        return 0;
    }
    
    function getIssuerReputation(address issuer) public view returns (uint8) {
        return 0;
    }
    
    function withdrawFunds(uint256 trancheId) public {
        require(bondTranches[trancheId].issuer == msg.sender, "Only issuer can withdraw");
        require(bondTranches[trancheId].isFullyAllocated, "Tranche must be fully allocated");
        require(block.timestamp > bondTranches[trancheId].maturityTime, "Tranche must be mature");
        
        bondTranches[trancheId].isActive = false;
    }
    
    function emergencyPause() public {
        require(msg.sender == owner, "Only owner can pause");
    }
    
    function emergencyUnpause() public {
        require(msg.sender == owner, "Only owner can unpause");
    }
}
