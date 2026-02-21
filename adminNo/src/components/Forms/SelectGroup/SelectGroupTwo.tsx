import React, { useState } from 'react';

interface SelectGroupTwoProps {
  label: string;
  isLabel?: boolean;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  widthType?: 'full' | 'half'; // New prop to control width
}

const SelectGroupTwo: React.FC<SelectGroupTwoProps> = ({
  label,
  options,
  onChange,
  widthType = 'full',
  isLabel = true,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    setIsOptionSelected(true);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={widthType === 'full' ? 'w-full' : 'w-1/2'}>
      {isLabel && (
        <label className="mb-3 block text-black dark:text-white">{label}</label>
      )}

      <div className="relative z-20 bg-white dark:bg-form-input">
        {/* <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
          Icon
        </span> */}

        <select
          value={selectedOption}
          onChange={handleChange}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
            isOptionSelected ? 'text-black dark:text-white' : ''
          }`}
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
          {/* Dropdown Icon */}
        </span>
      </div>
    </div>
  );
};

export default SelectGroupTwo;
