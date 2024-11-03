import { FormEvent, useEffect } from 'react';
import { Button, Card, CardBody, CardTitle, Form, Input, UncontrolledTooltip } from "reactstrap";
import { ethers } from "ethers";
import { useWaitForTransactionReceipt, useWriteContract, type BaseError } from "wagmi";
import abi from '../../contracts/abi/NFTMarketplace.json';
import { toast } from "react-toastify";


const marketContractConfig = {
  abi,
  address: import.meta.env.VITE_MARKET_CONTRACT_ADDRESS,
};

interface IOfferCardProps {
  offer: {
    nonce: bigint;
    quantity: bigint;
    price: bigint;
    signature: string;
  }
}
const OfferCard = ({ offer }: IOfferCardProps) => {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  // const resultVerifyTypedData = useVerifyTypedData({
  // 	config,
  // 	// chainId: sepolia.id,
  // 	domain,
  // 	types,
  // 	message: {
  // 		nonce: offer.nonce,
  // 		quantity: offer.quantity,
  // 		price: offer.price,
  // 	},
  // 	primaryType: 'Offer',
  // 	address: import.meta.env.VITE_OFFERS_SIGNER_ADDRESS,
  // 	signature: offer.signature,
  // });
  // console.log("resultVerifyTypedData", resultVerifyTypedData);

  const buySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const address = formData.get('address') as string;

    writeContract({
      ...marketContractConfig,
      functionName: 'redeem',
      args: [address, offer],
      value: offer.price,
    });
  };

  useEffect(() => {
    if (hash) toast.info(`Transaction Hash: ${hash}`);
    if (isConfirming) toast.info(`Waiting for confirmation...`);
    if (isConfirmed) toast.success(`Transaction confirmed.`);
    if (error) toast.error(`Error: ${(error as BaseError).shortMessage || error.message}`);
  }, [hash, isConfirming, isConfirmed, error]);

  return (
    <Card style={{ width: '300px' }}>
      <img alt="" src="/question.png" />
      <CardBody className="d-flex flex-column">

        <div>
          <CardTitle tag="h5">Quantity: {Number(offer.quantity)}</CardTitle>
          <CardTitle tag="h5">Price: {ethers.formatUnits(offer.price)} ETH</CardTitle>

          <CardTitle tag="h5" id={"SignatureTooltip" + offer.signature}>
            Signature: {offer.signature.slice(0, 10)}...
          </CardTitle>
          <UncontrolledTooltip target={"SignatureTooltip" + offer.signature} autohide={false}>
            {offer.signature}
          </UncontrolledTooltip>
        </div>

        <Form onSubmit={buySubmit}>
          <Input
            type="text"
            name="address"
            placeholder="Enter your address"
            required
          />
          <Button
            type="submit"
            color="primary"
            disabled={isPending}
          >
            {isPending ? 'Confirming...' : 'Buy'}
          </Button>
        </Form>

      </CardBody>
    </Card>
  );
};

export default OfferCard;