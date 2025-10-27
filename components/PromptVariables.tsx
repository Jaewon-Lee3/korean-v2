'use client';

interface PromptVariablesProps {
  variables: string[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

export default function PromptVariables({ variables, values, onChange }: PromptVariablesProps) {
  if (variables.length === 0) {
    return null;
  }

  const handleChange = (variable: string, value: string) => {
    onChange({
      ...values,
      [variable]: value,
    });
  };

  return (
    <div className="w-full mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        📝 프롬프트 변수 입력
      </h3>
      <div className="space-y-3">
        {variables.map((variable) => (
          <div key={variable}>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {variable}
            </label>
            <input
              type="text"
              value={values[variable] || ''}
              onChange={(e) => handleChange(variable, e.target.value)}
              placeholder={`${variable} 값을 입력하세요`}
              className="w-full px-3 py-2 border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-600">
        💡 프롬프트의 {`{변수명}`} 부분이 여기 입력한 값으로 치환됩니다.
      </div>
    </div>
  );
}
