import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import { campaignTypeArr } from '@/types';
import { formatEther } from 'viem';

const DisplayCampaigns = ({ title, isLoading, campaigns }: { title: string, isLoading: boolean, campaigns: campaignTypeArr }) => {
  // const navigate = useNavigate();
  const router = useRouter();

  const handleNavigate = (campaign: any) => {
    const convertData = {
      ...campaign,
      amountCollected: formatEther(campaign.amountCollected),
      target: campaign.target.toString(),
      deadline: campaign.deadline.toString(),
    }
    // console.log(convertData);
    const queryString = encodeURIComponent(JSON.stringify(convertData));
    router.push(`/dapp/crowdfunding/${campaign.title}?data=${queryString}`);
  }

  return (
    <div className='px-2'>
      <h1 className="font-epilogue font-semibold text-[18px] text-left">{title} ({campaigns && campaigns!.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          // <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
          <Image
            src="/loader.svg"
            width={100}
            height={100}
            className="object-contain"
            alt="loader"
          />
        )}

        {!isLoading && campaigns!.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            未查询到项目
          </p>
        )}

        {!isLoading && campaigns!.length > 0 && campaigns!.map((campaign) => <FundCard
          key={uuidv4()}
          {...campaign}
          handleClick={() => handleNavigate(campaign)}
        />)}
      </div>
    </div>
  )
}

export default DisplayCampaigns