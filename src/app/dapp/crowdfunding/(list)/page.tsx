"use client"

import { useState, useRef } from 'react';
import DisplayCampaigns from '../components/DisplayCampaigns';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract } from 'wagmi';
import { crowdFundingAbi } from "~/crowdFunding";
import { contractAddress } from '@/configs';
import { campaignTypeArr } from '@/types';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateCard from './createCard';
// import { Button } from '@/components/ui/button';

const CrowdFounding = () => {

  const [showDialog, setShowDialog] = useState(false);
  const handleChange = (value: boolean) => {
    setShowDialog(value);
  }
  // const [displayData, setDispalyData] = useState<campaignTypeArr>([]);

  const { data, isLoading, refetch } = useReadContract({
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

  return (
    <div className='flex flex-col gap-[10px]'>
      <div className='flex w-full justify-center gap-2'>
        <ConnectButton />

        <Dialog open={showDialog} onOpenChange={handleChange}>
          <DialogTrigger asChild>
            <div className='w-[92px] h-[40px] rounded-[14px] bg-[--button-bg] text-[--basic-text] flex justify-center items-center font-bold cursor-pointer'>创建项目</div>
          </DialogTrigger>
          <DialogContent className='border-[--card-bg]'>
            <DialogHeader>
              <DialogTitle className='text-[--basic-text]'>创建项目</DialogTitle>
            </DialogHeader>
            <CreateCard clsoseDialog={setShowDialog} refetch={refetch} />
          </DialogContent>
        </Dialog>
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
