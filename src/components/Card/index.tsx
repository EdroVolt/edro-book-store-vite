import { ReactNode } from "react";

interface CardProps {
  leftComponent: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

export const Card = ({
  leftComponent,
  title,
  description,
  children,
}: CardProps) => {
  return (
    <div className="w-full h-full bg-white rounded-lg py-[25px] px-[22px] flex gap-6">
      <div className="w-[125px] h-[164px]">{leftComponent}</div>
      <div className="flex-1 flex flex-col">
        <h3 className="text-[16px] font-medium text-black">{title}</h3>
        <p className="text-[14px] font-normal text-[#8F8F8F]">{description}</p>
        {children}
      </div>
    </div>
  );
};
