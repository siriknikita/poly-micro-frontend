export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  name: string;
}

export interface QuestionSubmission {
  name: string;
  email: string;
  category: string;
  question: string;
}

export interface QuestionCategory {
  id: string;
  name: string;
}
