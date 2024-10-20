// import Image from "next/image";
import { combine } from "@/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { INftProperties } from '@/types';
interface ICardProp {
  data: INftProperties,
  handleNftCheck: (tokenId: bigint, value: boolean) => void
}

const resetAddress = (owner: string) => `${owner.slice(0, 4)}...${owner.slice(38)}`;

export function NFTCard({ data, handleNftCheck }: ICardProp) {
  const valueChange = (value: boolean) => {
    handleNftCheck(data.tokenId, value);
  }
  return (
    <Card className={combine("w-[260px] text-white h-[450px]")}>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle> #{String(data.tokenId)}</CardTitle>
        <div className="flex items-center space-x-2">
          <Checkbox className="text-white border-white" id="terms" onCheckedChange={valueChange} />
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            勾选
          </label>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">

        <div className="h-[210px]">
          <img
            src={data.uri}
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
                等级: {data.level}
              </p>
            </div>
          </div>
          <div
            className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                fatherId: {String(data.faId)}
              </p>
            </div>
          </div>
          <div
            className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                motherId: {String(data.moId)}
              </p>
            </div>
          </div>
          <div
            className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                拥有者：{resetAddress(data.owner)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
