'use client';

import { useState, useEffect, useMemo } from 'react';
import TextInput from '@/components/TextInput';
import QuestionTypeManager from '@/components/QuestionTypeManager';
import PromptEditor from '@/components/PromptEditor';
import PromptVariables from '@/components/PromptVariables';
import QuestionPreview from '@/components/QuestionPreview';
import DownloadButton from '@/components/DownloadButton';
import { QuestionTypeData, ParsedQuestion } from '@/types/question';
import { parseXMLQuestion, XMLParseError } from '@/lib/xmlParser';
import { extractVariables, replaceVariables, validateVariables } from '@/lib/promptVariables';

const STORAGE_KEY = 'question_types';

export default function Home() {
  const [text, setText] = useState('');
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeData[]>([]);
  const [selectedTypeName, setSelectedTypeName] = useState('');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [rawXML, setRawXML] = useState<string>('');
  const [error, setError] = useState<string>('');

  // localStorage에서 문제 유형 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQuestionTypes(parsed);
        if (parsed.length > 0) {
          setSelectedTypeName(parsed[0].name);
        }
      } catch (e) {
        console.error('localStorage 파싱 오류:', e);
        initializeDefaultType();
      }
    } else {
      initializeDefaultType();
    }
  }, []);

  // 문제 유형이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (questionTypes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questionTypes));
    }
  }, [questionTypes]);

  const initializeDefaultType = () => {
    const defaultType: QuestionTypeData = {
      name: '기본',
      prompt: '',
    };
    setQuestionTypes([defaultType]);
    setSelectedTypeName(defaultType.name);
  };

  const handleAddType = (type: QuestionTypeData) => {
    setQuestionTypes([...questionTypes, type]);
    setSelectedTypeName(type.name);
  };

  const handleDeleteType = (typeName: string) => {
    const newTypes = questionTypes.filter(t => t.name !== typeName);
    setQuestionTypes(newTypes);

    if (selectedTypeName === typeName && newTypes.length > 0) {
      setSelectedTypeName(newTypes[0].name);
    }
  };

  const handleSelectType = (typeName: string) => {
    setSelectedTypeName(typeName);
  };

  const getCurrentType = (): QuestionTypeData | undefined => {
    return questionTypes.find(t => t.name === selectedTypeName);
  };

  const handlePromptChange = (newPrompt: string) => {
    setQuestionTypes(prev =>
      prev.map(t =>
        t.name === selectedTypeName ? { ...t, prompt: newPrompt } : t
      )
    );
  };

  // 현재 프롬프트에서 변수 추출
  const currentPrompt = getCurrentType()?.prompt || '';
  const promptVariables = useMemo(() => extractVariables(currentPrompt), [currentPrompt]);

  // 유형이 변경되면 변수 값 초기화
  useEffect(() => {
    setVariableValues({});
  }, [selectedTypeName]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      alert('지문을 입력해주세요.');
      return;
    }

    const currentType = getCurrentType();
    if (!currentType || !currentType.prompt.trim()) {
      alert('프롬프트를 입력해주세요.');
      return;
    }

    // 변수 검증
    const validation = validateVariables(promptVariables, variableValues);
    if (!validation.isValid) {
      alert(`다음 변수의 값을 입력해주세요: ${validation.missing.join(', ')}`);
      return;
    }

    // 변수 치환
    const finalPrompt = replaceVariables(currentType.prompt, variableValues);

    setIsGenerating(true);
    setError('');
    setQuestions([]);
    setRawXML('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '문제 생성에 실패했습니다.');
      }

      const xmlContent = data.xml;
      setRawXML(xmlContent);

      try {
        const parsedQuestion = parseXMLQuestion(xmlContent);
        const questionWithIndex: ParsedQuestion = {
          ...parsedQuestion,
          index: 1,
        };
        setQuestions([questionWithIndex]);
      } catch (parseError) {
        if (parseError instanceof XMLParseError) {
          setError(`XML 파싱 실패: ${parseError.message}`);
        } else {
          setError('XML 파싱 중 알 수 없는 오류가 발생했습니다.');
        }
      }
    } catch (error) {
      console.error('문제 생성 오류:', error);
      setError((error as Error).message || '문제 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            국어 지문 기반 문제 자동 생성기
          </h1>
          <p className="text-gray-600">
            문제 유형을 추가하고, 프롬프트를 자유롭게 작성하여 AI 문제를 생성하세요.
          </p>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 좌측: 지문 입력 & 유형 관리 */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <TextInput value={text} onChange={setText} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <QuestionTypeManager
                types={questionTypes}
                selectedType={selectedTypeName}
                onSelectType={handleSelectType}
                onAddType={handleAddType}
                onDeleteType={handleDeleteType}
              />
            </div>
          </div>

          {/* 우측: 프롬프트 편집기 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <PromptEditor
              value={currentPrompt}
              onChange={handlePromptChange}
            />
            <PromptVariables
              variables={promptVariables}
              values={variableValues}
              onChange={setVariableValues}
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
              isGenerating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isGenerating ? '생성 중...' : '문제 생성'}
          </button>

          <DownloadButton questions={questions} disabled={isGenerating} />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">오류 발생</h3>
            <p className="text-red-700">{error}</p>
            {rawXML && (
              <details className="mt-4">
                <summary className="cursor-pointer text-red-600 font-medium">
                  원본 XML 보기
                </summary>
                <pre className="mt-2 p-4 bg-white border border-red-200 rounded text-xs overflow-x-auto">
                  {rawXML}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* 문제 미리보기 */}
        {questions.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">생성된 문제</h2>
            {questions.map((question) => (
              <QuestionPreview key={question.index} question={question} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
