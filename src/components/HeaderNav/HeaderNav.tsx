"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link"

const navList = [
  {
    name: "Home",
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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-center items-center border-b border-[--split-line]"
    >
      <div className="container flex justify-between items-center py-4">
        <div className="gradient-text cursor-pointer">
          <Link href="/" className="font-bold text-2xl">Simple</Link>
        </div>
        <div className="flex gap-4">
          {
            navList.map(item => {
              return <div className="p-[4px]" key={item.id}>
                <Link className="text-[--basic-text]" href={item.path}>{item.name}</Link>
              </div>
            })
          }
        </div>

        <div className="flex gap-3">
          <Image
            width={24}
            height={24}
            src="/images/telegram.svg"
            alt="github"
            className="object-contain cursor-pointer"
          />
          <Image
            width={24}
            height={24}
            src="/images/x.svg"
            alt="github"
            className="object-contain cursor-pointer"
          />
          <Image
            width={24}
            height={24}
            src="/images/github.svg"
            alt="github"
            className="object-contain cursor-pointer"
          />
        </div>
      </div>


    </motion.header>
  )
}

export default HeaderNav;