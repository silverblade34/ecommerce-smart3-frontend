import { Icon } from "@phosphor-icons/react";
import clsx from "clsx";
import React from "react";

type Props = {
  icon?: Icon;
  size?: number;
  color?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const PrimaryButton = (props: Props) => {
  const Icon = props.icon;
  return (
    <button
      className={clsx(
        "button-main flex w-full items-center justify-center space-x-2 whitespace-nowrap rounded-lg",
        props.className,
        props.color,
        props.disabled ? "disabled" : ""
      )}
      {...props}
    >
      {Icon && <Icon size={props.size} />}
      {props.title}
    </button>
  );
};

export default PrimaryButton;
