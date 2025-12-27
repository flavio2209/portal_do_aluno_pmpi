
import { DashboardData, DocumentRequest } from '../types';

export const MOCK_DASHBOARD: DashboardData = {
  student: {
    id: "10293",
    name: "Guilherme Silva Santos",
    registration: "2024.0001.0023",
    grade: "9º Ano - Turma B",
    school: "Escola Municipal Juscelino Kubitschek",
    avatar: "https://picsum.photos/id/64/200/200"
  },
  subjects: [
    { id: "1", name: "Matemática", teacher: "Prof. Alberto Rosa", grades: { bimester1: 8.5, bimester2: 7.0 }, attendance: 95 },
    { id: "2", name: "Português", teacher: "Profª. Maria Souza", grades: { bimester1: 9.0, bimester2: 8.5 }, attendance: 100 },
    { id: "3", name: "Ciências", teacher: "Prof. Marcos Lima", grades: { bimester1: 7.5, bimester2: 6.5 }, attendance: 92 },
    { id: "4", name: "História", teacher: "Profª. Ana Clara", grades: { bimester1: 8.0, bimester2: 9.0 }, attendance: 98 },
    { id: "5", name: "Geografia", teacher: "Prof. Ricardo Nunes", grades: { bimester1: 6.5, bimester2: 7.0 }, attendance: 85 }
  ],
  notices: [
    {
      id: "n1",
      title: "Reunião de Pais e Mestres",
      content: "Convidamos a todos para a reunião trimestral que ocorrerá no próximo sábado às 09:00 no auditório principal.",
      date: "2024-05-15",
      sender: "Secretaria Escolar",
      type: "school"
    },
    {
      id: "n2",
      title: "Material para Aula de Ciências",
      content: "Lembrando que para a aula prática de amanhã, cada aluno deve trazer uma lupa e um frasco transparente.",
      date: "2024-05-16",
      sender: "Prof. Marcos Lima",
      type: "teacher"
    }
  ],
  requests: [
    { id: "r1", studentName: "Guilherme Silva Santos", studentId: "10293", type: "Declaração de Matrícula", status: "ready", date: "2024-05-10", urgency: "low" },
    { id: "r2", studentName: "Guilherme Silva Santos", studentId: "10293", type: "Histórico Escolar", status: "pending", date: "2024-05-14", urgency: "medium" }
  ]
};

export const MOCK_ADMIN_REQUESTS: DocumentRequest[] = [
  { id: "ar1", studentName: "Ana Paula Oliveira", studentId: "10294", type: "Declaração de Matrícula", status: "pending", date: "2024-05-17", urgency: "high" },
  { id: "ar2", studentName: "Marcos Silva", studentId: "10295", type: "Passe Escolar", status: "processing", date: "2024-05-17", urgency: "medium" },
  { id: "ar3", studentName: "Julia Costa", studentId: "10296", type: "Histórico Escolar", status: "pending", date: "2024-05-16", urgency: "low" },
  { id: "ar4", studentName: "Guilherme Silva Santos", studentId: "10293", type: "Histórico Escolar", status: "pending", date: "2024-05-14", urgency: "medium" },
];
