import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AttendanceCard } from '../components/AttendanceCard';
import { AttendanceStatCards } from '../components/AttendanceStatCards';
import { AttendanceStatus } from '../types';
import { CalendarIcon, CheckSquare, Save, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, recordAttendance, getAttendanceForDate } = useApp();
  
  const groupIdParam = searchParams.get('groupId');
  
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groupIdParam || '');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceStatus>>({});
  const [isSaved, setIsSaved] = useState(true);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showMissingAlert, setShowMissingAlert] = useState(false);
  
  const selectedGroup = state.groups.find(group => group.id === selectedGroupId);
  
  useEffect(() => {
    if (selectedGroupId && selectedDate) {
      const existingRecords = getAttendanceForDate(selectedGroupId, selectedDate);
      const recordsMap: Record<string, AttendanceStatus> = {};
      
      existingRecords.forEach(record => {
        recordsMap[record.studentId] = record.status;
      });
      
      setAttendanceRecords(recordsMap);
      setIsSaved(true);
    }
  }, [selectedGroupId, selectedDate, getAttendanceForDate]);
  
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
    setIsSaved(false);
    setShowMissingAlert(false);
  };
  
  const handleSaveAttendance = () => {
    if (!selectedGroupId || !selectedDate || !selectedGroup) return;
    
    // Check for missing attendance records
    const missingStudents = selectedGroup.students.filter(
      student => !attendanceRecords[student.id]
    );
    
    if (missingStudents.length > 0) {
      setShowMissingAlert(true);
      return;
    }
    
    const records = Object.entries(attendanceRecords).map(([studentId, status]) => ({
      studentId,
      status
    }));
    
    recordAttendance(selectedGroupId, selectedDate, records);
    setIsSaved(true);
    setShowSaveNotification(true);
    setShowMissingAlert(false);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 3000);
  };
  
  const calculateStats = () => {
    const stats = { present: 0, absent: 0, justified: 0, total: 0 };
    
    Object.values(attendanceRecords).forEach(status => {
      if (status === 'present') stats.present++;
      else if (status === 'absent') stats.absent++;
      else if (status === 'justified') stats.justified++;
    });
    
    stats.total = stats.present + stats.absent + stats.justified;
    return stats;
  };
  
  const stats = calculateStats();
  
  return (
    <div className="space-y-6">
      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 bg-green-50 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center border border-green-200 animate-fade-in">
          <CheckCircle className="h-5 w-5 mr-2" />
          Attendance saved successfully!
        </div>
      )}

      {/* Missing Attendance Alert */}
      {showMissingAlert && (
        <div className="bg-amber-50 text-amber-800 px-4 py-3 rounded-lg flex items-center border border-amber-200">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Missing attendance status</p>
            <p className="text-sm">Please mark attendance status for all students before saving.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Take Attendance</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
              Select Group
            </label>
            <select
              id="group"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
            >
              <option value="">Select a group</option>
              {state.groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.students.length} students)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 pr-4 py-2 border"
              />
              <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {selectedGroup ? (
        <>
          {selectedGroup.students.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">No students in this group</h2>
              <p className="mt-2 text-sm text-gray-500">
                Add students to this group before taking attendance.
              </p>
              <button
                onClick={() => navigate(`/groups/${selectedGroupId}`)}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Group
              </button>
            </div>
          ) : (
            <>
              {stats.total > 0 && (
                <section className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Today's Attendance</h2>
                  <AttendanceStatCards {...stats} />
                </section>
              )}
              
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Students</h2>
                <button
                  onClick={handleSaveAttendance}
                  disabled={isSaved}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isSaved
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Save className="h-4 w-4" />
                  {isSaved ? 'Saved' : 'Save Attendance'}
                </button>
              </div>
              
              <div className="space-y-3">
                {selectedGroup.students.map(student => (
                  <AttendanceCard
                    key={student.id}
                    student={student}
                    status={attendanceRecords[student.id] || null}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
              
              {selectedGroup.students.length > 5 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveAttendance}
                    disabled={isSaved}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isSaved
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Save className="h-4 w-4" />
                    {isSaved ? 'Saved' : 'Save Attendance'}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">No group selected</h2>
          <p className="mt-2 text-sm text-gray-500">
            Please select a group to take attendance.
          </p>
          {state.groups.length === 0 && (
            <button
              onClick={() => navigate('/groups')}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Group
            </button>
          )}
        </div>
      )}
    </div>
  );
};