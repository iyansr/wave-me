import { ethers } from 'hardhat'

async function main() {
  const waveContractFactory = await ethers.getContractFactory('WavePortal')
  const waveContract = await waveContractFactory.deploy({
    value: ethers.utils.parseEther('0.001'),
  })
  await waveContract.deployed()
  console.log('Contract addy:', waveContract.address)

  const contractBalance = await ethers.provider.getBalance(waveContract.address)

  console.log({ contractBalance: ethers.utils.formatEther(contractBalance) })

  /**
   * Let's send a few waves!
   */
  let waveTxn = await waveContract.wave('A message!')
  await waveTxn.wait() // Wait for the transaction to be mined

  let allWaves = await waveContract.getAllWaves()
  console.log(allWaves)
}

main().catch((err) => {
  console.log(err)
  process.exitCode = 1
})
