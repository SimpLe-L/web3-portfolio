

import { nftAddress } from "@/configs";
import { useToast } from "@/hooks/use-toast";
import { useReadContract, useWriteContract, type BaseError } from "wagmi";
import { nftMarketABI } from "~/nftMarket";

import MarketCard from './MarketCard'
import { wagmiConfig } from "@/utils/wagmiConfig";
import { waitForTransactionReceipt } from '@wagmi/core'

const nftMarket = ({ address }: { address: `0x${string}` | undefined }) => {

  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();
  // buy
  const { writeContract: buyMethod, isPending: buyStatus } = useWriteContract({
    mutation: {
      onSuccess: async (hash, variables) => {
        const listReceipt = await waitForTransactionReceipt(wagmiConfig,
          { hash });
        if (listReceipt.status === "success") {
          toast({
            description: "购买成功！",
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
  // 下架
  const { writeContract: unList, isPending: unListStatus } = useWriteContract({
    mutation: {
      onSuccess: async (hash, variables) => {
        const listReceipt = await waitForTransactionReceipt(wagmiConfig,
          { hash });
        if (listReceipt.status === "success") {
          toast({
            description: "下架成功！",
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
  // 读取上架的nft列表
  const { data: NftList, refetch } = useReadContract({
    // 合约地址
    address: nftAddress,
    abi: nftMarketABI,
    functionName: 'allMarkets'
  })
  // 购买nft
  const buyNft = async (tokenId: bigint, price: bigint) => {
    buyMethod({
      abi: nftMarketABI,
      address: nftAddress,
      functionName: 'buy',
      args: [tokenId],
      value: price
    });
    // {
    //   onSuccess: () => {
    //     toast({
    //       description: "购买成功！",
    //     })
    //     refetch();
    //   }
    // }
  }
  // 下架nft
  const unShelve = async (tokenId: bigint) => {
    unList({
      abi: nftMarketABI,
      address: nftAddress,
      functionName: 'unShelve',
      args: [tokenId]
    })
  }

  return (
    <div className='w-full h-full overflow-y-auto flex flex-wrap gap-5'>
      {NftList && NftList.map(item => {
        return <MarketCard key={item.tokenId} nftItem={item} address={address} buyNft={buyNft} unShelve={unShelve} />
      })}
    </div>
  )
}

export default nftMarket