import {
  ArrowClockwise,
  ArrowsCounterClockwise,
  Binoculars,
  BookOpen,
  CalendarDots,
  ClipboardText,
  CurrencyDollarSimple,
  Database,
  IdentificationCard,
  SealPercent,
  ShieldCheck,
  ShoppingCart,
  Star,
  TrolleySuitcase,
  Trophy,
  Truck,
  UsersThree,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { FC } from "react";

interface IconProps {
  iconName: string;
  size?: number;
}

const NavIcon: FC<IconProps> = ({ iconName, size = 23 }) => {
  switch (iconName) {
    case "profile":
      return <IdentificationCard size={size} />;
    case "gestion":
      return <UsersThree size={size} />;
    case "star":
      return <Star size={size} />;
    case "book-open":
      return <BookOpen size={size} />;
    case "shopping-cart":
      return <ShoppingCart size={size} />;
    case "compass":
      return <TrolleySuitcase size={size} />;
    case "binoculars":
      return <Binoculars size={size} />;
    case "arrow-clockwise":
      return <ArrowClockwise size={size} />;
    case "shield-check":
      return <ShieldCheck size={size} />;
    case "truck":
      return <Truck size={size} />;
    case "arrow-counter-clockwise":
      return <ArrowsCounterClockwise size={size} />;
    case "point-icon":
      return <Trophy size={size} />;
    case "report-icon":
      return <ClipboardText size={size} />;
    case "campaña-icom":
      return <SealPercent size={size} />
    case "calendar-check":
      return <Trophy size={size} />
    default:
      return <Database size={size} />;
  }
};

export default NavIcon;