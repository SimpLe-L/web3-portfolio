"use client"

// import { useEffect, useState } from 'react';
import DisplayCampaigns from '../../components/DisplayCampaigns';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'next/navigation'
import { useAccount, useReadContract } from 'wagmi';
import { crowdFundingAbi } from "~/crowdFunding";
import { contractAddress } from '@/configs';
import { campaignTypeArr } from '@/types';

const CrowdFounding = () => {
  const { address } = useAccount();
  const router = useRouter();
  // const [displayData, setDispalyData] = useState<campaignTypeArr>([]);

  const { data, isLoading } = useReadContract({
    abi: crowdFundingAbi,
    address: contractAddress,
    functionName: 'getCampaigns'
  });

  let convertData: campaignTypeArr = [];
  if (data) {
    convertData = data.map((campaign, index) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: campaign.target,
      deadline: campaign.deadline,
      amountCollected: campaign.amountCollected,
      image: campaign.image,
      pId: index
    }));
  }

  // console.log("convertData", data, convertData);
  // setDispalyData(convertData);

  // const myCampaigns = () => {
  //   const filteredCampaigns = convertData!.filter((campaign) => campaign.owner === address);
  //   setDispalyData(filteredCampaigns);
  // }

  return (
    <div className='flex flex-col gap-[10px]'>
      <div className='flex w-full justify-center gap-2'>
        <ConnectButton />

        <CustomButton
          btnType="button"
          title="发起项目"
          styles="bg-[#1dc071]"
          handleClick={() => {
            router.push('/dapp/crowdfunding/create');
          }}
        />

        {/* <CustomButton
          btnType="button"
          title="我的项目"
          styles="bg-[#1dc071]"
          handleClick={() => {
            myCampaigns();
          }}
        /> */}
      </div>
      <DisplayCampaigns
        title="所有项目"
        isLoading={isLoading}
        campaigns={convertData}
      />
    </div>
  );
};

export default CrowdFounding;
