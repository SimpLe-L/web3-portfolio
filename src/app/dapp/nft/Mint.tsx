"use client"

import { useWriteContract, useReadContract, useWaitForTransactionReceipt, type BaseError } from 'wagmi';
import { mintAddress, nftAddress } from '@/configs';
import { useState } from 'react';

import { NFTCard } from './MintCard';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NftAbi } from "~/nft";
import { nftMarketABI } from "~/nftMarket";
import { wagmiConfig } from "@/utils/wagmiConfig";
import { readContract, waitForTransactionReceipt } from '@wagmi/core';

import Loader from '../crowdfunding/components/Loader';
import { parseEther } from 'viem';
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

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // const { data: hash, writeContractAsync: approve, isPending } = useWriteContract()
  // const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const [checkedNfts, setCheckedNft] = useState<bigint[]>([]);
  const [price, setPrice] = useState('');
  // mint
  const { writeContract: mint, isPending: mintStatus } = useWriteContract({
    mutation: {
      onSuccess: async (hash, variables) => {
        const listReceipt = await waitForTransactionReceipt(wagmiConfig,
          { hash });
        if (listReceipt.status === "success") {
          setIsLoading(false);
          toast({
            description: "mint成功！",
          });
          refetch();
        }
      },
      onError: (error) => {
        toast({
          description: "Error: " + ((error as BaseError).shortMessage || error.message)
        });
      }
    }
  });
  // 合成
  const { writeContract: combine, isPending: combineStatus } = useWriteContract({
    mutation: {
      onSuccess: async (hash, variables) => {
        const listReceipt = await waitForTransactionReceipt(wagmiConfig,
          { hash });
        if (listReceipt.status === "success") {
          setIsLoading(false);
          toast({
            description: "合成成功！",
          });
          refetch();
        }
      },
      onError: (error) => {
        toast({
          description: "Error: " + ((error as BaseError).shortMessage || error.message)
        });
      }
    }
  })
  // approve
  const { writeContract: approveMethod, isPending: approveStatus } = useWriteContract({
    mutation: {
      onSuccess: async (hash, variables) => {
        const listReceipt = await waitForTransactionReceipt(wagmiConfig,
          { hash });
        if (listReceipt.status === "success") {
          // const nftAddress = variables.address;
          const tokenId = variables.args![1] as bigint;
          handleApproveSuccess(tokenId);
        }
      },
      onError: (error) => {
        toast({
          description: "Error: " + ((error as BaseError).shortMessage || error.message)
        });
      }
    }
  })
  // 上架
  const { writeContract: listMethod, isPending: listStatus } = useWriteContract({
    mutation: {
      onSuccess: async (hash, variables) => {
        const listReceipt = await waitForTransactionReceipt(wagmiConfig,
          { hash });
        if (listReceipt.status === "success") {
          setIsLoading(false);
          toast({
            description: "上架成功！",
          });
          changePlace();
        }
      },
      onError: (error) => {
        toast({
          description: "Error: " + ((error as BaseError).shortMessage || error.message)
        });
      }
    }
  })


  // 读取已拥有的nft列表
  const { data: horses, isSuccess, refetch } = useReadContract({
    // 合约地址
    address: mintAddress,
    abi: NftAbi,
    functionName: 'getHorses',
    args: [address!]
  })
  // mint nft
  const MintNFT = async () => {
    setIsLoading(true);
    mint({
      abi: NftAbi,
      address: mintAddress,
      functionName: 'safeMint',
      args: [address!]
    })
  }
  // 合成NFT
  const CombineNFTs = async () => {
    setIsLoading(true);
    combine({
      abi: NftAbi,
      address: mintAddress,
      functionName: 'combine',
      args: toTuple(checkedNfts),
    });
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
  // 授权及上架
  const handleList = async (id: bigint, price: string) => {
    if (!price) {
      toast({
        description: "价格不能为空",
      })
      return;
    }
    setPrice(price);
    setIsLoading(true);
    // 是否已经授权
    const addr = await readContract(wagmiConfig, {
      address: mintAddress,
      abi: NftAbi,
      functionName: 'getApproved',
      args: [id]
    })
    if (addr == nftAddress) {
      await handleApproveSuccess(id);
      return;
    }
    approveMethod({
      abi: NftAbi,
      address: mintAddress,
      functionName: 'approve',
      args: [nftAddress, id]
    })

  }

  const handleApproveSuccess = async (tokenId: bigint) => {
    listMethod({
      abi: nftMarketABI,
      address: nftAddress,
      functionName: 'shelve',
      args: [tokenId, parseEther(price)]
    });
  }

  return (
    <div className="h-full flex flex-col gap-3">
      {
        isLoading && <Loader />
      }
      <div className="w-full flex justify-center gap-2">
        <Button className='bg-[--button-bg] text-[--basic-text] hover:bg-[--button-bg]' onClick={MintNFT}>
          {
            mintStatus ? "进行中..." : "MINT"
          }
        </Button>
        <Button className='bg-[--button-bg] text-[--basic-text] hover:bg-[--button-bg]' onClick={CombineNFTs}>

          {combineStatus ? "进行中..." : "合成"}
        </Button>
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
