import AsideComponent from "@/components/DappAside/DappAside";


const menuList = [
  {
    menuName: "web3相关",
    list: [
      {
        title: "众筹",
        path: "/dapp/crowdfunding/list",
      },
      {
        title: "swap demo",
        path: "/dapp/swap",
      },
      {
        title: "NFT",
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

  return (
    <div className="flex h-full">
      <div className="flex-[1]">
        <AsideComponent menuList={menuList} />
      </div>
      <div className="flex-[4]">
        {children}
      </div>
    </div>
  )
}

export default DappLayout;