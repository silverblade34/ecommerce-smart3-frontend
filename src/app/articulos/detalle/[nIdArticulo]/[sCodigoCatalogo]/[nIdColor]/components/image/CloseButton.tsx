import { X } from "@phosphor-icons/react/dist/ssr";

type Props = {
  setOpenPopupImg: (open: boolean) => void;
};

const CloseButton = ({ setOpenPopupImg }: Props) => (
  <button
    type="button"
    aria-label="Close"
    className="close-popup-btn absolute right-4 top-4 z-[2] cursor-pointer"
    onClick={() => setOpenPopupImg(false)}
  >
    <X className="text-3xl text-white" />
  </button>
);

export default CloseButton;
