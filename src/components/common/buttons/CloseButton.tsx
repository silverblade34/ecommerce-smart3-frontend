import { X } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

type Props = {
  right: string;
  top: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const CloseButton = (props: Props) => {
  return (
    <button
      className={clsx(
        'close-btn absolute flex h-6 w-6 items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white',
        props.right,
        props.top
      )}
      aria-label='Close'
      type='button'
      {...props}
    >
      <X size={14} />
    </button>
  );
};

export default CloseButton;
