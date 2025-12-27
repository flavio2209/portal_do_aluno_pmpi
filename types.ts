
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
  attendance: number; // percentage
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
  type: string;
  status: 'pending' | 'ready' | 'rejected';
  date: string;
}

export interface DashboardData {
  student: Student;
  subjects: Subject[];
  notices: Notice[];
  requests: DocumentRequest[];
}
