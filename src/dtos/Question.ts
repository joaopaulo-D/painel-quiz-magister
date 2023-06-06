export interface Question {
  id: string;
  title: string;
  natureza: string;
  questions: [
    {
      title: string;
      alternatives: string[];
      correct: string;
    }
  ];
  created_at: string;
  checked: boolean;
}