export interface Assessment {
  id: string;
  patientId: string;
  type: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'text' | 'scale' | 'yes_no';
  options?: string[];
  required: boolean;
  order: number;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  patientId: string;
  answers: Answer[];
  completedAt: Date;
  score?: number;
}

export interface Answer {
  questionId: string;
  value: string | number;
}
