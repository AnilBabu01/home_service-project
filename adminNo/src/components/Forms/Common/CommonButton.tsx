import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  border?: boolean;
  borderColor?: string;
  textColor?: string;
  disabled?: boolean;
  isLoading?: boolean;
  Type?: "button" | "submit" | "reset";
  width?: string;
  height?: string;
}

const CommonButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  className,
  border,
  borderColor = 'border-gray-300',
  textColor = 'text-white',
  disabled = false,
  isLoading = false,
  width = 'w-full',
  height = 'h-auto',
  Type = "button"
}) => {
  return (
    <button
      type={Type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`flex justify-center items-center rounded p-3 font-medium hover:bg-opacity-90 
        ${border ? `border ${borderColor} ${textColor} bg-transparent` : 'bg-primary text-white'} 
        ${className} ${width} ${height} 
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        label
      )}
    </button>
  );
};

export default CommonButton;
