interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextInput({ value, onChange, placeholder }: TextInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        국어 지문 입력
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '여기에 국어 지문을 입력하세요...'}
        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
}
