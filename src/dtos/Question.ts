export interface Question {
  id: string;
  title: string;
  natureza: string;
  questions: Alternative[];
  created_at: string;
  checked: boolean;
}

export interface Alternative {
  title: string;
  alternatives: string[];
  correct: string;
}