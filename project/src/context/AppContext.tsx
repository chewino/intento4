import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Group, AttendanceRecord, Student, AttendanceStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

const initialState: AppState = {
  groups: [],
  attendanceRecords: [],
};

// Try to load state from localStorage
const loadInitialState = (): AppState => {
  const savedState = localStorage.getItem('attendance-app-state');
  return savedState ? JSON.parse(savedState) : initialState;
};

interface AppContextType {
  state: AppState;
  addGroup: (name: string, description?: string) => void;
  editGroup: (id: string, name: string, description?: string) => void;
  deleteGroup: (id: string) => void;
  addStudent: (groupId: string, name: string, email?: string) => void;
  editStudent: (groupId: string, studentId: string, name: string, email?: string) => void;
  deleteStudent: (groupId: string, studentId: string) => void;
  recordAttendance: (groupId: string, date: string, records: { studentId: string; status: AttendanceStatus }[]) => void;
  getAttendanceForDate: (groupId: string, date: string) => { studentId: string; status: AttendanceStatus }[];
  getStudentAttendanceStats: (studentId: string) => { present: number; absent: number; justified: number; total: number };
  getGroupAttendanceStats: (groupId: string) => { present: number; absent: number; justified: number; total: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadInitialState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('attendance-app-state', JSON.stringify(state));
  }, [state]);

  const addGroup = (name: string, description?: string) => {
    const newGroup: Group = {
      id: uuidv4(),
      name,
      description,
      students: [],
    };
    setState((prevState) => ({
      ...prevState,
      groups: [...prevState.groups, newGroup],
    }));
  };

  const editGroup = (id: string, name: string, description?: string) => {
    setState((prevState) => ({
      ...prevState,
      groups: prevState.groups.map((group) =>
        group.id === id ? { ...group, name, description } : group
      ),
    }));
  };

  const deleteGroup = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      groups: prevState.groups.filter((group) => group.id !== id),
      attendanceRecords: prevState.attendanceRecords.filter((record) => record.groupId !== id),
    }));
  };

  const addStudent = (groupId: string, name: string, email?: string) => {
    const newStudent: Student = {
      id: uuidv4(),
      name,
      email,
    };
    setState((prevState) => ({
      ...prevState,
      groups: prevState.groups.map((group) =>
        group.id === groupId
          ? { ...group, students: [...group.students, newStudent] }
          : group
      ),
    }));
  };

  const editStudent = (groupId: string, studentId: string, name: string, email?: string) => {
    setState((prevState) => ({
      ...prevState,
      groups: prevState.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              students: group.students.map((student) =>
                student.id === studentId ? { ...student, name, email } : student
              ),
            }
          : group
      ),
    }));
  };

  const deleteStudent = (groupId: string, studentId: string) => {
    setState((prevState) => ({
      ...prevState,
      groups: prevState.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              students: group.students.filter((student) => student.id !== studentId),
            }
          : group
      ),
      // Remove attendance records for this student
      attendanceRecords: prevState.attendanceRecords.map((record) => {
        if (record.groupId === groupId) {
          return {
            ...record,
            records: record.records.filter((r) => r.studentId !== studentId),
          };
        }
        return record;
      }),
    }));
  };

  const recordAttendance = (
    groupId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus }[]
  ) => {
    // Check if there's already a record for this date and group
    const existingRecordIndex = state.attendanceRecords.findIndex(
      (record) => record.groupId === groupId && record.date === date
    );

    if (existingRecordIndex >= 0) {
      // Update existing record
      setState((prevState) => {
        const updatedRecords = [...prevState.attendanceRecords];
        updatedRecords[existingRecordIndex] = {
          ...updatedRecords[existingRecordIndex],
          records,
        };
        return {
          ...prevState,
          attendanceRecords: updatedRecords,
        };
      });
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        date,
        groupId,
        records,
      };
      setState((prevState) => ({
        ...prevState,
        attendanceRecords: [...prevState.attendanceRecords, newRecord],
      }));
    }
  };

  const getAttendanceForDate = (groupId: string, date: string) => {
    const record = state.attendanceRecords.find(
      (record) => record.groupId === groupId && record.date === date
    );
    return record ? record.records : [];
  };

  const getStudentAttendanceStats = (studentId: string) => {
    let present = 0;
    let absent = 0;
    let justified = 0;

    state.attendanceRecords.forEach((record) => {
      record.records.forEach((r) => {
        if (r.studentId === studentId) {
          if (r.status === 'present') present++;
          else if (r.status === 'absent') absent++;
          else if (r.status === 'justified') justified++;
        }
      });
    });

    return {
      present,
      absent,
      justified,
      total: present + absent + justified,
    };
  };

  const getGroupAttendanceStats = (groupId: string) => {
    let present = 0;
    let absent = 0;
    let justified = 0;

    state.attendanceRecords.forEach((record) => {
      if (record.groupId === groupId) {
        record.records.forEach((r) => {
          if (r.status === 'present') present++;
          else if (r.status === 'absent') absent++;
          else if (r.status === 'justified') justified++;
        });
      }
    });

    return {
      present,
      absent,
      justified,
      total: present + absent + justified,
    };
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addGroup,
        editGroup,
        deleteGroup,
        addStudent,
        editStudent,
        deleteStudent,
        recordAttendance,
        getAttendanceForDate,
        getStudentAttendanceStats,
        getGroupAttendanceStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};