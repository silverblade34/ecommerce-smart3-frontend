import clsx from 'clsx';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: Props) => {
  return (
    <button
      type='submit'
      className={clsx(
        'flex w-full items-center justify-center rounded-lg bg-primary_sokso p-2 text-xl text-white',
        props.className,
        { 'cursor-not-allowed': props.disabled },
        { 'hover:bg-[#a74ad0]': !props.disabled }
      )}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
