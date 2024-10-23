"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import CountBox from "../components/CountBox"
import CustomButton from "../components/CustomButton"
import Loader from "../components/Loader"
import { calculateBarPercentage, daysLeft } from '@/utils';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { crowdFundingAbi } from '~/crowdFunding';
import { contractAddress } from '@/configs';
import { parseEther } from 'viem';

const CampaignDetails = () => {
  const { address } = useAccount();
  console.log(address);
  const searchParams = useSearchParams();
  const dataString = searchParams.get('data');
  const state = dataString ? JSON.parse(decodeURIComponent(dataString)) : {};
  const remainingDays = daysLeft(Number(state.deadline));

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { writeContractAsync } = useWriteContract();
  const [amount, setAmount] = useState('');
  const { data: donators } = useReadContract({
    abi: crowdFundingAbi,
    address: contractAddress,
    functionName: 'getDonators',
    args: [state.pId]
  });
  const donatorsLength = donators?.[0]?.length ?? 0;
  const handleDonate = async () => {
    setIsLoading(true);
    const data = await writeContractAsync({
      abi: crowdFundingAbi,
      address: contractAddress,
      functionName: 'donateToCampaign',
      args: [
        state.pId
      ],
      value: parseEther(amount)
    }, {
      onSuccess: (data) => {
        setIsLoading(false);
        router.push('/dapp/crowdfunding/list');
      }
    })
  }

  // const withdrawMethod = () => { }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col gap-[20px] px-2">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="剩余天数" value={remainingDays} />
          <CountBox title={`筹集目标 ${state.target} ETH`} value={state.amountCollected} />
          <CountBox title="总捐献人数" value={donatorsLength} />
        </div>
      </div>

      <div className="mt-[40px] flex lg:flex-row flex-col gap-5 px-2">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[--basic-text]">发起者</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                {/* <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" /> */}
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] break-all text-[--secondry-text]">{state.owner}</h4>
                {/* <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 项目</p> */}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[--basic-text]">描述</h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[--secondry-text] leading-[26px] text-justify">{state.description}</p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[--basic-text]">捐献者</h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donatorsLength > 0 ? donators![0].map((item: any, index: number) => (
                <div key={`${item.donator}-${index}`} className="flex flex-col justify-between items-start gap-4 overflow-y-auto h-[70px]">
                  <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item}</p>
                  {/* <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation}</p> */}
                </div>
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[--secondry-text] leading-[26px] text-justify">还未有人捐献!</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {/* <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">捐献入口</h4> */}

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              支持该项目
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">支持该项目请进行捐款吧！</h4>
                {/* <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]"></p> */}
              </div>

              <CustomButton
                btnType="button"
                title="捐赠"
                styles="w-full bg-[--button-bg]"
                handleClick={handleDonate}
              />
              {/* {
                state.owner == address && <CustomButton
                  btnType="button"
                  title="取款"
                  remain={remainingDays}
                  styles="w-full bg-[--button-bg] mt-1"
                  handleClick={withdrawMethod}
                />
              } */}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails