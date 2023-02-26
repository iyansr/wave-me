import { ethers } from 'hardhat'

async function main() {
  const waveContractFactory = await ethers.getContractFactory('WavePortal')
  const waveContract = await waveContractFactory.deploy({
    value: ethers.utils.parseEther('0.001'),
  })
  await waveContract.deployed()
  console.log('Contract addy:', waveContract.address)

  let contractBalance = await ethers.provider.getBalance(waveContract.address)

  console.log({ contractBalance: ethers.utils.formatEther(contractBalance) })

  let waveTxn = await waveContract.wave('A message! #1')
  await waveTxn.wait() // Wait for the transaction to be mined

  let waveTxn2 = await waveContract.wave('A message! #2')
  await waveTxn2.wait() // Wait for the transaction to be mined

  contractBalance = await ethers.provider.getBalance(waveContract.address)
  console.log('Contract balance:', ethers.utils.formatEther(contractBalance))

  let allWaves = await waveContract.getAllWaves()
  console.log(allWaves)
}

main().catch((err) => {
  console.log(err)
  process.exitCode = 1
})
