
import { ReactNode } from "react";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

interface PageLayoutProps {
  children: ReactNode;
  showMobileNav?: boolean;
}

const PageLayout = ({ children, showMobileNav = true }: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
      {showMobileNav && <MobileNav />}
    </div>
  );
};

export default PageLayout;
