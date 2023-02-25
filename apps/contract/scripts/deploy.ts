import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  const balance = await deployer.getBalance()

  console.log(`Deploying contract with account: ${(await deployer.getAddress()).toString()}`)
  console.log(`Balance: ${balance}`)

  const WavePortalContract = await ethers.getContractFactory('WavePortal')
  const waveContract = await WavePortalContract.deploy({
    value: ethers.utils.parseEther('0.01'),
  })
  await waveContract.deployed()

  console.log(`WavePortal address: ${waveContract.address}`)
}

main().catch((err) => {
  console.log(err)
  process.exitCode = 1
})
