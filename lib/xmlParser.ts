import { QuestionData } from '@/types/question';

export class XMLParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'XMLParseError';
  }
}

export function parseXMLQuestion(xmlString: string): QuestionData {
  try {
    // 발문 추출
    const 발문Match = xmlString.match(/<발문><!\[CDATA\[(.*?)\]\]><\/발문>/s);
    if (!발문Match) {
      throw new XMLParseError('발문을 찾을 수 없습니다.');
    }
    const 발문 = 발문Match[1].trim();

    // 지문 추출
    const 지문Match = xmlString.match(/<지문><!\[CDATA\[(.*?)\]\]><\/지문>/s);
    if (!지문Match) {
      throw new XMLParseError('지문을 찾을 수 없습니다.');
    }
    const 지문 = 지문Match[1].trim();

    // 보기 추출 (선택적)
    const 보기Match = xmlString.match(/<보기><!\[CDATA\[(.*?)\]\]><\/보기>/s);
    const 보기 = 보기Match ? 보기Match[1].trim() : undefined;

    // 선지 추출
    const 선지Matches = Array.from(
      xmlString.matchAll(/<선지 번호="(\d+)"><!\[CDATA\[(.*?)\]\]><\/선지>/gs)
    );

    if (선지Matches.length !== 5) {
      throw new XMLParseError(`선지는 5개여야 합니다. (현재: ${선지Matches.length}개)`);
    }

    const 선지목록: { [key: string]: string } = {};
    선지Matches.forEach(match => {
      const 번호 = match[1];
      const 내용 = match[2].trim();
      선지목록[번호] = 내용;
    });

    // 정답 번호 추출
    const 정답번호Match = xmlString.match(/<정답 번호>(.*?)<\/정답 번호>/s);
    if (!정답번호Match) {
      throw new XMLParseError('정답 번호를 찾을 수 없습니다.');
    }
    const 정답번호 = 정답번호Match[1].trim();

    // 해설 추출
    const 해설Match = xmlString.match(/<해설><!\[CDATA\[(.*?)\]\]><\/해설>/s);
    if (!해설Match) {
      throw new XMLParseError('해설을 찾을 수 없습니다.');
    }
    const 해설 = 해설Match[1].trim();

    return {
      발문,
      지문,
      보기,
      선지목록,
      정답번호,
      해설,
    };
  } catch (error) {
    if (error instanceof XMLParseError) {
      throw error;
    }
    throw new XMLParseError(`XML 파싱 중 오류가 발생했습니다: ${(error as Error).message}`);
  }
}

export function validateQuestionData(data: QuestionData): boolean {
  if (!data.발문 || data.발문.length === 0) return false;
  if (!data.지문 || data.지문.length === 0) return false;
  if (!data.선지목록 || Object.keys(data.선지목록).length !== 5) return false;
  if (!data.정답번호 || data.정답번호.length === 0) return false;
  if (!data.해설 || data.해설.length === 0) return false;
  return true;
}
