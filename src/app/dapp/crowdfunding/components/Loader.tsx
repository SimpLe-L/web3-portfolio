// import { loader } from '@/assets';
import Image from 'next/image';

const Loader = () => {
  return (
    <div className="w-full h-full absolute inset-0 z-10 flex items-center justify-center flex-col">
      {/* <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" /> */}
      <Image
        src="/loader.svg"
        width={100}
        height={100}
        className="object-contain"
        alt="loader"
      />
      <p className="mt-[20px] font-epilogue font-bold text-[20px] text-white text-center">交易进行中 <br /> 请稍等...</p>
    </div>
  )
}

export default Loader