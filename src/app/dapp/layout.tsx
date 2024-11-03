// "use client"

import AsideComponent from "@/components/DappAside/DappAside";
import { useEffect } from "react";

const menuList = [
  {
    menuName: "web3展板",
    list: [
      {
        title: "众筹",
        path: "/dapp/crowdfunding",
      },
      {
        title: "swap demo",
        path: "/dapp/uniswap",
      },
      {
        title: "NFT MINT",
        path: "/dapp/nft",
      },
      {
        title: "质押挖矿",
        path: "/dapp/staking",
      }
    ]
  }
]

const DappLayout = ({ children }: { children: React.ReactNode }) => {
  // useEffect(() => {
  //   document.body.classList.add('dark');
  // }, []);
  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="flex-[1]">
        <AsideComponent menuList={menuList} />
      </div>
      <div className="flex-[4] p-4">
        {children}
      </div>
    </div>
  )
}

export default DappLayout;