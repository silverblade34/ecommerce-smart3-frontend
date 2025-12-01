import { useState } from 'react';
import ImageOpacity from '@/components/common/image/ImageOpacity';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';
import CatalogoBadge from '../etiquetas/CatalogoBadge';

type Props = {
  src: string;
  width: number;
  height: number;
  magnifierHeight: number;
  alt: string;
  magnifieWidth: number;
  zoomLevel: number;
  tipoCatalogo: string
};

const ImageMagnifier = ({
  magnifierHeight,
  magnifieWidth,
  height,
  width,
  zoomLevel,
  src,
  alt,
  tipoCatalogo
}: Props) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  return (
    <figure
      style={{
        position: 'relative',
      }}
    >
      {/* {(tipoCatalogo?.toUpperCase() == "CYBER" || tipoCatalogo?.toUpperCase() == "PREVENTA") && (
        <span className={clsx("absolute left-3 top-3 z-30 rounded-lg p-1 text-xs text-white",
          tipoCatalogo?.toUpperCase() == "CYBER" ? "bg-pink " : "bg-cyan ")}>
          {tipoCatalogo?.toUpperCase() =="PREVENTA" ? "Catálogo" :  tipoCatalogo?.toUpperCase()}
        </span>
      )} */}

      <CatalogoBadge
        tipo={tipoCatalogo}
        position="absolute left-3 top-3"
      />

      <span className='absolute right-3 top-3 z-10 rounded-full bg-primary_sokso p-1 text-white'>
        <MagnifyingGlass size={15} />
      </span>

      <ImageOpacity
        src={src}
        alt={alt}
        width={width}
        height={height}
        className='product-cover aspect-auto w-full'
        onMouseEnter={(e) => {
          // update image size and turn-on magnifier
          const elem = e.currentTarget;
          const { width, height } = elem.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={(e) => {
          // update cursor position
          const elem = e.currentTarget;
          const { top, left } = elem.getBoundingClientRect();

          // calculate cursor position on the image
          const x = e.pageX - left - window.scrollY;
          const y = e.pageY - top - window.scrollX;
          setXY([x, y]);
        }}
        onMouseLeave={() => {
          // close magnifier
          setShowMagnifier(false);
        }}
      />

      <div
        style={{
          display: showMagnifier ? '' : 'none',
          position: 'absolute',
          pointerEvents: 'none',
          height: `${magnifierHeight}px`,
          width: `${magnifieWidth}px`,
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifieWidth / 2}px`,
          border: '1px solid lightgray',
          backgroundColor: 'white',
          backgroundImage: `url('${src}')`,
          backgroundRepeat: 'no-repeat',

          backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel
            }px`,

          backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
        }}
      ></div>
    </figure>
  );
};
export default ImageMagnifier;
