import Container from "../Container";
import { auth } from "../../../auth";
import BottomNavigation from "./BottomNavigation";

const BottomHeader = async () => {
  const session = await auth();

  return (
    <div className="border-b border-b-gray-400">
      <Container className="flex items-center justify-between py-1">
        <BottomNavigation session={session} />
        <p className="text-xs text-gray-400 font-medium hidden md:inline-flex">
          Hotline: <span className="text-black">+88 01012345678</span>
        </p>
      </Container>
    </div>
  );
};

export default BottomHeader;
