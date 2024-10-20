"use client"

import { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { parseUnits } from 'ethers';

// import { useStateContext } from '@/contexts/CrowdFundingContext';
import { useAccount, useWriteContract } from 'wagmi'
import { crowdFundingAbi } from "~/crowdFunding";
import { contractAddress } from '@/configs';
import FormField from "../../components/FormField"
import CustomButton from "../../components/CustomButton"
import Loader from "../../components/Loader"
import { checkIfImage } from '@/utils';
import { useRouter } from 'next/navigation';
// import {parse} from "ethers"

const CreateCampaign = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false);
  // const { publishCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: "",
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName: string, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists: any) => {
      if (exists) {
        setIsLoading(true)
        const data = await writeContractAsync({
          abi: crowdFundingAbi,
          address: contractAddress,
          functionName: 'createCampaign',
          args: [
            address!, // owner
            form.title, // title
            form.description, // description
            BigInt(form.target),
            BigInt(new Date(form.deadline).getTime()), // deadline,
            form.image,
          ],
        }, {
          onSuccess: (data) => {
            console.log("www", data);
            router.push('/dapp/crowdfunding/list');
          }
        })
        setIsLoading(false);
        // navigate('/');
        // router.push('/dapp/crowdfunding/create');
      } else {
        alert('Provide valid image URL')
        setForm({ ...form, image: '' });
      }
    })
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <FormField
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  )
}

export default CreateCampaign