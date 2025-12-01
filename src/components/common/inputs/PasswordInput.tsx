import { Eye, EyeSlash } from "@phosphor-icons/react";
import { InputHTMLAttributes, forwardRef, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  color?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="relative flex flex-col space-y-2">
        <label
          className="font-semibold capitalize"
          style={{ color: props.color || "white" }}
          htmlFor={props.id}
        >
          {props.label}
        </label>
        <input
          type={showPassword ? "text" : "password"}
          style={{ color: props.color || "white" }}
          className="rounded-lg bg-gray-50 p-2 border-2 border-gray-600"
          {...props}
          ref={ref}
          name={props.name}
        />
        <button
          type="button"
          className="absolute bottom-3 right-3"
          style={{ color: props.color || "white" }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
