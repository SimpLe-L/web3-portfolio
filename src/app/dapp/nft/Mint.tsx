"use client"

import { useWriteContract, useReadContract, useWaitForTransactionReceipt, type BaseError } from 'wagmi';
import { contractAddress, nftAddress } from '@/configs';
import { useState } from 'react';

import { NFTCard } from './MintCard';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NftAbi } from "~/nft";
import { nftMarketABI } from "~/nftMarket";
import { wagmiConfig } from "@/utils/wagmiConfig";
import { waitForTransactionReceipt } from '@wagmi/core'
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
  // const { data: hash, writeContractAsync: approve, isPending } = useWriteContract()
  // const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const [checkedNfts, setCheckedNft] = useState<bigint[]>([]);
  const [price, setPrice] = useState<bigint>(0n);
  // mint
  const { writeContract: mint, isPending: mintStatus } = useWriteContract({
    mutation: {
      onSuccess: async (hash, variables) => {
        const listReceipt = await waitForTransactionReceipt(wagmiConfig,
          { hash });
        if (listReceipt.status === "success") {
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
          const nftAddress = variables.address;
          const tokenId = variables.args![1] as bigint;
          handleApproveSuccess(nftAddress, tokenId, price);
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
          toast({
            description: "上架成功！",
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
    mint({
      abi: NftAbi,
      address: contractAddress,
      functionName: 'safeMint',
      args: [address!]
    })
  }
  // 合成NFT
  const CombineNFTs = async () => {

    combine({
      abi: NftAbi,
      address: contractAddress,
      functionName: 'combine',
      args: toTuple(checkedNfts),
    });
    // await writeContractAsync({
    //   abi: NftAbi,
    //   address: contractAddress,
    //   functionName: 'combine',
    //   args: toTuple(checkedNfts),
    // }, {
    //   onSuccess: () => {
    //     refetch();
    //   }
    // })
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
  const handleList = async (id: bigint, price: bigint) => {
    if (!price) {
      toast({
        description: "价格不能为空",
      })
      return;
    }
    setPrice(price);
    approveMethod({
      abi: NftAbi,
      address: contractAddress,
      functionName: 'approve',
      args: [nftAddress, id]
    })

  }

  const handleApproveSuccess = (nftAddress: `0x${string}`, tokenId: bigint, price: bigint) => {
    listMethod({
      abi: nftMarketABI,
      address: nftAddress,
      functionName: 'shelve',
      args: [tokenId, price]
    })
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="w-full flex justify-center gap-2">
        <Button className='bg-[--button-bg] text-[--basic-text] hover:bg-[--button-bg]' onClick={MintNFT}>
          {
            mintStatus ? "进行中" : "MINT"
          }
        </Button>
        <Button className='bg-[--button-bg] text-[--basic-text] hover:bg-[--button-bg]' onClick={CombineNFTs}>

          {combineStatus ? "进行中" : "合成"}
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
