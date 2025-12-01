import { Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

type Props = {
  icon: Icon;
  size: number;
  disabled: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const QuantityButton = (props: Props) => {
  const Icon = props.icon;
  return (
    <button
      {...props}
      type='button'
      className={clsx({
        '': !props.disabled,
        'disabled cursor-default text-secondary2': props.disabled,
      })}
    >
      <span className='sr-only'>
        {props.disabled ? 'No disponible' : 'Cambiar cantidad'}
      </span>
      <Icon size={props.size} />
    </button>
  );
};

export default QuantityButton;
