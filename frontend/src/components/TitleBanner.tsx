interface BannerProps {
    title: string;
}


const TitleBanner = ({ title }: BannerProps) => {
    return (
    <div className="max-w-md mx-auto lg:max-w-[720px] bg-white/90 p-3 rounded shadow mt-10">
      <h2 className="flex justify-center text-2xl text-black font-bold">{title}</h2>
    </div>
  );
};

export default TitleBanner;
