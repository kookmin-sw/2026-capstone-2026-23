import type { DocumentResult } from '@/shared/types'

export const MOCK_DOCUMENT_RESULT_ID = 'd_65827ab200'

export const MOCK_DOCUMENT_RESULT: DocumentResult = {
  documentId: MOCK_DOCUMENT_RESULT_ID,
  status: 'COMPLETED',
  fileName: '2026_1학기_수강신청_확인서.pdf',
  modelCode: 'gpt-5.4-mini',
  txt: {
    path: '/output/d_65827ab200/result.txt',
    preview: `원본 파일 경로: /input/2026_1학기_수강신청_확인서.pdf
페이지 수: 3

[[TABLE]]
<table>
<thead>
<tr><th>인적사항</th><th>단과대학</th><th>학과(학부)</th><th>학년</th><th>학번</th><th>성명</th></tr>
</thead>
<tbody>
<tr><td>소프트웨어</td><td>소프트웨어</td><td>소프트웨어학부</td><td>4</td><td>20200191</td><td>김동연</td></tr>
</tbody>
</table>
[[/TABLE]]

[[TABLE]]
<table>
<thead>
<tr><th>No</th><th>이수구분</th><th>학수번호</th><th>교과목명</th><th>분반</th><th>학점</th><th>시간</th><th>담당교수</th><th>비고</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>전공선택</td><td>SW4101</td><td>캡스톤디자인(2)</td><td>001</td><td>3</td><td>3</td><td>이상호</td><td></td></tr>
<tr><td>2</td><td>전공선택</td><td>SW4203</td><td>소프트웨어공학</td><td>001</td><td>3</td><td>3</td><td>박영준</td><td></td></tr>
<tr><td>3</td><td>전공선택</td><td>SW3305</td><td>인공지능</td><td>002</td><td>3</td><td>3</td><td>김민수</td><td></td></tr>
<tr><td>4</td><td>교양필수</td><td>GE2001</td><td>영어회화(4)</td><td>003</td><td>2</td><td>2</td><td>John Smith</td><td></td></tr>
<tr><td>5</td><td>전공선택</td><td>SW3401</td><td>컴퓨터네트워크</td><td>001</td><td>3</td><td>3</td><td>최현우</td><td></td></tr>
<tr><td>6</td><td>전공선택</td><td>SW4502</td><td>빅데이터분석</td><td>001</td><td>3</td><td>3</td><td>정다영</td><td></td></tr>
<tr><td>7</td><td>일반선택</td><td>LA1005</td><td>창의적사고와표현</td><td>012</td><td>2</td><td>2</td><td>한서윤</td><td></td></tr>
</tbody>
<tfoot>
<tr><td colspan="5">합계</td><td>19</td><td>19</td><td colspan="2"></td></tr>
</tfoot>
</table>
[[/TABLE]]

[[TABLE_MARKDOWN]]
# TableTitle: 수강신청 확인서 - 인적사항

## HeaderPath 구조
- 인적사항 > 단과대학
- 인적사항 > 학과(학부)
- 인적사항 > 학년
- 인적사항 > 학번
- 인적사항 > 성명

## 데이터 (사실 문장)
- 김동연 학생은 소프트웨어 단과대학 소프트웨어학부 4학년이며, 학번은 20200191이다.
[[/TABLE_MARKDOWN]]

[[TABLE_MARKDOWN]]
# TableTitle: 수강신청 확인서 - 수강과목

## HeaderPath 구조
- 수강과목 > No
- 수강과목 > 이수구분
- 수강과목 > 학수번호
- 수강과목 > 교과목명
- 수강과목 > 분반
- 수강과목 > 학점
- 수강과목 > 시간
- 수강과목 > 담당교수
- 수강과목 > 비고

## 데이터 (사실 문장)
- 캡스톤디자인(2)는 전공선택 과목으로 학수번호 SW4101, 001분반이며 3학점 3시간이고 이상호 교수가 담당한다.
- 소프트웨어공학은 전공선택 과목으로 학수번호 SW4203, 001분반이며 3학점 3시간이고 박영준 교수가 담당한다.
- 인공지능은 전공선택 과목으로 학수번호 SW3305, 002분반이며 3학점 3시간이고 김민수 교수가 담당한다.
- 영어회화(4)는 교양필수 과목으로 학수번호 GE2001, 003분반이며 2학점 2시간이고 John Smith 교수가 담당한다.
- 컴퓨터네트워크는 전공선택 과목으로 학수번호 SW3401, 001분반이며 3학점 3시간이고 최현우 교수가 담당한다.
- 빅데이터분석은 전공선택 과목으로 학수번호 SW4502, 001분반이며 3학점 3시간이고 정다영 교수가 담당한다.
- 창의적사고와표현은 일반선택 과목으로 학수번호 LA1005, 012분반이며 2학점 2시간이고 한서윤 교수가 담당한다.
- 총 합계는 19학점 19시간이다.
[[/TABLE_MARKDOWN]]

[[IMAGE]]
본 문서 상단에 대학교 로고가 위치하며, "2026학년도 1학기 수강신청 확인서"라는 제목이 중앙 정렬로 표시되어 있다. 로고는 파란색 원형 배경에 흰색으로 대학 심볼이 그려져 있다.
[[/IMAGE]]

[[IMAGE]]
문서 하단에는 "위와 같이 수강신청하였음을 확인합니다."라는 문구와 함께 발급일자 "2026년 3월 2일", 그리고 대학교 총장 직인이 날인되어 있다. 직인은 붉은색 원형 도장으로 "○○대학교 총장"이라는 문구가 새겨져 있다.
[[/IMAGE]]

위와 같이 수강신청하였음을 확인합니다.

2026년 3월 2일

○○대학교 총장 (직인)

※ 본 확인서는 수강신청 기간 종료 후 발급된 것으로, 수강 변경 기간 중 변경된 사항이 있을 수 있습니다.
※ 문의사항: 학사지원팀 (02-000-0000)`,
  },
  htmlPreview: null,
  markdown: null,
  imageDescriptions: [
    {
      page: 1,
      description:
        '상단 중앙에 문서 제목이 있고, 좌측 상단에는 대학교 로고가 배치된 수강신청 확인서 형식의 문서다.',
    },
    {
      page: 3,
      description:
        '문서 하단에 발급일자와 총장 직인이 포함되어 있으며, 안내 문구가 각주 형태로 정리되어 있다.',
    },
  ],
  meta: {
    totalPages: 3,
    processedPages: 3,
    processingTimeMs: 1840,
    completedAt: '2026-04-13T09:30:00Z',
  },
  error: null,
}
