import { ParsedQuestion } from '@/types/question';

interface QuestionPreviewProps {
  question: ParsedQuestion;
}

export default function QuestionPreview({ question }: QuestionPreviewProps) {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">문제 {question.index}</h3>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">발문</h4>
        <p className="text-gray-800 whitespace-pre-wrap">{question.발문}</p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">지문</h4>
        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-gray-800 whitespace-pre-wrap">{question.지문}</p>
        </div>
      </div>

      {question.보기 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">보기</h4>
          <div className="p-4 bg-blue-50 rounded border border-blue-200">
            <p className="text-gray-800 whitespace-pre-wrap">{question.보기}</p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">선지</h4>
        <div className="space-y-2">
          {Object.entries(question.선지목록).map(([번호, 내용]) => (
            <div
              key={번호}
              className={`p-3 rounded border ${
                question.정답번호.includes(번호)
                  ? 'bg-green-50 border-green-500 font-semibold'
                  : 'bg-white border-gray-200'
              }`}
            >
              <span className="font-medium">#{번호}</span> {내용}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">정답</h4>
        <p className="text-green-600 font-bold text-lg">{question.정답번호}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-1">해설</h4>
        <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-gray-800 whitespace-pre-wrap">{question.해설}</p>
        </div>
      </div>
    </div>
  );
}
