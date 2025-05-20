import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Group } from '../types';
import { GroupCard } from '../components/GroupCard';
import { Modal } from '../components/Modal';
import { GroupForm } from '../components/GroupForm';

export const GroupsPage: React.FC = () => {
  const { state, addGroup, editGroup, deleteGroup } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddGroup = () => {
    setCurrentGroup(undefined);
    setIsModalOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setCurrentGroup(group);
    setIsModalOpen(true);
  };

  const handleGroupSubmit = (name: string, description: string) => {
    if (currentGroup) {
      editGroup(currentGroup.id, name, description);
    } else {
      addGroup(name, description);
    }
    setIsModalOpen(false);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      deleteGroup(groupId);
    }
  };

  const filteredGroups = state.groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
        <button
          onClick={handleAddGroup}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Group
        </button>
      </div>
      
      {state.groups.length > 0 && (
        <div className="max-w-lg">
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
      
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {state.groups.length === 0 ? (
            <>
              <h2 className="text-lg font-medium text-gray-900">No groups created yet</h2>
              <p className="mt-2 text-sm text-gray-500">
                Create your first group to start tracking attendance.
              </p>
              <button
                onClick={handleAddGroup}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Group
              </button>
            </>
          ) : (
            <p className="text-gray-500">
              No groups found matching "{searchTerm}"
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={handleEditGroup}
              onDelete={handleDeleteGroup}
            />
          ))}
        </div>
      )}
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentGroup ? 'Edit Group' : 'Create New Group'}
      >
        <GroupForm
          onSubmit={handleGroupSubmit}
          onCancel={() => setIsModalOpen(false)}
          group={currentGroup}
        />
      </Modal>
    </div>
  );
};