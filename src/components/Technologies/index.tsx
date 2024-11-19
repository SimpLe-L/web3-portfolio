"use client"

import { motion } from "framer-motion";
import { SlideLeft } from "@/utils";

const skillsArr = [
  {
    name: "React",
    svgPath: "/react.svg",
    delay: 0.2
  },
  {
    name: "Vue",
    svgPath: "/Vue.svg",
    delay: 0.4
  },
  {
    name: "TypeScript",
    svgPath: "/ts.svg",
    delay: 0.6
  },
  {
    name: "Nextjs",
    svgPath: "/nextjs.svg",
    delay: 0.8
  },
  {
    name: "Tailwindcss",
    svgPath: "/tailwindcss.svg",
    delay: 1
  },
  {
    name: "Wagmi",
    svgPath: "/wagmi.svg",
    delay: 1.2
  },
  {
    name: "Viem",
    svgPath: "/viem.png",
    delay: 1.4
  }
]

const Technologies = () => {
  return (
    <>
      <div className="container py-6">
        <motion.div
          variants={SlideLeft(0.2)}
          initial="initial"
          animate="animate"
          className="text-2xl font-bold font-serif mb-2 text-[--secondry-text]"
        >
          常用技术栈：
        </motion.div>
        <div className="flex flex-wrap justify-center lg:justify-between gap-6">
          {
            skillsArr.map((item, index) => {
              return <motion.img
                key={index}
                variants={SlideLeft(item.delay)}
                initial="initial"
                whileInView={"animate"}
                src={item.svgPath}
                alt="brand"
                className="w-[40px] md:w-[60px]"
              />
            })
          }
        </div>
      </div>
    </>
  )
}

export default Technologies;