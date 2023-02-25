/* eslint-disable turbo/no-undeclared-env-vars */

import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const { PRIVATE_KEY = '', ALCHEMY_ENDPOINT = '' } = process.env

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: ALCHEMY_ENDPOINT,
      accounts: [PRIVATE_KEY],
    },
  },
}

export default config
