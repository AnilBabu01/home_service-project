import React from 'react';

interface InputFieldProps {
  type: string;
  label: string;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SelectField = ({
  type,
  label,
  accept,
  onChange,
}: InputFieldProps) => {
  return (
    <div className="w-full">
      <label className="mb-2.5 block text-black dark:text-white">{label}</label>
      <input
        type={type}
        accept={type === "file" ? accept : undefined}
        onChange={onChange}
        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
      />
    </div>
  );
};

export default SelectField;
