# 국어 지문 기반 문제 자동 생성기

AI를 활용한 국어 지문 기반 객관식 문제 자동 생성 서비스입니다.

## 주요 기능

- ✅ 국어 지문 입력 (시, 소설, 논설문 등)
- ✅ 문제 유형 선택
- ✅ 프롬프트 커스터마이징 (localStorage 저장)
- ✅ OpenRouter API (Gemini 2.5 Pro) 연동
- ✅ XML 응답 자동 파싱
- ✅ 문제 미리보기 카드 UI
- ✅ CSV 파일 다운로드 (UTF-8 BOM)
- ✅ 3회 자동 재시도

## 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: TailwindCSS
- **API**: OpenRouter (Google Gemini 2.5 Pro)
- **CSV**: PapaParse
- **배포**: Vercel

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음과 같이 설정합니다:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

OpenRouter API 키는 [https://openrouter.ai](https://openrouter.ai)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 사용 방법

1. **지문 입력**: 국어 지문을 텍스트 영역에 입력합니다.
2. **유형 선택**: 시, 소설, 논설문, 기타 중 하나를 선택합니다.
3. **프롬프트 확인/수정**: 필요시 프롬프트를 편집하고 저장합니다.
4. **문제 생성**: "문제 생성" 버튼을 클릭합니다.
5. **결과 확인**: 생성된 문제를 미리보기로 확인합니다.
6. **CSV 다운로드**: "CSV로 다운로드" 버튼을 클릭하여 파일을 저장합니다.

## 프로젝트 구조

```
korean_v2/
├── app/
│   ├── page.tsx              # 메인 페이지
│   ├── layout.tsx            # 루트 레이아웃
│   ├── globals.css           # 글로벌 스타일
│   └── api/
│       └── generate/
│           └── route.ts      # API 엔드포인트
├── components/
│   ├── TextInput.tsx         # 지문 입력
│   ├── TypeSelector.tsx      # 유형 선택
│   ├── PromptEditor.tsx      # 프롬프트 편집
│   ├── QuestionPreview.tsx   # 문제 미리보기
│   └── DownloadButton.tsx    # CSV 다운로드
├── lib/
│   ├── prompts.ts            # 기본 프롬프트
│   ├── xmlParser.ts          # XML 파싱
│   ├── csvConverter.ts       # CSV 변환
│   └── openrouter.ts         # API 클라이언트
└── types/
    └── question.ts           # 타입 정의
```

## XML 응답 형식

```xml
<문제>
  <발문><![CDATA[문제 발문]]></발문>
  <지문><![CDATA[지문 내용]]></지문>
  <선지목록>
    <선지 번호="1"><![CDATA[선택지 1]]></선지>
    <선지 번호="2"><![CDATA[선택지 2]]></선지>
    <선지 번호="3"><![CDATA[선택지 3]]></선지>
    <선지 번호="4"><![CDATA[선택지 4]]></선지>
    <선지 번호="5"><![CDATA[선택지 5]]></선지>
  </선지목록>
  <정답>
    <정답 번호>③</정답 번호>
    <해설><![CDATA[정답 해설]]></해설>
  </정답>
</문제>
```

## CSV 출력 형식

| 컬럼명 | 설명 |
|--------|------|
| 제목 | 문제 번호 |
| 질문 | 발문 |
| 문제 내용 | 지문 |
| 해설 | 정답 해설 |
| 정답 객관식 번호 | 정답 번호 |
| 객관식 선택지1~5 | 각 선택지 |

## 배포 (Vercel)

### 1. Vercel CLI 설치

```bash
npm i -g vercel
```

### 2. 배포 실행

```bash
vercel
```

### 3. 환경변수 설정

Vercel 대시보드에서 `OPENROUTER_API_KEY`를 설정합니다.

## 라이선스

MIT
