import { useState } from "react";
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils";
import { useAccount, useWriteContract, type BaseError } from "wagmi";
import { waitForTransactionReceipt } from '@wagmi/core'
import { crowdFundingAbi } from "~/crowdFunding";
import { crowdfundingAddress } from "@/configs";
import Loader from "../components/Loader";
import { parseUnits } from "viem";
import { wagmiConfig } from "@/utils/wagmiConfig";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  title: z.string({
    required_error: "输入项目名称",
  }),
  description: z.string(
    {
      required_error: "输入项目描述",
    }
  ),
  target: z.string(
    {
      required_error: "输入筹集目标",
    }
  ),
  deadline: z.date({
    required_error: "选择截止日期",
  }),
  imageUrl: z.string(
    {
      required_error: "输入项目图片",
    }
  ),
});

interface props {
  clsoseDialog: (state: boolean) => void,
  refetch: any
}

const CreateCard = ({ clsoseDialog, refetch }: props) => {

  const { toast } = useToast();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: async (hash, variables) => {
        const listReceipt = await waitForTransactionReceipt(wagmiConfig,
          { hash });
        if (listReceipt.status === "success") {
          toast({
            description: "创建项目成功！",
          });
          setIsLoading(false);
          clsoseDialog(false);
          refetch();
        }
      },
      onError: (error) => {
        toast({
          description: "Error: " + ((error as BaseError).shortMessage || error.message)
        });
      }
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async () => {
    const getFormValues = form.getValues();
    setIsLoading(true);
    writeContract({
      abi: crowdFundingAbi,
      address: crowdfundingAddress,
      functionName: 'createCampaign',
      args: [
        address!, // owner
        getFormValues.title, // title
        getFormValues.description, // description
        parseUnits(getFormValues.target, 18),
        // BigInt(getFormValues.target),
        BigInt(getFormValues.deadline.getTime()), // deadline,
        getFormValues.imageUrl,
      ],
    })
  }

  return (
    <>
      {isLoading && <Loader />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>title</FormLabel>
                <FormControl>
                  <Input placeholder="输入项目名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>description</FormLabel>
                <FormControl>
                  <Input placeholder="输入项目描述" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>target</FormLabel>
                <FormControl>
                  <Input placeholder="0.5ETH" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>截止日期</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date <= new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>image</FormLabel>
                <FormControl>
                  <Input placeholder="输入图片地址" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-end gap-2">
            <Button type="submit" className="w-full bg-[--button-bg] text-[--basic-text] hover:bg-[--button-bg]">确认</Button>
          </div>

        </form>
      </Form>
    </>
  )
}


export default CreateCard;