// import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { INftProperties } from '@/types';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { parseUnits } from 'viem'

interface ICardProp {
  data: INftProperties,
  handleNftCheck: (tokenId: bigint, value: boolean) => void
  handleList: (id: bigint, price: bigint) => void
}

const resetAddress = (owner: string) => `${owner.slice(0, 4)}...${owner.slice(38)}`;

export function NFTCard({ data, handleNftCheck, handleList }: ICardProp) {

  const [price, setPrice] = useState<string>('');
  const valueChange = (value: boolean) => {
    handleNftCheck(data.tokenId, value);
  }

  const listNFT = () => {
    handleList(data.tokenId, parseUnits(price, 18));
  }

  return (
    <Card className={cn("w-[260px] text-white h-[450px] bg-[--card-bg] border-[--card-bg]")}>
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
        <Dialog>
          <DialogTrigger asChild>
            <div className='w-[92px] h-[30px] rounded-[14px] bg-[--button-bg] text-[--basic-text] flex justify-center items-center font-bold cursor-pointer'>LIST</div>
          </DialogTrigger>
          <DialogContent className='border-[--card-bg]'>
            <DialogHeader>
              <DialogTitle className='text-[--basic-text]'>上架NFT</DialogTitle>
            </DialogHeader>
            <Input
              value={price}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
              placeholder="0.01ETH" />
            <DialogFooter className="justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  取消
                </Button>
              </DialogClose>
              <Button onClick={listNFT}>
                上架
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
