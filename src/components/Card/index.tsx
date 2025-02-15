import { ReactNode } from "react";

interface CardProps {
  image: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

export const Card = ({ image, title, description, children }: CardProps) => {
  return (
    <div className="bg-white rounded-lg py-[25px] px-[22px] flex gap-6">
      <div className="w-[125px] h-full">{image}</div>
      <div className="flex-1 flex flex-col">
        <h3 className="text-[16px] font-medium text-black">{title}</h3>
        <p className="text-[14px] font-normal text-[#8F8F8F]">{description}</p>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
};
