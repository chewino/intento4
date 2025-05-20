import React from 'react';
import { Mail, Edit, Trash } from 'lucide-react';
import { Student } from '../types';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
      <div>
        <h3 className="font-medium text-gray-900">{student.name}</h3>
        {student.email && (
          <div className="mt-1 text-sm text-gray-500 flex items-center">
            <Mail className="h-3.5 w-3.5 mr-1" />
            {student.email}
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(student)}
          className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
          aria-label="Edit student"
        >
          <Edit className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onDelete(student.id)}
          className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
          aria-label="Delete student"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};