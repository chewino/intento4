import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AttendanceStatsProps {
  present: number;
  absent: number;
  justified: number;
  total: number;
}

export const AttendanceStatCards: React.FC<AttendanceStatsProps> = ({
  present,
  absent,
  justified,
  total,
}) => {
  const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;
  const absentPercentage = total > 0 ? Math.round((absent / total) * 100) : 0;
  const justifiedPercentage = total > 0 ? Math.round((justified / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-green-100 mr-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Present</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{present}</p>
              <p className="ml-2 text-sm text-gray-500">({presentPercentage}%)</p>
            </div>
          </div>
        </div>
        <div className="mt-3 bg-gray-100 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${presentPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-red-100 mr-3">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Absent</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{absent}</p>
              <p className="ml-2 text-sm text-gray-500">({absentPercentage}%)</p>
            </div>
          </div>
        </div>
        <div className="mt-3 bg-gray-100 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full"
            style={{ width: `${absentPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-amber-100 mr-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Justified</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{justified}</p>
              <p className="ml-2 text-sm text-gray-500">({justifiedPercentage}%)</p>
            </div>
          </div>
        </div>
        <div className="mt-3 bg-gray-100 rounded-full h-2">
          <div
            className="bg-amber-500 h-2 rounded-full"
            style={{ width: `${justifiedPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};