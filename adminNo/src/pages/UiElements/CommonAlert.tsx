type AlertType = 'warning' | 'success' | 'error';

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  isShow: boolean;
}

const alertStyles: Record<
  AlertType,
  { border: string; bg: string; iconBg: string; text: string }
> = {
  warning: {
    border: 'border-warning',
    bg: 'bg-warning bg-opacity-[15%]',
    iconBg: 'bg-warning bg-opacity-30',
    text: 'text-[#9D5425]',
  },
  success: {
    border: 'border-[#34D399]',
    bg: 'bg-[#34D399] bg-opacity-[15%]',
    iconBg: 'bg-[#34D399]',
    text: 'text-black dark:text-[#34D399]',
  },
  error: {
    border: 'border-[#F87171]',
    bg: 'bg-[#F87171] bg-opacity-[15%]',
    iconBg: 'bg-[#F87171]',
    text: 'text-[#B45454]',
  },
};

const CommonAlert = ({ type, title, message, isShow }: AlertProps) => {
  if (!isShow) return null; // Hide the component if isShow is false

  const { border, bg, iconBg, text } = alertStyles[type];

  return (
    <div
      className={`flex w-full border-l-6 ${border} ${bg} px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9`}
    >
      <div
        className={`mr-5 flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}
      >
        {/* Icon */}
        {type === 'warning' && (
          <svg
            width="19"
            height="16"
            viewBox="0 0 19 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 16h16c1.1 0 1.8-1.1 1.3-2.0L10.8 0.8c-0.5-1-2.1-1-2.6 0L0.2 14c-0.5 1 0.3 2 1.3 2z"
              fill="#FBBF24"
            />
          </svg>
        )}
        {type === 'success' && (
          <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.3 0.8c-0.4-0.4-1-0.4-1.4 0L5.9 9.5l-3.9-4.2c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4l4.9 5.5c0.3 0.3 0.7 0.4 1.1 0.4s0.8-0.1 1.1-0.4l7.3-8c0.4-0.4 0.4-1 0-1.4z"
              fill="white"
              stroke="white"
            />
          </svg>
        )}
        {type === 'error' && (
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5 7.7l4.6 4.6c0.1 0.2 0.4 0.3 0.6 0.3s0.5-0.1 0.6-0.3c0.3-0.3 0.3-0.8 0-1.1L7.6 6.5l4.6-4.6c0.3-0.3 0.3-0.8 0-1.1s-0.8-0.3-1.1 0L6.5 5.3 1.9 0.7c-0.3-0.3-0.8-0.3-1.1 0s-0.3 0.8 0 1.1L6.5 7.7z"
              fill="white"
              stroke="white"
            />
          </svg>
        )}
      </div>
      <div className="w-full">
        <h5 className={`mb-3 text-lg font-semibold ${text}`}>{title}</h5>
        <p className="leading-relaxed text-body">{message}</p>
      </div>
    </div>
  );
};

export default CommonAlert;
