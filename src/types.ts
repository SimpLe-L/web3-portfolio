import { Address, type Hex } from "viem";
// import { EIP712TypedData } from "./signature";
import { TypedData, TypedDataDomain } from "abitype";


export interface IMenuItem {
  path: string;
  icon?: JSX.Element;
  title: string;
}

export interface IMenu {
  menuName: string;
  list: IMenuItem[]
}

export interface INftProperties {
  owner: `0x${string}`;
  tokenId: bigint;
  level: number;
  faId: bigint;
  moId: bigint;
  uri: string;
}

// export interface IResponse {
//   IpfsHash: string;
//   PinSize: number;
//   Timestamp: string;
// }

// export type campaignResArr = {
//   owner: `0x${string}`;
//   title: string;
//   description: string;
//   target: string;
//   deadline: number;
//   amountCollected: string;
//   image: string;
//   pId: number;
// }[] | [] | undefined

export type campaignTypeArr = {
  owner: `0x${string}`;
  title: string;
  description: string;
  target: bigint;
  deadline: bigint;
  amountCollected: bigint;
  image: string;
  pId: number;
}[] | undefined | []

// export type campaignRes = {
//   owner: `0x${string}`;
//   title: string;
//   description: string;
//   target: string;
//   deadline: number;
//   amountCollected: string;
//   image: string;
//   pId: number;
// }

export type campaignType = {
  owner: `0x${string}`;
  title: string;
  description: string;
  target: bigint;
  deadline: bigint;
  amountCollected: bigint;
  image: string;
  pId: number;
}

export type CampaignWithoutId = Omit<campaignType, 'pId'> & {
  // 添加点击函数
  // handleNavigate: (campaign: campaignRes) => void;
  handleClick: any;
};

// export type DonationsArr = {
//   donator: `0x${string}`;
//   donation: string;
// }[] | []

// export type DonationRes = {
//   donator: `0x${string}`;
//   donation: string;
// }


// swap types
export interface EIP712TypedData {
  types: TypedData;
  domain: TypedDataDomain;
  message: {
    [key: string]: unknown;
  };
  primaryType: string;
}

export interface PriceResponse {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  buyAmount: string;
  grossSellAmount: string;
  grossBuyAmount: string;
  allowanceTarget: Address;
  route: [];
  fees: {
    integratorFee: {
      amount: string;
      token: string;
      type: "volume" | "gas";
    } | null;
    zeroExFee: {
      billingType: "on-chain" | "off-chain";
      feeAmount: string;
      feeToken: Address;
      feeType: "volume" | "gas";
    };
    gasFee: null;
  } | null;
  gas: string;
  gasPrice: string;
  auxiliaryChainData?: {
    l1GasEstimate?: number;
  };
}

export interface QuoteResponse {
  sellToken: Address;
  buyToken: Address;
  sellAmount: string;
  buyAmount: string;
  grossSellAmount: string;
  grossBuyAmount: string;
  gasPrice: string;
  allowanceTarget: Address;
  route: [];
  fees: {
    integratorFee: {
      amount: string;
      token: string;
      type: "volume" | "gas";
    } | null;
    zeroExFee: {
      billingType: "on-chain" | "off-chain";
      feeAmount: string;
      feeToken: Address;
      feeType: "volume" | "gas";
    };
    gasFee: null;
  } | null;
  auxiliaryChainData: {};
  to: Address;
  data: Hex;
  value: string;
  gas: string;
  permit2: {
    type: "Permit2";
    hash: Hex;
    eip712: EIP712TypedData;
  };
  transaction: V2QuoteTransaction;
  tokenMetadata: {
    buyToken: {
      buyTaxBps: string | null;
      sellTaxBps: string | null;
    };
    sellToken: {
      buyTaxBps: string | null;
      sellTaxBps: string | null;
    };
  };
}

export interface V2QuoteTransaction {
  data: Hex;
  gas: string | null;
  gasPrice: string;
  to: Address;
  value: string;
}

