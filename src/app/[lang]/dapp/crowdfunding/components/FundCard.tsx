import React from 'react';

// import { tagType, thirdweb } from '../assets';
import { daysLeft } from '@/utils';
import { CampaignWithoutId } from '@/types';
import { formatEther } from 'viem';

const FundCard = ({ owner, title, description, target, deadline, amountCollected, image, handleClick }: CampaignWithoutId) => {
  const remainingDays = daysLeft(Number(deadline))

  return (
    <div className="sm:w-[288px] w-full rounded-[15px] bg-[--card-bg] cursor-pointer" onClick={handleClick}>
      <img src={image} alt="fund" className="w-full h-[158px] rounded-[16px] hover:scale-105 transform transition p-2" />

      <div className="flex flex-col p-4">

        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">{title}</h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{description}</p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">已筹集 {formatEther(amountCollected)} ETH</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">筹集目标 {formatEther(target)} ETH</p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{remainingDays}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">剩余天数</p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            {/* <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain" /> */}
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">by <span className="text-[#b2b3bd]">{owner}</span></p>
        </div>
      </div>
    </div>
  )
}

export default FundCard