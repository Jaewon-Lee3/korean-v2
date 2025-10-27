interface OpenRouterRequest {
  model: string;
  temperature: number;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenRouterError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export async function callOpenRouter(
  prompt: string,
  userText: string,
  retries: number = 3
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new OpenRouterError('OPENROUTER_API_KEY가 설정되지 않았습니다.');
  }

  const requestBody: OpenRouterRequest = {
    model: 'google/gemini-2.5-pro',
    temperature: 0.8,
    messages: [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: userText,
      },
    ],
  };

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Korean Question Generator',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new OpenRouterError(
          `API 요청 실패 (${response.status}): ${errorText}`,
          response.status
        );
      }

      const data: OpenRouterResponse = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new OpenRouterError('응답에 choices가 없습니다.');
      }

      const content = data.choices[0].message.content;

      if (!content) {
        throw new OpenRouterError('응답 내용이 비어있습니다.');
      }

      return content;
    } catch (error) {
      lastError = error as Error;
      console.error(`OpenRouter API 호출 실패 (시도 ${attempt}/${retries}):`, error);

      if (attempt < retries) {
        // 지수 백오프: 1초, 2초, 4초...
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new OpenRouterError(
    `${retries}회 재시도 후에도 API 호출에 실패했습니다: ${lastError?.message}`
  );
}
