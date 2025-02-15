import { ReactNode, useMemo } from "react";
import { NavLink } from "./components/NavLink";
import { useLocation } from "react-router-dom";
import ShopIcon from "./components/icons/ShopIcon";
import StoresIcon from "./components/icons/StoresIcon";
import AuthorIcon from "./components/icons/AuthorIcon";
import BooksIcon from "./components/icons/BooksIcon";
import BrandLogo from "./components/icons/BrandLogo";
import ProfileImage from "./assets/profile.png";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();

  const currentPage = useMemo(() => {
    const routes: { [key: string]: string } = {
      "/": "Shop",
      "/stores": "Stores",
      "/author": "Author",
      "/books": "Books",
    };
    return routes[pathname] || "";
  }, [pathname]);

  return (
    <div className="flex gap-8 min-h-screen bg-[#F1F1F1]">
      <aside className="w-[248px] max-h-full bg-white">
        <div className="ml-[29px] my-[52px]">
          <BrandLogo />
        </div>
        <nav className="flex flex-col gap-6">
          <NavLink to="/" icon={<ShopIcon />} title="Shop" />
          <NavLink to="/stores" icon={<StoresIcon />} title="Stores" />
          <NavLink to="/author" icon={<AuthorIcon />} title="Author" />
          <NavLink to="/books" icon={<BooksIcon />} title="Books" />
        </nav>
      </aside>
      <main className="flex-1 me-8 mb-[39px]">
        <header className="h-[92px] mt-[48px] mb-[40px] border-b border-[#B0B0B0]">
          <div className="flex justify-between items-center h-full">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold">{currentPage}</h1>
              <div className="text-sm text-gray-500">{currentPage}</div>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={ProfileImage}
                alt="Profile"
                className="w-[52px] h-[52px] rounded-[10px] object-cover"
              />
              <span className="text-[24px] text-[#3E435D]">Jacob Jones</span>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};
