import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { StudentCard } from '../components/StudentCard';
import { Modal } from '../components/Modal';
import { StudentForm } from '../components/StudentForm';
import { BulkStudentForm } from '../components/BulkStudentForm';
import { AttendanceStatCards } from '../components/AttendanceStatCards';
import { ArrowLeft, Plus, UserRound, Users } from 'lucide-react';

export const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { state, addStudent, editStudent, deleteStudent, getGroupAttendanceStats } = useApp();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Find the group by ID
  const group = state.groups.find(g => g.id === groupId);
  
  // If group doesn't exist, navigate back to groups page
  if (!group) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700">Group not found</h2>
        <button
          onClick={() => navigate('/groups')}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Groups
        </button>
      </div>
    );
  }
  
  const handleAddStudent = () => {
    setCurrentStudent(undefined);
    setIsModalOpen(true);
  };
  
  const handleEditStudent = (student: Student) => {
    setCurrentStudent(student);
    setIsModalOpen(true);
  };
  
  const handleStudentSubmit = (name: string, email: string) => {
    if (currentStudent) {
      editStudent(group.id, currentStudent.id, name, email);
    } else {
      addStudent(group.id, name, email);
    }
    setIsModalOpen(false);
  };

  const handleBulkStudentSubmit = (students: { name: string; email: string }[]) => {
    students.forEach(student => {
      addStudent(group.id, student.name, student.email);
    });
    setIsBulkModalOpen(false);
  };
  
  const handleDeleteStudent = (studentId: string) => {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      deleteStudent(group.id, studentId);
    }
  };
  
  // Get attendance stats for this group
  const groupStats = getGroupAttendanceStats(group.id);
  
  // Filter students based on search term
  const filteredStudents = group.students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/groups')}
          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
      </div>
      
      {group.description && (
        <p className="text-gray-600">{group.description}</p>
      )}
      
      {groupStats.total > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Attendance Statistics</h2>
          <AttendanceStatCards {...groupStats} />
        </section>
      )}
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Students</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/attendance?groupId=${groupId}`)}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md shadow-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Take Attendance
          </button>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md shadow-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Users className="h-4 w-4 mr-1" />
            Bulk Import
          </button>
          <button
            onClick={handleAddStudent}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Student
          </button>
        </div>
      </div>
      
      {group.students.length > 0 && (
        <div className="max-w-lg">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
      
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {group.students.length === 0 ? (
            <>
              <UserRound className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">No students added yet</h2>
              <p className="mt-2 text-sm text-gray-500">
                Add students to this group to start tracking attendance.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => setIsBulkModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md shadow-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Bulk Import
                </button>
                <button
                  onClick={handleAddStudent}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Student
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              No students found matching "{searchTerm}"
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          ))}
        </div>
      )}
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStudent ? 'Edit Student' : 'Add Student'}
      >
        <StudentForm
          onSubmit={handleStudentSubmit}
          onCancel={() => setIsModalOpen(false)}
          student={currentStudent}
        />
      </Modal>

      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Bulk Import Students"
      >
        <BulkStudentForm
          onSubmit={handleBulkStudentSubmit}
          onCancel={() => setIsBulkModalOpen(false)}
        />
      </Modal>
    </div>
  );
};