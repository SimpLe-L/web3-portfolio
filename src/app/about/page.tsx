"use client"

import { SlideUp } from "@/utils"
import { motion } from "framer-motion"

const AboutPage = () => {
  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col px-6 py-10">
      <section className="prose dark:prose-invert prose-neutral w-screen-wrapper max-w-screen-wrapper mx-auto">
        <motion.h2
          variants={SlideUp(0.1)}
          initial="initial"
          animate="animate"
          className="text-3xl md:text-4xl text-[--basic-text] font-bold my-8">关于</motion.h2>
        <motion.div
          variants={SlideUp(0.2)}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-[--basic-text] text-2xl my-4">我是谁</h2>
          <p className="text-[--secondry-text]">
            Hey~ 我是Simple，一名4年经验的前端开发，有React和Vue框架经验，做过Gis相关开发。目前正努力投身于web3行业，欢迎交流~
          </p>
        </motion.div>

        <motion.div
          variants={SlideUp(0.4)}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-[--basic-text] text-2xl my-4">我的技能</h2>
        </motion.div>

        <motion.div
          variants={SlideUp(0.6)}
          initial="initial"
          animate="animate"
        >
          <h3 className="text-[--basic-text] text-xl my-4">前端</h3>
          <ul className="text-[--secondry-text] flex flex-col gap-2">
            <li>
              熟悉 React + Next.js + TypeScript + Tailwind CSS技术栈
            </li>
            <li>
              熟悉 Vue 相关技术，从零到一完成项目开发
            </li>
          </ul>
        </motion.div>
        <motion.div
          variants={SlideUp(0.8)}
          initial="initial"
          animate="animate"
        >
          <h3 className="text-[--basic-text] text-xl my-4">后端</h3>
          <ul className="text-[--secondry-text] flex flex-col gap-2">
            <li>
              Node.js，能使用Koa/express实现简单的 CRUD
            </li>
            <li>
              对Next.js + Prisma + Prisma + PostgreSQL + Vercel有实践经验
            </li>
          </ul>
        </motion.div>
        <motion.div
          variants={SlideUp(1)}
          initial="initial"
          animate="animate"
        >
          <h3 className="text-[--basic-text] text-xl my-4">其它</h3>
          <ul className="text-[--secondry-text] flex flex-col gap-2">
            <li>
              基于Jekins+Gitlab搭建过CI/CD流程，简化部署流程
            </li>
            <li>
              能使用Foundry框架配合OpenZeppelin库进行简单的合约开发及部署，供开发时调用
            </li>
          </ul>
        </motion.div>
      </section>
    </div>
  )
}

export default AboutPage