const { sepolia } = require('viem/chains')

require('@nomicfoundation/hardhat-toolbox')

module.exports = {
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/fNTro6Lf7XPu_8usxR94twN88g8uksPx',
      accounts: ['2d5d7877a008cd86667d0d2a9a1213e600bf77807c289ffa46a42f5a57e75744'],
      chainId: 11155111,
    },
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 40000,
  },
}
