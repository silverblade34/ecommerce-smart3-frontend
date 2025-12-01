import React, { useState } from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked = false,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  return (
    <div
      className='flex flex-col space-y-4 rounded-sm'
      style={{ border: '1px solid #f6f6f6' }}
    >
      <div className='form-check' style={{ padding: '10px' }}>
        <input
          className='form-check-input'
          type='checkbox'
          id={id}
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label
          className='form-check-label text-white'
          htmlFor={id}
          style={{ marginLeft: '5px' }}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default Checkbox;
