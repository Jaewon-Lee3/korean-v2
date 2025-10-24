export interface QuestionData {
  발문: string;
  지문: string;
  보기?: string;
  선지목록: {
    [key: string]: string; // "1", "2", "3", "4", "5" -> content
  };
  정답번호: string;
  해설: string;
}

export interface ParsedQuestion extends QuestionData {
  index: number;
}

export interface QuestionTypeData {
  name: string;
  prompt: string;
}

export interface PromptConfig {
  [key: string]: string;
}

export interface CSVRow {
  제목: string;
  질문: string;
  '문제 내용': string;
  해설: string;
  '정답 객관식 번호': string;
  '객관식 선택지1': string;
  '객관식 선택지2': string;
  '객관식 선택지3': string;
  '객관식 선택지4': string;
  '객관식 선택지5': string;
}
