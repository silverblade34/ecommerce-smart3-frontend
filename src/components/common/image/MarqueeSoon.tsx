import Marquee from 'react-fast-marquee';
import { Lightning } from '@phosphor-icons/react/dist/ssr';

const MarqueeSoon = () => {
  return (
    <>
      <Marquee
        pauseOnHover={true}
        className='banner-sale-auto absolute bottom-0 left-0 w-full bg-black py-3'
      >
        <div className={`caption2 px-2.5 font-semibold uppercase text-white`}>
          Disponible a partir del Lunes
        </div>
        <Lightning weight='fill' className=' text-red' />
        <div className={`caption2 px-2.5 font-semibold uppercase text-white`}>
          Resérvalo HOY
        </div>
        <Lightning weight='fill' className='text-red' />
        <div className={`caption2 px-2.5 font-semibold uppercase text-white`}>
          Disponible a partir del Lunes
        </div>
        <Lightning weight='fill' className='text-red' />
        <div className={`caption2 px-2.5 font-semibold uppercase text-white`}>
          Resérvalo HOY
        </div>
        <Lightning weight='fill' className='text-red' />
      </Marquee>
    </>
  );
};
export default MarqueeSoon;
