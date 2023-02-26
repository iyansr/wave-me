import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { MetaMaskInpageProvider } from '@metamask/providers'
import abi from '../utils/abi'

const contractAddress = '0x90eb8Ab34693947F0B293033356EDdD5FF7ddFcD'

const getEth = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.ethereum as MetaMaskInpageProvider
}

const initAccount = async () => {
  try {
    const provider = getEth()

    if (!provider) {
      alert('Please Install MetaMask')
    }
    const accounts = (await provider?.request({ method: 'eth_accounts' })) as Array<unknown>

    if (accounts.length === 0) {
      console.log('No Accounts')
      return null
    }

    const acc = accounts[0] as string

    console.log({ acc })

    return acc
  } catch (error) {
    console.log(error)
    return null
  }
}

export default function App() {
  const [account, setAccount] = useState<string>()
  const [allWaves, setAllWaves] = useState<any[]>([])

  const getAllWaves = async () => {
    const eth = getEth()

    if (!eth) return

    const provider = new ethers.providers.Web3Provider(eth as any)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    const waves = await contract.getAllWaves()

    let cleanWaves: any[] = []

    waves.forEach((wave: any) => {
      cleanWaves.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message,
      })
    })

    setAllWaves(cleanWaves)
  }

  /**
   * Listen in for emitter events!
   */
  useEffect(() => {
    let wavePortalContract: any
    const eth = getEth()

    const onNewWave = (from: any, timestamp: number, message: any) => {
      console.log('NewWave', from, timestamp, message)
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ])
    }

    if (eth) {
      const provider = new ethers.providers.Web3Provider(eth as any)
      const signer = provider.getSigner()

      wavePortalContract = new ethers.Contract(contractAddress, abi, signer)
      wavePortalContract.on('NewWave', onNewWave)
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewWave)
      }
    }
  }, [])

  const wave = async () => {
    const eth = getEth()

    if (!eth) return

    const provider = new ethers.providers.Web3Provider(eth as any)
    const signer = provider.getSigner()

    const waveContract = new ethers.Contract(contractAddress, abi, signer)
    const message = prompt('Write Message')
    if (!message) {
      alert('Write a message!')
      return
    }
    const waveEvent = await waveContract.wave(message, { gasLimit: 300_000 })
    await waveEvent.wait()
  }

  const connect = async () => {
    try {
      const eth = getEth()

      if (!eth) return

      const acc = (await eth?.request({ method: 'eth_requestAccounts' })) as Array<string>
      setAccount(acc[0])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllWaves()
  }, [])

  useEffect(() => {
    const getAccount = async () => {
      const acc = await initAccount()
      if (acc) {
        setAccount(acc)
      }
    }
    getAccount()
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        {!account ? (
          <button className="waveButton" onClick={connect}>
            Connect
          </button>
        ) : (
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        )}

        <h3>All Waves:</h3>

        {allWaves?.map((wave, index) => {
          return (
            <div key={String(index)} className="allWave">
              <div>
                <strong>Address</strong>: {wave.address}
              </div>
              <div>
                <strong>Message</strong>: {wave.message}
              </div>
              <div>
                <strong>Time</strong>: {wave.timestamp.toString()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
