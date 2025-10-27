// 프롬프트에서 {변수명} 형태의 변수 추출
export function extractVariables(prompt: string): string[] {
  const regex = /\{([^}]+)\}/g;
  const matches = prompt.matchAll(regex);
  const variables = new Set<string>();

  for (const match of matches) {
    variables.add(match[1]);
  }

  return Array.from(variables);
}

// 프롬프트의 변수를 실제 값으로 치환
export function replaceVariables(
  prompt: string,
  values: Record<string, string>
): string {
  let result = prompt;

  for (const [key, value] of Object.entries(values)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value);
  }

  return result;
}

// 변수가 모두 채워졌는지 확인
export function validateVariables(
  variables: string[],
  values: Record<string, string>
): { isValid: boolean; missing: string[] } {
  const missing = variables.filter(v => !values[v] || values[v].trim() === '');

  return {
    isValid: missing.length === 0,
    missing,
  };
}
