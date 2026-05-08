[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Lvs6kcL8)

<img width="2624" height="1275" alt="Image" src="https://github.com/user-attachments/assets/95720cd3-1f04-473f-beed-059e2fa0ae90" />

안녕하세요 여기는 2026년도 캡스톤 23조의 github 입니다 (^ ̥> ̫ < ̥^)

## ᕱ‬ DURMONT ‪ᕱ

>>여기 로고 넣을 자리<<‬

## Luminar Document Parser

AI 기반 문서 분석 및 질의응답 시스템입니다.  
HWP, PDF, 이미지 문서를 업로드하면 텍스트, 표, 이미지 정보를 추출하고, 추출된 문서를 기반으로 검색 및 RAG 질의응답을 제공합니다.

## 프로젝트 소개

Luminar Document Parser는 사내 문서나 업무 문서를 효율적으로 분석하기 위한 문서 파싱 플랫폼입니다.

주요 목표는 다음과 같습니다.

- HWP, PDF, 이미지 문서의 자동 분석
- 문서 내 텍스트, 표, 이미지 정보 추출
- AI 모델을 활용한 문서 구조 이해
- 변환 결과 미리보기 및 다운로드
- 문서 기반 RAG 질의응답 제공
- 대용량 문서 처리를 위한 비동기 작업 큐 지원

## 주요 기능

- 문서 업로드 및 변환
- HWP / HWPX / PDF / 이미지 파일 지원
- AI 기반 표, 차트, 이미지 인식
- 변환 결과 미리보기
- 작업 상태 실시간 확인
- 변환 결과 다운로드
- 문서 기반 검색 및 질의응답
- FastAPI 기반 REST API 제공
- React 기반 웹 UI 제공
- Redis / RabbitMQ 기반 비동기 작업 처리
- OpenAI API 또는 로컬 VLM 모델 연동 지원

## 기술 스택

## 🛠 Tech Stack

### Frontend

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"> <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white"> <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> <img src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white">

### Backend

<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"> <img src="https://img.shields.io/badge/Uvicorn-2D3748?style=for-the-badge&logo=gunicorn&logoColor=white"> <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white"> <img src="https://img.shields.io/badge/Redis-FF4438?style=for-the-badge&logo=redis&logoColor=white"> <img src="https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white">

### AI / Document Processing

<img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"> <img src="https://img.shields.io/badge/Qwen2.5--VL-1A73E8?style=for-the-badge&logo=alibabacloud&logoColor=white"> <img src="https://img.shields.io/badge/DeepSeek_OCR-4D6BFF?style=for-the-badge&logoColor=white"> <img src="https://img.shields.io/badge/HWP/HWPX_Document-005BAC?style=for-the-badge&logoColor=white"> <img src="https://img.shields.io/badge/PDF_Parsing-B30B00?style=for-the-badge&logo=adobeacrobatreader&logoColor=white">

### DevOps & Testing

<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"> <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white"> <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white"> <img src="https://img.shields.io/badge/pytest-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white">


## 프로젝트 구조
```bash

.
├── frontend/
│   ├── src/
│   ├── docs/
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── api/
│   ├── worker/
│   ├── docs/
│   ├── data/
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── README.md
│
└── README.md
```

- GitHub Pages 리파지토리 Settings > Options > GitHub Pages 
  - Source를 marster branch
  - Theme Chooser에서 태마선택
  - 수정후 팀페이지 확인하여 점검.

**팀페이지 주소** -> https://kookmin-sw.github.io/ '{{자신의 리파지토리 아이디}}'

**예시)** 2023년 0조  https://kookmin-sw.github.io/capstone-2023-00/


##

❅ *˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧₊̥‧*˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧‧*˚̩͙*‧₊̊‧* ❅ *˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧₊̥‧*˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧‧*˚̩͙*‧₊̊‧* ❅ *˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧₊̥‧*˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧‧*˚̩͙*‧₊̊‧* ❅


저희는 산학협력 프로젝트를 진행하고 있는 23조 DURMONT입니다. 
Document Understanding & Representation Model Of Next Technology 의 줄임말로 문서를 이해하고 구조하는 차세대 기술 팀이라는 의미를 담고 있습니다.
저희는 '르몽' 이라는 회사와 협업하고 있습니다.

저희 팀의 궁극적인 목표는
한국형 문서인 HWP와 HWPX를 AI가 이해할 수 있는 구조화된 데이터로 변환하고, 문서 내 텍스트·표·이미지 정보를 추출해 검색과 질의응답에 활용할 수 있도록 지원하는 문서 분석 시스템을 구축하는 것입니다.

❅ *˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧₊̥‧*˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧‧*˚̩͙*‧₊̊‧* ❅ *˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧₊̥‧*˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧‧*˚̩͙*‧₊̊‧* ❅ *˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧₊̥‧*˚̩͙*‧₊̊‧*˚̩͙̩͙*‧₊̊‧*˚̩͙*‧‧*˚̩͙*‧₊̊‧* ❅


<br>

## 🔗 👥 팀 DURMONT 소개

<table>
  <tr>
    <td align="center" width="180px">
      <img src="이미지_URL_또는_경로" width="120px" height="120px" style="object-fit: cover;" />
      <br />
      <strong>김동연</strong>
      <br />
      PM & Frontend
      <br />
      <a href="https://github.com/0yeonnnn0">GitHub</a>
    </td>
    <td align="center" width="180px">
    <img width="472" height="630" alt="Image" src="https://github.com/user-attachments/assets/b5a45b34-3ec2-49d6-827b-bd9e812a026c" /> <br />
      <strong>김동진</strong>
      <br />
      Frontend
      <br />
      <a href="https://github.com/K-Dongjin">GitHub</a>
    </td>
    <td align="center" width="180px">
      <img src="이미지_URL_또는_경로" width="120px" height="120px" style="object-fit: cover;" />
      <br />
      <strong>박가현</strong>
      <br />
      Backend
      <br />
      <a href="https://github.com/gahyeon1022">GitHub</a>
    </td>
    <td align="center" width="180px">
      <img src="이미지_URL_또는_경로" width="120px" height="120px" style="object-fit: cover;" />
      <br />
      <strong>배경준</strong>
      <br />
      Backend
      <br />
      <a href="https://github.com/jun-kookmin">GitHub</a>
    </td>
    <td align="center" width="180px">
      <img src="이미지_URL_또는_경로" width="120px" height="120px" style="object-fit: cover;" />
      <br />
      <strong>강아영</strong>
      <br />
      AI
      <br />
      <a href="https://github.com/kaye0ng">GitHub</a>
    </td>
    <td align="center" width="180px">
      <img src="이미지_URL_또는_경로" width="120px" height="120px" style="object-fit: cover;" />
      <br />
      <strong>하승준</strong>
      <br />
      AI
      <br />
      <a href="https://github.com/seunG-Zzun">GitHub</a>
    </td>
  </tr>
</table>


### 4. 사용법

소스코드제출시 설치법이나 사용법을 작성하세요.

### 5. 기타

추가적인 내용은 자유롭게 작성하세요.


## Markdown을 사용하여 내용꾸미기

Markdown은 작문을 스타일링하기위한 가볍고 사용하기 쉬운 구문입니다. 여기에는 다음을위한 규칙이 포함됩니다.

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

자세한 내용은 [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Support or Contact

readme 파일 생성에 추가적인 도움이 필요하면 [도움말](https://help.github.com/articles/about-readmes/) 이나 [contact support](https://github.com/contact) 을 이용하세요.
