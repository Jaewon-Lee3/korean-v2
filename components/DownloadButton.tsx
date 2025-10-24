import { ParsedQuestion } from '@/types/question';
import { convertToCSV, downloadCSV } from '@/lib/csvConverter';

interface DownloadButtonProps {
  questions: ParsedQuestion[];
  disabled?: boolean;
}

export default function DownloadButton({ questions, disabled }: DownloadButtonProps) {
  const handleDownload = () => {
    if (questions.length === 0) {
      alert('다운로드할 문제가 없습니다.');
      return;
    }

    try {
      const csvContent = convertToCSV(questions);
      downloadCSV(csvContent);
      alert('CSV 파일이 다운로드되었습니다.');
    } catch (error) {
      console.error('CSV 다운로드 오류:', error);
      alert('CSV 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || questions.length === 0}
      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
        disabled || questions.length === 0
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-green-500 text-white hover:bg-green-600'
      }`}
    >
      CSV로 다운로드
    </button>
  );
}
