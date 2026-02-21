import React from 'react';

interface InputFieldProps {
  type: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  hidetitle?: boolean;
  disabled?: boolean; 
}

const InputField = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  defaultValue = '',
  hidetitle = false,
  disabled = false,
}: InputFieldProps) => {
  return (
    <div className="w-full">
      {!hidetitle && (
        <label className="mb-2.5 block text-black dark:text-white">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        className="w-full h-13 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>
  );
};

export default InputField;
