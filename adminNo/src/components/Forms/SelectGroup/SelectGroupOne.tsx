import React, { useState } from 'react';

interface SelectProps {
  label: string;
  isLabel?: boolean;
  options: { value: string | number; label: string }[]; // Array of options
  onChange?: (value: string | number) => void; // Optional callback on change
  widthType?: 'full' | 'half'; // Controls width
  defaultValue?: string | number; // Default selected option
  customClass?: string; // Custom additional classes for styling
  value?: any;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  onChange,
  widthType = 'full',
  isLabel = true,
  defaultValue = '',
  customClass = '',
}) => {
  const [selectedOption, setSelectedOption] = useState<string | number>(
    defaultValue,
  );
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    setIsOptionSelected(true);
    if (onChange) {
      onChange(value);
    }
  };

  console.log("seleced val from selectedOption  ",defaultValue);

  return (
    <div className={widthType === 'full' ? 'w-full' : 'w-1/2'}>
      {isLabel && (
        <label className="mb-3 block text-black dark:text-white">{label}</label>
      )}

      <div className="relative z-20 bg-white dark:bg-form-input">
        <select
          value={defaultValue}
          onChange={handleChange}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
            isOptionSelected ? 'text-black dark:text-white' : ''
          } ${customClass}`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            {label}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-body dark:text-bodydark"
            >
              {option.label}
            </option>
          ))}
        </select>

        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Select;
