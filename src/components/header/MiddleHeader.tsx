import Container from "../Container";
import SearchInput from "./SearchInput";
import { auth } from "../../../auth";
import MobileNavigation from "./MobileNavigation";
import HeaderIcons from "./HeaderIcons";
import Logo from "../Logo";
import UserProfileDropdown from "./UserProfileDropdown";
import GuestProfileSection from "./GuestProfileSection";

const MiddleHeader = async () => {
  const session = await auth();

  return (
    <div className="border-b border-b-gray-400">
      <Container className="py-5 flex items-center gap-4 md:gap-6 lg:gap-20 justify-between ">
        <Logo />
        <SearchInput />
        <div className="hidden md:inline-flex items-center gap-3">
          {/* User */}
          {session?.user ? (
            <UserProfileDropdown user={session.user} />
          ) : (
            <GuestProfileSection />
          )}
          {/* Cart & Favorite Icons */}
          <HeaderIcons />
        </div>
        <MobileNavigation user={session?.user} />
      </Container>
    </div>
  );
};

export default MiddleHeader;
