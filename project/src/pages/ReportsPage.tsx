import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AttendanceStatCards } from '../components/AttendanceStatCards';
import { BarChart3, Check, X, AlertCircle, FileBarChart } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { state } = useApp();
  
  // Get parameters from URL
  const initialDate = searchParams.get('date') || '';
  const initialGroupId = searchParams.get('groupId') || '';
  
  // State for filters
  const [selectedGroupId, setSelectedGroupId] = useState<string>(initialGroupId);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  // Reset student selection when group changes
  useEffect(() => {
    setSelectedStudentId('');
  }, [selectedGroupId]);
  
  // Get all unique dates from attendance records
  const allDates = [...new Set(
    state.attendanceRecords
      .filter(record => !selectedGroupId || record.groupId === selectedGroupId)
      .map(record => record.date)
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  // Get the selected group
  const selectedGroup = selectedGroupId 
    ? state.groups.find(group => group.id === selectedGroupId) 
    : null;
  
  // Get students from the selected group
  const students = selectedGroup ? selectedGroup.students : [];
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Get attendance records based on filters
  const getFilteredRecords = () => {
    return state.attendanceRecords.filter(record => {
      if (selectedGroupId && record.groupId !== selectedGroupId) return false;
      if (selectedDate && record.date !== selectedDate) return false;
      if (selectedStudentId) {
        return record.records.some(r => r.studentId === selectedStudentId);
      }
      return true;
    });
  };
  
  const filteredRecords = getFilteredRecords();
  
  // Calculate statistics
  const calculateStats = () => {
    let present = 0;
    let absent = 0;
    let justified = 0;
    
    filteredRecords.forEach(record => {
      record.records.forEach(r => {
        if (selectedStudentId && r.studentId !== selectedStudentId) return;
        
        if (r.status === 'present') present++;
        else if (r.status === 'absent') absent++;
        else if (r.status === 'justified') justified++;
      });
    });
    
    return {
      present,
      absent,
      justified,
      total: present + absent + justified
    };
  };
  
  const stats = calculateStats();
  
  // Get student details for a specific record
  const getStudentDetails = (studentId: string) => {
    const student = state.groups.flatMap(g => g.students).find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Group
            </label>
            <select
              id="group"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
            >
              <option value="">All Groups</option>
              {state.groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <select
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
            >
              <option value="">All Dates</option>
              {allDates.map(date => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>
          
          {selectedGroup && (
            <div>
              <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Student
              </label>
              <select
                id="student"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
              >
                <option value="">All Students</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      {filteredRecords.length > 0 ? (
        <>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Statistics</h2>
            <AttendanceStatCards {...stats} />
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Attendance Records</h2>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Group
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.flatMap(record => {
                      const group = state.groups.find(g => g.id === record.groupId);
                      return record.records
                        .filter(r => !selectedStudentId || r.studentId === selectedStudentId)
                        .map(r => (
                          <tr key={`${record.date}-${record.groupId}-${r.studentId}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(record.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {group ? group.name : 'Unknown Group'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getStudentDetails(r.studentId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                r.status === 'present'
                                  ? 'bg-green-100 text-green-800'
                                  : r.status === 'absent'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {r.status === 'present' && <Check className="h-3 w-3 mr-1" />}
                                {r.status === 'absent' && <X className="h-3 w-3 mr-1" />}
                                {r.status === 'justified' && <AlertCircle className="h-3 w-3 mr-1" />}
                                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ));
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FileBarChart className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">No attendance records found</h2>
          <p className="mt-2 text-sm text-gray-500">
            {state.attendanceRecords.length === 0
              ? 'Start taking attendance to generate reports.'
              : 'Try changing your filters to see more results.'}
          </p>
        </div>
      )}
    </div>
  );
};