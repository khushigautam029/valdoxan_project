import { useLocation } from "react-router-dom";

const routeHeaders = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Key application figures for the selected period",
  },
  "/access-codes": {
    title: "Access codes",
    subtitle: "Manage codes used to access application features",
  },
  "/content": {
    title: "Content management",
    subtitle: "Manage application content, articles, and media",
  },
  "/content/edit": {
    title: "Edit Content",
    subtitle: "Modify article details, category, and publication status",
  },
  "/content/new": {
    title: "New Content",
    subtitle: "Create and publish a new content article",
  },
  "/notifications": {
    title: "Push notifications",
    subtitle: "Compose and dispatch broadcast messages to users",
  },
};

const Navbar = ({ isCollapsed }) => {
  const location = useLocation();
  
  const currentHeader = routeHeaders[location.pathname] || {
    title: "Dashboard",
    subtitle: "Key application figures for the selected period",
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-20 border-b border-slate-200/80 bg-white transition-all duration-300 ease-in-out ${
        isCollapsed ? "left-20" : "left-64"
      }`}
    >
      <div className="flex h-full items-center justify-between px-8">
        {/* Dynamic Page Header */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#193260]">
            {currentHeader.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            {currentHeader.subtitle}
          </p>
        </div>

        {/* Right Side: AD Avatar Circle */}
        <div className="flex items-center">
          <div
            title="Admin User"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#193260] text-xs font-bold text-white shadow-xs"
          >
            AD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;