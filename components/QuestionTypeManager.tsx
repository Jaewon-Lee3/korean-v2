'use client';

import { useState } from 'react';
import { QuestionTypeData } from '@/types/question';

interface QuestionTypeManagerProps {
  types: QuestionTypeData[];
  selectedType: string;
  onSelectType: (typeName: string) => void;
  onAddType: (type: QuestionTypeData) => void;
  onDeleteType: (typeName: string) => void;
}

export default function QuestionTypeManager({
  types,
  selectedType,
  onSelectType,
  onAddType,
  onDeleteType,
}: QuestionTypeManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  const handleAdd = () => {
    if (!newTypeName.trim()) {
      alert('유형 이름을 입력해주세요.');
      return;
    }

    if (types.some(t => t.name === newTypeName.trim())) {
      alert('이미 존재하는 유형 이름입니다.');
      return;
    }

    onAddType({
      name: newTypeName.trim(),
      prompt: '',
    });

    setNewTypeName('');
    setIsAdding(false);
  };

  const handleDelete = (typeName: string) => {
    if (types.length <= 1) {
      alert('최소 1개의 유형이 필요합니다.');
      return;
    }

    if (confirm(`"${typeName}" 유형을 삭제하시겠습니까?`)) {
      onDeleteType(typeName);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          문제 유형 선택
        </label>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isAdding ? '취소' : '+ 유형 추가'}
        </button>
      </div>

      {isAdding && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <input
            type="text"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="새 유형 이름 입력 (예: 고전시가, 현대소설 등)"
            className="w-full p-2 border border-blue-300 rounded mb-2"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAdd();
              }
            }}
          />
          <button
            onClick={handleAdd}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        {types.map((type) => (
          <div
            key={type.name}
            className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-colors ${
              selectedType === type.name
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onSelectType(type.name)}
          >
            <span className="font-medium">{type.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(type.name);
              }}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
