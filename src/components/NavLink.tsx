import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  to: string;
  icon: React.ReactElement;
  title: string;
}

export const NavLink = ({ to, icon, title }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-8 py-3 transition-colors hover:bg-gray-50 
      ${
        isActive
          ? "border-l-[3px] border-[#BF5523] text-[#BF5523]"
          : "border-l-[3px] border-transparent text-[#131313]"
      }`}
    >
      {icon}
      <span className="font-medium">{title}</span>
    </Link>
  );
};
