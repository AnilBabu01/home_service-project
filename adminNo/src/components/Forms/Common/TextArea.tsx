import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder: string;
  defaultValue?: string;
  value: string;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Updated type
  required?: boolean;
}

const TextArea = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  defaultValue = '',
  rows = 6,
}: InputFieldProps) => {
  return (
    <div className="w-full">
      <label className="mb-2.5 block text-black dark:text-white">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      ></textarea>
    </div>
  );
};

export default TextArea;
