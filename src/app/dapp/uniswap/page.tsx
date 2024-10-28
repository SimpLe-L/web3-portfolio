"use client"

import { ArrowDown, Settings, ChevronsUpDown, Loader2 } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import tokenList from "./tokenList.json";
import { Pair, Route, Trade } from '@uniswap/v2-sdk';
import { BigintIsh, ChainId, CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { uniswapV2Pair, uniswapV2Router02, approveABI } from '~/uniswap';
import { useAccount, useWriteContract, BaseError } from 'wagmi';
import { parseUnits } from 'ethers';
import { MAINNET_PROVIDER_URI, uniswapV2Router02Address } from '@/configs';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

type TokenProps = typeof tokenList[0]


const SwapPage = () => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const { address: accountAddress } = useAccount()
  const [slippage, setSlippage] = useState(2.5)
  const [changeToken, setChangeToken] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [tokenOne, setTokenOne] = useState(tokenList[0])
  const [tokenTwo, setTokenTwo] = useState(tokenList[1])
  const [tokenOneAmount, setTokenOneAmount] = useState<string | undefined>('')
  const [tokenTwoAmount, setTokenTwoAmount] = useState<string | undefined>('')
  const [prices, setPrices] = useState<{
    tokenOne: string,
    tokenTwo: string,
    radio: string
  }>()

  const { writeContractAsync } = useWriteContract()

  const handleChange = (value: boolean) => {
    setIsOpen(value);
  }

  const handleSlippageChange = (value: string) => {
    setSlippage(Number(value))
  }

  function openModal(asset: number) {
    setChangeToken(asset)
    setIsOpen(true)
  }

  function modifyToken(i: number) {
    setPrices(undefined)
    setTokenOneAmount(undefined)
    setTokenTwoAmount(undefined)
    if (changeToken === 1) {
      setTokenOne(tokenList[i])
      fetchPrices(tokenList[i], tokenTwo)
    } else {
      setTokenTwo(tokenList[i])
      fetchPrices(tokenOne, tokenList[i])
    }
    setIsOpen(false)
  }

  function changeAmount(e: ChangeEvent<HTMLInputElement>) {
    setTokenOneAmount(e.target.value)
    if (e.target.value && prices) {
      setTokenTwoAmount((Number(e.target.value) * Number(prices.radio)).toFixed(6))
    } else {
      setTokenTwoAmount(undefined);
    }
  }

  function switchTokens() {
    setTokenOneAmount(undefined)
    setTokenTwoAmount(undefined)
    setTokenOne(tokenTwo)
    setTokenTwo(tokenOne)
    fetchPrices(tokenTwo, tokenOne)
  }

  async function fetchPrices(one: TokenProps, two: TokenProps) {
    const tokenOne = new Token(ChainId.MAINNET, one.address, one.decimals)
    const tokenTwo = new Token(ChainId.MAINNET, two.address, two.decimals)
    const pair = await createPair(tokenOne, tokenTwo);
    const route = new Route([pair], tokenOne, tokenTwo)

    const priceOne = route.midPrice.toSignificant(6)
    const priceTwo = route.midPrice.invert().toSignificant(6)
    const radio = priceOne;
    setPrices({
      tokenOne: priceOne,
      tokenTwo: priceTwo,
      radio,
    })
  }

  async function createPair(tokenOne: Token, tokenTwo: Token): Promise<Pair> {
    const pairAddress = Pair.getAddress(tokenOne, tokenTwo)
    const client = createPublicClient({
      chain: mainnet,
      transport: http(MAINNET_PROVIDER_URI)
    })
    const reserves = await client.readContract({
      address: pairAddress as `0x${string}`,
      abi: uniswapV2Pair,
      functionName: 'getReserves'
    })
    const [reserve0, reserve1] = reserves
    const tokens = [tokenOne, tokenTwo]
    const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]]

    const pair = new Pair(CurrencyAmount.fromRawAmount(token0, Number(reserve0)), CurrencyAmount.fromRawAmount(token1, Number(reserve1)))
    return pair
  }

  useEffect(() => {
    fetchPrices(tokenOne, tokenTwo)
  }, [])

  async function handleSwap() {
    if (!tokenOneAmount || !accountAddress || !tokenTwoAmount) {
      return
    }
    setIsLoading(true);
    try {
      const one = new Token(ChainId.MAINNET, tokenOne.address, tokenOne.decimals)
      const two = new Token(ChainId.MAINNET, tokenTwo.address, tokenTwo.decimals)
      const amountOne = parseUnits(tokenOneAmount, tokenOne.decimals).toString()
      const amountTwo = parseUnits(tokenTwoAmount, tokenTwo.decimals).toString()
      const pair = new Pair(CurrencyAmount.fromRawAmount(one, amountOne), CurrencyAmount.fromRawAmount(two, amountTwo))

      const route = new Route([pair], one, two)

      const amountIn = parseUnits(tokenOneAmount, tokenOne.decimals).toString()
      const amountInBigint = parseUnits(tokenOneAmount, tokenOne.decimals)

      const trade = new Trade(route, CurrencyAmount.fromRawAmount(one, amountIn), TradeType.EXACT_INPUT)

      const slippageTolerance = new Percent(slippage * 100, '10000') // 50 bips, or 0.50%

      const amountOutMin = trade.minimumAmountOut(slippageTolerance).toExact() // needs to be converted to e.g. decimal string
      const path = [one.address, two.address] as `0x${string}`[]
      const to = accountAddress // should be a checksummed recipient address
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time

      await writeContractAsync({
        address: one.address as `0x${string}`,
        abi: approveABI,
        functionName: 'approve',
        args: [uniswapV2Router02Address, amountInBigint]
      },
        {
          onSuccess: () => {
            // setIsLoading(false);
          },
          onError: (err) => {
            toast({
              description: "approve failed"
            })
            setIsLoading(false);
          }
        }
      )
      const txHash = await writeContractAsync({
        address: uniswapV2Router02Address,
        abi: uniswapV2Router02,
        functionName: "swapExactTokensForTokens",
        args: [amountInBigint, BigInt(amountOutMin), path, to, BigInt(deadline)]
      },
        {
          onSuccess: () => {
            setIsLoading(false);
          },
          onError: (err) => {
            toast({
              description: "transaction failed"
            })

          }
        }
      )
      toast({
        description: `contract hash: ${txHash}`
      })
    } catch (error) {
      toast({
        description: (error as BaseError).shortMessage
      })
    }
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={handleChange}
      >
        <DialogContent className='border-[--card-bg]'>
          <DialogHeader>
            <DialogTitle className='text-[--basic-text]'>Select a token</DialogTitle>
          </DialogHeader>
          <div className='border-t border-[#363e54] mt-5 flex flex-col gap-[10px]'>
            {
              tokenList.map((e, i) => (
                <div
                  className='flex justify-start items-center px-5 py-3 hover:bg-[#2e374a] hover:cursor-pointer'
                  key={i}
                  onClick={() => modifyToken(i)}
                >
                  <img className='w-10 h-10' src={e.img} alt={e.ticker} />
                  <div className='ml-3'>
                    <div className='text-base font-medium text-[--basic-text]'>{e.name}</div>
                    <div className='text-sm font-light text-[--secondry-text]'>{e.ticker}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </DialogContent>

      </Dialog>
      <div className='w-full h-full flex flex-col justify-start items-center pt-10 gap-4'>
        <div className='w-full flex justify-center'>
          <ConnectButton />
        </div>
        <div className="w-[464px] bg-[--card-bg] border-2 border-solid border-[--split-line] min-h-[300px] rounded-2xl flex flex-col justify-start px-[30px]">
          <div className="flex justify-between items-center">
            <div className="text-xl my-4 font-bold text-[--basic-text]">Swap Demo</div>

            <Popover>
              <PopoverTrigger asChild>
                <Settings className='hover:rotate-90 hover:text-white text-[#51586f] duration-300 cursor-pointer' />
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-[--card-bg]">
                <div>Slippage Tolerance</div>
                <RadioGroup onValueChange={handleSlippageChange} defaultValue="comfortable" className='flex'>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0.5" id="r1" />
                    <Label htmlFor="r1">0.5%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2.5" id="r2" />
                    <Label htmlFor="r2">2.5%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="r3" />
                    <Label htmlFor="r3">5.0%</Label>
                  </div>
                </RadioGroup>
              </PopoverContent>
            </Popover>
          </div>
          <div className='relative'>
            <Input
              className='h-24 text-[--basic-text] border-none bg-[#2e374a] text-4xl mb-1'
              placeholder='0'
              value={tokenOneAmount}
              onChange={changeAmount}
              disabled={!prices}
            />
            <Input
              className='h-24 text-[--basic-text] border-none bg-[#2e374a] text-4xl'
              value={tokenTwoAmount}
              placeholder="0"
              disabled
            />
            <div
              className='bg-[#2e374a] w-[31px] h-[31px] flex justify-center items-center rounded-lg absolute top-[82px] left-[180px] text-[#5F6783] border-[3px] border-solid border-[--split-line] text-xs duration-300 cursor-pointer'
              onClick={switchTokens}
            >
              <ChevronsUpDown />
            </div>
            <div
              className='absolute min-w-[50px] h-[30px] text-[--secondry-text] bg-[#3a4157] top-[36px] right-[20px] rounded-full flex justify-start items-center gap-1 text-base pr-2 cursor-pointer'
              onClick={() => openModal(1)}
            >
              <img src={tokenOne.img} alt='assetOnwLogo' className='h-[22px] ml-[5px]' />
              <span className='font-bold mt-1'>{tokenOne.ticker}</span>
              <ArrowDown className='w-[17px] h-[17px]' />
            </div>
            <div
              className='absolute min-w-[50px] h-[30px] text-[--secondry-text] bg-[#3a4157] top-[135px] right-[20px] rounded-full flex justify-start items-center gap-1 text-base pr-2 cursor-pointer'
              onClick={() => openModal(2)}
            >
              <img src={tokenTwo.img} alt='assetOnwLogo' className='h-[22px] ml-[5px]' />
              <span className='font-bold mt-1'>{tokenTwo.ticker}</span>
              <ArrowDown className='w-[17px] h-[17px]' />
            </div>
          </div>
          <button
            className='disabled:bg-[#243056] disabled:opacity-40 disabled:cursor-not-allowed h-[55px] w-full rounded-xl flex justify-center items-center bg-[--button-bg] text-[--basic-text] text-xl font-bold duration-300 mb-[30px] mt-2 cursor-pointer'
            onClick={handleSwap}
            disabled={!accountAddress || !tokenOneAmount}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Swap
          </button>
        </div>
      </div>

    </>
  )
}

export default SwapPage