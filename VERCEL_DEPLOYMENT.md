# Vercel Deployment Guide for Cloaked Bond Flow

## Prerequisites

- Vercel account
- GitHub repository access
- Environment variables configured

## Step-by-Step Deployment

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `Block-chain-Wolf/cloaked-bond-flow`
4. Select the repository and click "Import"

### 2. Configure Build Settings

1. **Framework Preset**: Vite
2. **Root Directory**: `./` (default)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 3. Environment Variables

Add the following environment variables in Vercel dashboard:

```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_PROJECT_ID
VITE_FHE_NETWORK_URL=https://api.zama.ai/fhevm
VITE_FHE_APP_ID=YOUR_FHE_APP_ID
```

### 4. Deploy

1. Click "Deploy" button
2. Wait for build to complete
3. Your app will be available at the provided Vercel URL

### 5. Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Post-Deployment

### Smart Contract Deployment

1. Deploy contracts to Sepolia testnet
2. Update contract addresses in frontend
3. Test all functionality

### Testing Checklist

- [ ] Wallet connection works
- [ ] Bond tranche creation
- [ ] Investment allocation
- [ ] Certificate issuance
- [ ] FHE encryption functions

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version (18+)
2. **Environment Variables**: Ensure all required variables are set
3. **Wallet Connection**: Verify WalletConnect project ID
4. **FHE Operations**: Check FHE network connectivity

### Support

For deployment issues, check:
- Vercel documentation
- Project logs in Vercel dashboard
- GitHub repository issues