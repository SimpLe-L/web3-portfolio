

import { nftAddress } from "@/configs";
import { useToast } from "@/hooks/use-toast";
import { useReadContract, useWriteContract } from "wagmi";
import { nftMarketABI } from "~/nftMarket";

import MarketCard from './MarketCard'

const nftMarket = ({ address }: { address: `0x${string}` | undefined }) => {

  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();
  // 读取上架的nft列表
  const { data: NftList, refetch } = useReadContract({
    // 合约地址
    address: nftAddress,
    abi: nftMarketABI,
    functionName: 'allMarkets'
  })
  // 购买nft
  const buyNft = async (tokenId: bigint, price: bigint) => {
    await writeContractAsync({
      abi: nftMarketABI,
      address: nftAddress,
      functionName: 'buy',
      args: [tokenId],
      value: price
    }, {
      onSuccess: () => {
        toast({
          description: "购买成功！",
        })
        refetch();
        // setIsLoading(false);
      }
    })
  }
  // 下架nft
  const unShelve = async (tokenId: bigint) => {
    await writeContractAsync({
      abi: nftMarketABI,
      address: nftAddress,
      functionName: 'unShelve',
      args: [tokenId]
    }, {
      onSuccess: () => {
        toast({
          description: "下架成功！",
        })
        refetch();
        // setIsLoading(false);
      }
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