import Image from 'next/image';
import { ComponentProps } from 'react';
import { useInView } from 'react-intersection-observer';

type Props = {
  className: string;
} & ComponentProps<typeof Image>;

export default function ImageOpacity({ className, ...Props }: Props) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div ref={ref}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        {...Props}
        
        className={`${className} h-full w-full `}
        style={{
          opacity: inView ? 1 : 0,
          transition: 'all 0.2s cubic-bezier(0.3, 0.2, 0.2, 0.8)',
        }}
      />
      {/*<div style={{*/}
      {/*  // backgroundColor: '#afa9a6',*/}
      {/*  backgroundColor: '#F2F2F2',*/}
      {/*  width: '100%',*/}
      {/*  height: '100%',*/}
      {/*  position: 'absolute',*/}
      {/*  zIndex: 1,*/}
      {/*  top: 0,*/}
      {/*  left: inView ? '100%' : '0%',*/}
      {/*  transition: 'all 0.2s cubic-bezier(0.3, 0.2, 0.2, 0.8)',*/}
      {/*}} />*/}
    </div>
  );
}
