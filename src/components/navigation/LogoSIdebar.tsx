import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {
  desktopSidebarOpen: boolean;
};

const LogoSIdebar = ({ desktopSidebarOpen }: Props) => {
  return (
    <div className='flex h-16 w-full items-center justify-center bg-[#383634]'>
      <motion.div
        key={desktopSidebarOpen ? 'desktop' : 'isotipo'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='absolute'
      >
        {desktopSidebarOpen ? (
          <Image
            src='/assets/images/brand-logos/desktop-logo-white.png'
            alt='logo'
            width={100}
            height={100}
            className='object-contain'
            loading="lazy"
          />
        ) : (
          <Image
            src='/assets/images/brand-logos/isotipo-logo.png'
            alt='logo'
            width={70}
            height={70}
            className='object-contain'
            loading="lazy"
          />
        )}
      </motion.div>
    </div>
  );
};

export default LogoSIdebar;
