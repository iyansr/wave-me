/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import abi from '../utils/abi'
import {
  useAccount,
  useConnect,
  useContractEvent,
  useContractRead,
  useContractWrite,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  usePrepareContractWrite,
  useSigner,
} from 'wagmi'

const contractAddress = '0x90eb8Ab34693947F0B293033356EDdD5FF7ddFcD'

export default function App() {
  const [allWaves, setAllWaves] = useState<any[]>([])
  const [message, setMessage] = useState<string>('')
  const { address, connector, isConnected } = useAccount()
  const { data: signer } = useSigner()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { disconnect } = useDisconnect()

  const {
    config,
    isLoading: preparing,
    isError: isPrepareError,
    error: prepareError,
  } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    signer,
    functionName: 'wave',
    args: [message],
    enabled: !!message,
  })

  const { isLoading: loadingWrite, error: waveError, writeAsync, isError } = useContractWrite(config)

  useContractEvent({
    address: contractAddress,
    abi,
    eventName: 'NewWave',
    listener(from, timestamp, message) {
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp.toNumber() * 1000),
          message: message,
        },
      ])
    },
  })

  useContractRead({
    abi,
    address: contractAddress,
    functionName: 'getAllWaves',
    onSuccess(waves) {
      let cleanWaves: any[] = []

      waves.forEach((wave: (typeof waves)[0]) => {
        cleanWaves.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp.toNumber() * 1000),
          message: wave.message,
        })
      })

      setAllWaves(cleanWaves)
    },
  })

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        {!isConnected ? (
          connectors.map((conn) => (
            <button key={conn.id} className="waveButton" onClick={() => connect({ connector: conn })}>
              Connect With {conn.name}
              {!conn.ready && ' (unsupported)'}
              {isLoading && conn.id === pendingConnector?.id && ' (connecting)'}
            </button>
          ))
        ) : (
          <div style={{ textAlign: 'center' }}>
            {ensAvatar && <img src={ensAvatar} alt="ENS Avatar" />}

            <div>{ensName ? `${ensName} (${address})` : address}</div>
            <div>Connected to {connector?.name}</div>
            <input
              type="text"
              name="message"
              id="message"
              placeholder="Write a message"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
              <button
                disabled={loadingWrite || !writeAsync || preparing || !message}
                className="waveButton"
                onClick={async () => {
                  await writeAsync?.()
                  setMessage('')
                }}
              >
                Wave at Me {(loadingWrite || !writeAsync || preparing) && '(loading...)'}
              </button>
              <button className="waveButton" onClick={() => disconnect()}>
                Disconnect
              </button>
            </div>

            {(isPrepareError || isError) && (
              <div style={{ position: 'relative', overflow: 'scroll' }}>
                <div style={{ whiteSpace: 'pre-line' }}>Error: {(prepareError || waveError)?.message}</div>
              </div>
            )}
          </div>
        )}

        {error && <div>{error.message}</div>}

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
