import BottomHeader from "./BottomHeader";
import MiddleHeader from "./MiddleHeader";
import TopHeader from "./TopHeader";
import SearchInput from "./SearchInput";

const Header = () => {
  const freeShippingThreshold =
    process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "1000";
  return (
    <header className="w-full bg-theme-white relative z-50">
      {/* TopHeader */}
      <TopHeader freeShippingThreshold={freeShippingThreshold} />
      <div>
        {/* Middle Header */}
        <MiddleHeader />
        {/* BottomHeader */}
        <BottomHeader />

        {/* Mobile Search Bar (Coupang Style) */}
        <div className="md:hidden bg-theme-white pt-2 pb-1 px-4">
          <SearchInput className="flex w-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;
