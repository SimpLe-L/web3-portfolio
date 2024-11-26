import SelfIntroduction from "@/components/SelfIntroduction";
import Technologies from "@/components/Technologies";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-16">
      <SelfIntroduction />
      <Technologies />
    </div>
  );
}