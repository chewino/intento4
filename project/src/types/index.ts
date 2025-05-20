export type AttendanceStatus = 'present' | 'absent' | 'justified';

export interface Student {
  id: string;
  name: string;
  email?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  students: Student[];
}

export interface AttendanceRecord {
  date: string;
  groupId: string;
  records: {
    studentId: string;
    status: AttendanceStatus;
  }[];
}

export interface AppState {
  groups: Group[];
  attendanceRecords: AttendanceRecord[];
}