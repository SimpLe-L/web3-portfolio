"use client"

import { motion } from "framer-motion";
import { SlideUp } from "@/utils";

const SelfIntroduction = async () => {

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[600px] gap-10">
        <div className="flex flex-col justify-center gap-7 md:pr-8 xl:pr-52 text-center md:text-left pt-20 md:pt-0 px-10 text-[--basic-text]">
          <motion.h1
            variants={SlideUp(0.2)}
            initial="initial"
            animate="animate"
            className="text-4xl font-bold intro"
          >
            你好，我是Simple
          </motion.h1>
          <motion.p
            variants={SlideUp(0.5)}
            initial="initial"
            animate="animate"
            className="text-sm md:text-base text-[--secondry-text] leading-7"
          >
            一名前端开发，熟悉React,Next.js和Tailwind等技术栈，目前正向着web3全栈的目标前进，欢迎找我聊聊。
          </motion.p>
          <div className="space-x-4">
            <motion.button
              variants={SlideUp(0.8)}
              initial="initial"
              animate="animate"
              className="primary-btn uppercase bg-[--card-bg] text-white shadow-[5px_5px_0px_0px_#6c6c6c] px-3 py-1"
            >
              Github
            </motion.button>
            <motion.button
              variants={SlideUp(1.1)}
              initial="initial"
              animate="animate"
              className="primary-btn uppercase bg-[--basic-text] text-[#16161a] shadow-[5px_7px_0px_0px_#242629] px-3 py-1 hover:bg-[--card-bg] hover:text-white hover:shadow-[5px_5px_0px_0px_#6c6c6c]"
            >
              Contact
            </motion.button>
          </div>
        </div>
        {/* Images section */}
        <div className="flex flex-col items-center justify-center">
          <motion.img
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            src="/images/home.svg"
            alt=""
            className="w-[80%] md:w-[600px] object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default SelfIntroduction;