import SelfIntroduction from "@/components/SelfIntroduction";
import Technologies from "@/components/Technologies";
// import { getDictionary } from "@/get-dictionaries";

export default function Home() {
  // const dict = await getDictionary("zh");
  return (
    <div className="flex flex-col items-center justify-center h-full gap-16">
      <SelfIntroduction />
      <Technologies />
    </div>
  );
}