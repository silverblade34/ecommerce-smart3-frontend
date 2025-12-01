import React from 'react';

const SkeletonFilerLine = () => {
  return (
    <div className='mt-2 flex w-full space-x-5'>
      <div
        className={` h-8 w-full animate-pulse rounded-lg bg-secondary2/60 `}
      />
      <div className={` h-8 w-12 animate-pulse rounded-lg bg-secondary2/60 `} />
    </div>
  );
};

export default SkeletonFilerLine;
