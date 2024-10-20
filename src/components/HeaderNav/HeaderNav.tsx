import Link from "next/link"

const navList = [
  {
    name: "首页",
    path: "/",
    id: 1
  },
  {
    name: "Dapp",
    path: "/dapp",
    id: 2
  },
  {
    name: "About",
    path: "/about",
    id: 3
  },
]

const HeaderNav = () => {
  return (
    <header className="w-full flex justify-between items-center py-4 px-28">
      <div>logo</div>
      <div className="flex gap-4">
        {
          navList.map(item => {
            return <div className="p-[4px]" key={item.id}>
              <Link className="text-[--basic-header]" href={item.path}>{item.name}</Link>
            </div>
          })
        }
      </div>

    </header>
  )
}

export default HeaderNav;