import React from 'react';
import { Users, Edit, Trash } from 'lucide-react';
import { Group } from '../types';
import { useNavigate } from 'react-router-dom';

interface GroupCardProps {
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: (groupId: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
            {group.description && (
              <p className="mt-1 text-sm text-gray-500">{group.description}</p>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(group)}
              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              aria-label="Edit group"
            >
              <Edit className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onDelete(group.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
              aria-label="Delete group"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          <span>{group.students.length} students</span>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 flex justify-between">
        <button
          onClick={() => navigate(`/groups/${group.id}`)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View Details
        </button>
        
        <button
          onClick={() => navigate(`/attendance?groupId=${group.id}`)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Take Attendance
        </button>
      </div>
    </div>
  );
};