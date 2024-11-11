"use client"

import { SlideLeft, SlideRight, SlideUp } from "@/utils"
import { motion } from "framer-motion"
import AsideComponent from "@/components/DappAside/DappAside";

const menuList = [
  {
    menuName: "web3展板",
    list: [
      {
        title: "众筹",
        path: "/dapp/crowdfunding",
      },
      {
        title: "NFT",
        path: "/dapp/nft",
      },
      {
        title: "swap demo",
        path: "/dapp/uniswap",
      },
      {
        title: "carbon miner",
        path: "/dapp/staking",
      }
    ]
  }
]

const DappLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <motion.div
        variants={SlideRight(0.2)}
        initial="initial"
        animate="animate"
        className="flex-[1]">
        <AsideComponent menuList={menuList} />
      </motion.div>
      <motion.div
        variants={SlideLeft(0.3)}
        initial="initial"
        animate="animate"
        className="flex-[4] p-4">
        {children}
      </motion.div>
    </div>
  )
}

export default DappLayout;