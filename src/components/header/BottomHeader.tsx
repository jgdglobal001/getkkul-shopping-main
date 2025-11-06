import Container from "../Container";
import { auth } from "../../../auth";
import BottomNavigation from "./BottomNavigation";
import HotlineDisplay from "./HotlineDisplay";

const BottomHeader = async () => {
  const session = await auth();

  return (
    <div className="border-b border-b-gray-400">
      <Container className="flex items-center justify-between py-1">
        <BottomNavigation session={session} />
        <HotlineDisplay />
      </Container>
    </div>
  );
};

export default BottomHeader;
