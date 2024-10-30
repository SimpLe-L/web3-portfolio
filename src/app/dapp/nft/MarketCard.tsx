import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { IMarketItem } from "@/types";

interface IProps {
  address: `0x${string}` | undefined;
  buyNft: (tokenId: bigint, price: bigint) => void;
  unShelve: (tokenId: bigint) => void;
  nftItem: IMarketItem
}
const resetAddress = (owner: string) => `${owner.slice(0, 4)}...${owner.slice(38)}`;

const MarketCard = ({ address, buyNft, unShelve, nftItem }: IProps) => {

  const handleClick = () => {
    if (address == nftItem.seller) {
      unShelve(nftItem.tokenId);
    } else {
      buyNft(nftItem.tokenId, nftItem.price);
    }
  }
  return (
    <Card className={cn("w-[260px] text-white h-[450px] bg-[--card-bg] border-[--card-bg]")}>
      <CardHeader className="flex flex-row justify-between">
        {/* <CardTitle> #{String(data.tokenId)}</CardTitle> */}
      </CardHeader>
      <CardContent className="grid gap-4">

        <div className="h-[210px]">
          <img
            src={nftItem.uri}
            alt="NFT"
            width={210}
            height={210}
          />
          {/* <Image src="https://raw.githubusercontent.com/SimpLe-L/simp1e-blog/main/public/donkeys/0/images/3.png" alt="NFT" width={210} height={210}></Image> */}
        </div>

        <div>
          <div
            className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                价格: {nftItem.price}
              </p>
            </div>
          </div>
          <div
            className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                拥有者：{resetAddress(nftItem.seller)}
              </p>
            </div>
          </div>
        </div>
        <div className='w-[92px] h-[30px] rounded-[14px] bg-[--button-bg] text-[--basic-text] flex justify-center items-center font-bold cursor-pointer' onClick={handleClick}>
          {
            nftItem.seller == address ? "unlist" : "buy"
          }
        </div>
      </CardContent>
    </Card>
  )
}

export default MarketCard