import useSidebarStore from '@/context/navigation/sidebar';
import { TextIndent, TextOutdent } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Props = {
  text: string;
};

const TitlePage = ({ text }: Props) => {
  const { sidebar, setSidebar, mobile, setMobile } = useSidebarStore();
  const [isIndent, setIsIndent] = useState(true);

  useEffect(() => {
    setIsIndent(sidebar);
  }, [sidebar]);
  return (
    <div className='flex space-x-2'>
      <motion.button
        onClick={() => {
          setSidebar(!sidebar);
          setIsIndent(!isIndent);
        }}
        className='hidden text-gray-700 lg:block'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Animación de cambio de ícono */}
        <motion.div
          key={isIndent ? 'indent' : 'outdent'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {!isIndent ? <TextIndent size={32} /> : <TextOutdent size={32} />}
        </motion.div>
      </motion.button>
      <motion.button
        onClick={() => {
          setMobile(!mobile);
          setIsIndent(!isIndent);
        }}
        className='block text-gray-700 lg:hidden'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Animación de cambio de ícono */}
        <motion.div
          key={isIndent ? 'indent' : 'outdent'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {!isIndent ? <TextIndent size={32} /> : <TextOutdent size={32} />}
        </motion.div>
      </motion.button>
      <p className='py-4 text-xl font-bold text-gray-800 md:text-2xl'>{text}</p>
    </div>
  );
};

export default TitlePage;
