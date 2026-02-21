import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition duration-300 p-6">
      
      {/* Top Section */}
      <div className="flex items-center justify-between">
        
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100 text-black shadow-sm">
          {children}
        </div>

        {/* Rate */}
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            levelUp ? "text-green-600" : ""
          } ${levelDown ? "text-red-600" : ""}`}
        >
          {rate}
          {levelUp && <span>▲</span>}
          {levelDown && <span>▼</span>}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-6">
        <h2 className="text-3xl font-bold text-black">
          {total}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {title}
        </p>
      </div>
    </div>
  );
};

export default CardDataStats;