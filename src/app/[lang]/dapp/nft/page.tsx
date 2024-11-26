"use client"

import { useState } from 'react';
import { useAccount } from 'wagmi';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';

import MintComp from './Mint'
import MarketComp from './Market'

const NftPage = () => {
  const { address } = useAccount();
  const [isMine, setIsMain] = useState(true);

  const changePlace = () => {
    setIsMain(!isMine);
  }

  return (
    <div className='flex flex-col p-5 gap-4 h-full'>
      <div className='w-full flex gap-2 justify-center'>
        <ConnectButton />
        <Button className='bg-[--button-bg] text-[--basic-text] hover:bg-[--button-bg]' onClick={changePlace}>{isMine ? '市场' : '我的'}</Button>
      </div>
      <div className='flex-[1] overflow-y-auto'>
        {
          isMine ? <MintComp address={address} changePlace={changePlace} /> : <MarketComp address={address} />
        }
      </div>
    </div>
  );
};

export default NftPage;
