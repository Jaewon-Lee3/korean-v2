'use client';

import { DEFAULT_XML_TEMPLATE } from '@/lib/prompts';

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptEditor({ value, onChange }: PromptEditorProps) {
  const handleInsertTemplate = () => {
    if (confirm('현재 프롬프트 끝에 XML 형식 템플릿을 추가하시겠습니까?')) {
      onChange(value + '\n\n' + DEFAULT_XML_TEMPLATE);
    }
  };

  const handleClear = () => {
    if (confirm('프롬프트를 초기화하시겠습니까?')) {
      onChange('');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          프롬프트 작성
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleInsertTemplate}
            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
          >
            XML 템플릿 추가
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            초기화
          </button>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="프롬프트를 입력하세요. 문제 생성 방식, 요구사항 등을 자유롭게 작성할 수 있습니다."
        className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <div className="mt-2 text-sm text-gray-600">
        💡 팁: "XML 템플릿 추가" 버튼을 눌러 응답 형식을 지정할 수 있습니다.
      </div>
    </div>
  );
}
