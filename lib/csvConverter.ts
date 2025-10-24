import Papa from 'papaparse';
import { ParsedQuestion, CSVRow } from '@/types/question';

export function convertToCSV(questions: ParsedQuestion[]): string {
  const csvRows: CSVRow[] = questions.map((q) => ({
    제목: q.index.toString(),
    질문: q.발문,
    '문제 내용': q.지문,
    해설: q.해설,
    '정답 객관식 번호': q.정답번호,
    '객관식 선택지1': q.선지목록['1'] || '',
    '객관식 선택지2': q.선지목록['2'] || '',
    '객관식 선택지3': q.선지목록['3'] || '',
    '객관식 선택지4': q.선지목록['4'] || '',
    '객관식 선택지5': q.선지목록['5'] || '',
  }));

  return Papa.unparse(csvRows, {
    header: true,
  });
}

export function downloadCSV(csvContent: string, filename?: string): void {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0].replace(/-/g, '');
  const finalFilename = filename || `questions_${dateString}.csv`;

  // UTF-8 BOM 추가 (Excel에서 한글 깨짐 방지)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
