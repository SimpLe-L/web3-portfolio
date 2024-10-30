"use client"

import { useWriteContract, useReadContract } from 'wagmi';
import { contractAddress, nftAddress } from '@/configs';
import { useState } from 'react';

import { NFTCard } from './MintCard';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NftAbi } from "~/nft";
import { nftMarketABI } from "~/nftMarket";

// import { INftProperties } from '@/types';

const toTuple = (arr: bigint[]): readonly [bigint, bigint] => {
  if (arr.length !== 2) {
    throw new Error("Array must have exactly 2 elements.");
  }
  return [arr[0], arr[1]] as readonly [bigint, bigint];
}

interface IProps {
  address: `0x${string}` | undefined,
  changePlace: () => void
}

const MintPage = ({ address, changePlace }: IProps) => {

  const { toast } = useToast()
  const { writeContractAsync } = useWriteContract()
  // const [horses, setHorses] = useState<readonly INftProperties[] | undefined>([]);
  const [checkedNfts, setCheckedNft] = useState<bigint[]>([]);

  // 读取已拥有的nft列表
  const { data: horses, refetch } = useReadContract({
    // 合约地址
    address: contractAddress,
    abi: NftAbi,
    functionName: 'getHorses',
    args: [address!]
  })
  // mint nft
  const MintNFT = async () => {
    // setIsLoading(true);
    await writeContractAsync({
      abi: NftAbi,
      address: contractAddress,
      functionName: 'safeMint',
      args: [address!]
    }, {
      onSuccess: (data) => {
        refetch();
        // setIsLoading(false);
      }
    })
  }
  // 合成NFT
  const CombineNFTs = async () => {

    await writeContractAsync({
      abi: NftAbi,
      address: contractAddress,
      functionName: 'combine',
      args: toTuple(checkedNfts),
    }, {
      onSuccess: () => {
        refetch();
        // setIsLoading(false);
      }
    })
  }

  // 处理勾选的nft
  const handleNftCheck = (tokenId: bigint, value: boolean) => {

    if (value) {
      if (checkedNfts.length >= 2) {
        toast({
          description: "合成条件：两张同等级且不超过3级的NFT",
        })
        return;
      }
      setCheckedNft([...checkedNfts, tokenId]);
    } else {
      // 取消勾选
      setCheckedNft(checkedNfts.filter(item => item !== tokenId));
    }
  }
  // 上架nft
  const handleList = async (id: bigint, price: bigint) => {

    await writeContractAsync({
      abi: NftAbi,
      address: contractAddress,
      functionName: 'approve',
      args: [nftAddress, id]
    }, {
      onSuccess: async () => {
        await writeContractAsync({
          abi: nftMarketABI,
          address: nftAddress,
          functionName: 'shelve',
          args: [id, price]
        }, {
          onSuccess: () => {
            toast({
              description: "上架成功",
            })
            changePlace();
          }
        })
      }
    })

  }

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="w-full flex justify-center gap-2">
        <Button className='bg-[--button-bg] text-[--basic-text] hover:bg-[--button-bg]' onClick={MintNFT}>MINT</Button>
        <Button className='bg-[--button-bg] text-[--basic-text] hover:bg-[--button-bg]' onClick={CombineNFTs}>合成</Button>
      </div>
      <div className='overflow-y-auto flex flex-wrap gap-5 flex-[1]'>
        {horses && horses.map(item => {
          return <NFTCard key={item.tokenId} data={item} handleNftCheck={handleNftCheck} handleList={handleList} />
        })}
      </div>
    </div>
  );
};

export default MintPage;
