import Marquee from "react-fast-marquee";
import { Lightning } from "@phosphor-icons/react/dist/ssr";

const UltimaOportunidad = () => {
  return (
    <>
      <Marquee
        pauseOnHover={true}
        className="banner-sale-auto absolute bottom-0 left-0 w-full bg-primary_sokso py-3"
      >
        <div className={`caption2 px-2.5 font-semibold uppercase text-white`}>
          Sólo por esta semana
        </div>
        <Lightning weight="fill" className="text-yellow" />
        <div className={`caption2 px-2.5 font-semibold uppercase text-white`}>
          Resérvalo HOY
        </div>
        <Lightning weight="fill" className="text-yellow" />
        <div className={`caption2 px-2.5 font-semibold uppercase text-white`}>
          Sólo por esta semana
        </div>
        <Lightning weight="fill" className="text-yellow" />
        <div className={`caption2 px-2.5 font-semibold uppercase text-white`}>
          Resérvalo HOY
        </div>
        <Lightning weight="fill" className="text-yellow" />
      </Marquee>
    </>
  );
};
export default UltimaOportunidad;
