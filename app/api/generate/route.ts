import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouter, OpenRouterError } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, text } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '프롬프트가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: '지문이 필요합니다.' },
        { status: 400 }
      );
    }

    // OpenRouter API 호출 (3회 재시도 포함)
    const xmlResponse = await callOpenRouter(prompt, text, 3);

    return NextResponse.json({
      success: true,
      xml: xmlResponse,
    });
  } catch (error) {
    console.error('API Route 에러:', error);

    if (error instanceof OpenRouterError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: '문제 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
