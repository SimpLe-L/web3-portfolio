import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const DappPage = () => {
  // const { data: hash, writeContract, isPending, error } = useWriteContract();
  // const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  return (
    <div className="flex flex-col h-full">
      {/* loading组件改模糊背景 */}
      <span className="text-lg text-[--basic-text]">Tips: </span>
      <span className="text-base text-[--secondry-text]">1.示例合约均部署在sepolia测试网，需要账户有sepolia测试币</span>
      <span className="text-base text-[--secondry-text]">2.确保能访问github，因nft图片未放在IPFS</span>

      <div className="flex-[1] flex justify-center py-6">
        <div className="w-[600px] grid grid-cols-2 gap-4">
          <Card className={"w-[100%] text-white bg-[--card-bg] border-[--split-line] cursor-pointer rotate-[-20deg] hover:scale-110 hover:z-10"}>
            <CardHeader>
              <CardTitle>
                <Link href="/dapp/crowdfunding" className="underline">众筹项目</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-[--secondry-text] text-sm">众筹项目，包含了项目的创建及捐款功能。创建项目后更新列表，点击项目后可跳转项目详情进行捐款。</p>
              <div className="w-full h-full">
                {/* <Image src="" alt="NFT" width={210} height={210}></Image> */}
                <img src="/crowdfunding.png" alt="nft" className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className={"w-[100%] text-white bg-[--card-bg] border-[--split-line] cursor-pointer rotate-[10deg] hover:scale-110 hover:z-10"}>
            <CardHeader>
              <CardTitle>
                <Link href="/dapp/nft" className="underline">NFT项目</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-[--secondry-text] text-sm">点击mint进行NFT铸造；勾选两个同等级NFT后点击合成可进行NFT的合成。上架后跳转到市场，可进行下架及购买。</p>
              <div className="w-full h-[100px]">
                {/* <Image src="" alt="NFT" width={210} height={210}></Image> */}
                <img src="/nft.png" alt="nft" className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className={"w-[100%] text-white bg-[--card-bg] border-[--split-line] cursor-pointer -translate-x-6 rotate-[10deg] hover:scale-110 hover:z-10"}>
            <CardHeader>
              <CardTitle>
                <Link href="/dapp/uniswap" className="underline">swap demo</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-[--secondry-text] text-sm">使用Uniswap SDK实现的demo，在主网进行交易。</p>
              <div className="w-full h-[100px]">
                {/* <Image src="" alt="NFT" width={210} height={210}></Image> */}
                <img src="/swap.png" alt="nft" className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className={"w-[100%] text-white bg-[--card-bg] border-[--split-line] cursor-pointer hover:scale-110 hover:z-10"}>
            <CardHeader>
              <CardTitle>
                <Link href="/dapp" className="underline">黑客松-carbon miner</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-[--secondry-text] text-sm">一个碳排放量交易的平台，企业可以申请入驻，进行碳排放量的购买和出售。xxxx黑客松第xx名。</p>
            </CardContent>
          </Card>
        </div>
      </div>



    </div>
  )
}

export default DappPage;