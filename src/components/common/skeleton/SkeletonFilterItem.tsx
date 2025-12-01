import React from 'react';

type Props = {
  index: number;
};

const SkeletonFilterItem = ({ index }: Props) => {
  return (
    <div
      key={index}
      className={`${
        index % 3 === 0 ? 'w-32' : 'w-20'
      } h-8 animate-pulse rounded-full bg-secondary2/60 mt-2 `}
    />
  );
};

export default SkeletonFilterItem;
