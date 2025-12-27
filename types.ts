
export type Role = 'admin' | 'student' | 'parent';

export type Permission = 
  | 'view_grades' 
  | 'edit_grades' 
  | 'manage_users' 
  | 'manage_notices' 
  | 'approve_documents' 
  | 'view_reports';

export interface AccessProfile {
  id: string;
  name: string;
  sector: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileId?: string;
  registration?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  registration: string;
  grade: string;
  school: string;
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  grades: {
    bimester1?: number;
    bimester2?: number;
    bimester3?: number;
    bimester4?: number;
  };
  attendance: number; 
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  sender: string;
  type: 'school' | 'teacher';
}

export interface DocumentRequest {
  id: string;
  studentName: string;
  studentId: string;
  type: string;
  status: 'pending' | 'ready' | 'rejected' | 'processing';
  date: string;
  urgency: 'low' | 'medium' | 'high';
  processedBy?: string;
}

export interface DashboardData {
  student: Student;
  subjects: Subject[];
  notices: Notice[];
  requests: DocumentRequest[];
}
