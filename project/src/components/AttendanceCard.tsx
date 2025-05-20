import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { AttendanceStatus, Student } from '../types';

interface AttendanceCardProps {
  student: Student;
  status: AttendanceStatus | null;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ 
  student, 
  status, 
  onStatusChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between">
      <div className="mb-3 md:mb-0">
        <h3 className="font-medium text-gray-900">{student.name}</h3>
        {student.email && (
          <p className="text-sm text-gray-500">{student.email}</p>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          className={`px-3 py-2 rounded-md flex items-center ${
            status === 'present'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onStatusChange(student.id, 'present')}
          aria-label="Mark as present"
        >
          <Check className="h-4 w-4 mr-1" />
          <span className="text-sm">Present</span>
        </button>
        
        <button
          className={`px-3 py-2 rounded-md flex items-center ${
            status === 'absent'
              ? 'bg-red-100 text-red-800 border border-red-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onStatusChange(student.id, 'absent')}
          aria-label="Mark as absent"
        >
          <X className="h-4 w-4 mr-1" />
          <span className="text-sm">Absent</span>
        </button>
        
        <button
          className={`px-3 py-2 rounded-md flex items-center ${
            status === 'justified'
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onStatusChange(student.id, 'justified')}
          aria-label="Mark as justified"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">Justified</span>
        </button>
      </div>
    </div>
  );
};