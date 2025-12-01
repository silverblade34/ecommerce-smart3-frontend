import React from 'react';

type Props = {} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonSubmit = (props: Props) => {
  return (
    <button
      type='submit'
      className='flex w-full items-center justify-center rounded-lg bg-primary_sokso p-2 text-xl text-white hover:bg-[#a74ad0]'
      {...props}
    >
      {props.children}
    </button>
  );
};

export default ButtonSubmit;
