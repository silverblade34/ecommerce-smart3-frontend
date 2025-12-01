import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TextInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <div className="relative flex flex-col space-y-2 ">
      <label className="font-semibold text-secondary_sokso" htmlFor={props.id}>
        {props.label}
      </label>
      <input

        type={"text"}
        className="rounded-lg bg-gray-50 p-2 text-secondary_sokso border-2 border-gray-600"
        {...props}
        name={props.name}
        ref={ref}
      />
    </div>
  );
});

TextInput.displayName = "TextInput";

export default TextInput;
