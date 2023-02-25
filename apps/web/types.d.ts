import { MetaMaskInpageProvider } from '@metamask/providers'
import { BaseContract } from 'ethers'
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
} from 'ethers'

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

export interface WavePortal extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: WavePortalInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    getWaveCount(overrides?: CallOverrides): Promise<[BigNumber]>

    wave(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>
  }

  getWaveCount(overrides?: CallOverrides): Promise<BigNumber>

  wave(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>

  callStatic: {
    getWaveCount(overrides?: CallOverrides): Promise<BigNumber>

    wave(overrides?: CallOverrides): Promise<void>
  }

  filters: {}

  estimateGas: {
    getWaveCount(overrides?: CallOverrides): Promise<BigNumber>

    wave(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>
  }

  populateTransaction: {
    getWaveCount(overrides?: CallOverrides): Promise<PopulatedTransaction>

    wave(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>
  }
}
