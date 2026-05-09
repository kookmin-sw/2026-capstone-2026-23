
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Lvs6kcL8)

<p align="center">
  <img width="100%" alt="DURMONT Banner" src="https://github.com/user-attachments/assets/95720cd3-1f04-473f-beed-059e2fa0ae90" />
</p>

<p align="center">
  안녕하세요. 여기는 2026년도 캡스톤 23조 DURMONT의 GitHub입니다.
</p>

<br />

## ᕱ‬ DURMONT ‪ᕱ

<p align="center">
  <strong>Document Understanding & Representation Model Of Next Technology</strong>
</p>

<p align="center">
  DURMONT는 문서를 이해하고 구조화하는 차세대 기술을 목표로 하는 팀입니다.
</p>

<br />

## Luminar Document Parser

AI 기반 문서 분석 및 질의응답 시스템입니다.  
HWP, HWPX, PDF, 이미지 문서를 업로드하면 텍스트, 표, 이미지 정보를 추출하고, 추출된 문서를 기반으로 검색 및 RAG 질의응답을 제공합니다.

<br />

## 프로젝트 소개

저희는 산학협력 프로젝트를 진행하고 있는 23조 DURMONT입니다.

DURMONT는 **Document Understanding & Representation Model Of Next Technology**의 줄임말로, 문서를 이해하고 구조화하는 차세대 기술 팀이라는 의미를 담고 있습니다.  
저희는 **르몽**이라는 회사와 협업하며, 한국형 문서 분석 및 AI 기반 문서 활용 시스템을 개발하고 있습니다.

저희 팀의 궁극적인 목표는 **한국형 문서인 HWP와 HWPX를 AI가 이해할 수 있는 구조화된 데이터로 변환하고, 문서 내 텍스트·표·이미지 정보를 추출해 검색과 질의응답에 활용할 수 있도록 지원하는 문서 분석 시스템을 구축하는 것**입니다.

<br />


1. 파서란 무엇인가?

<img width="893" height="586" alt="Image" src="https://github.com/user-attachments/assets/57da5d0a-9b77-4216-b000-141b7df93ca7" />

문서 구조 추출 / 분석

<img width="862" height="586" alt="Image" src="https://github.com/user-attachments/assets/164b3a71-c405-4a11-a811-fac658c508a6" />

표, 이미지 등 구조 인식

2. 서비스 개발 배경

<img width="777" height="416" alt="Image" src="https://github.com/user-attachments/assets/622f58f2-1866-4083-9eb8-3e12f65a1ed2" /><img width="1554" height="318" alt="Image" src="https://github.com/user-attachments/assets/78b47fb9-58f4-4ada-bffe-bd067067d5e9" />
대한민국의 포부는 'AI' 3대 강국
<img width="884" height="483" alt="Image" src="https://github.com/user-attachments/assets/f5efe3c5-1596-4f7f-9057-5dff7f204814" />
부처 별 문서를 정확하게 읽고, 안전하게 연결하는 RAG 인프라 필요

<img width="767" height="187" alt="Image" src="https://github.com/user-attachments/assets/c23e153b-1564-47d6-b7a9-1ffde415f5b4" />
HWP, HWXP 등 한국형 문서를 인식하는 paser의 필요성 대두
                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

## 주요 목표

- HWP, HWPX, PDF, 이미지 문서의 자동 분석
- 문서 내 텍스트, 표, 이미지 정보 추출
- AI 모델을 활용한 문서 구조 이해
- 변환 결과 미리보기 및 다운로드
- 문서 기반 검색 및 RAG 질의응답 제공
- 대용량 문서 처리를 위한 비동기 작업 큐 지원

- 결국 한국의 AX 전환에 이바지

<br />

## 주요 기능

| 기능 | 설명 |
| --- | --- |
| 문서 업로드 | HWP, HWPX, PDF, 이미지 파일 업로드 |
| 문서 파싱 | 문서 내 텍스트, 표, 이미지 정보 추출 |
| 결과 미리보기 | 변환된 문서 내용을 화면에서 확인 |
| 작업 상태 확인 | 문서 변환 진행 상태를 실시간으로 확인 |
| 결과 다운로드 | 변환 결과를 파일 형태로 다운로드 |
| RAG 질의응답 | 업로드된 문서를 기반으로 질문하고 답변 생성 |
| 비동기 처리 | Redis, RabbitMQ 기반 대용량 문서 처리 |
| API 제공 | FastAPI 기반 REST API 제공 |

<br />


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

<br />

## 기능소개
>> 실사용화면 들어가야됨 ~~
>> 약간의 설명이랑 같이
<img width="3732" height="1140" alt="Image" src="https://github.com/user-attachments/assets/c6e0ba30-a9a6-44f7-8a55-241ff24bbfe3" />

<br />
데모 및 프리뷰
문서 업로드
<p align="center"> <img width="80%" alt="문서 업로드 화면" src="./docs/images/upload-preview.png" /> </p>
변환 결과 미리보기
<p align="center"> <img width="80%" alt="변환 결과 미리보기" src="./docs/images/result-preview.png" /> </p>
RAG 질의응답
<p align="center"> <img width="80%" alt="RAG 질의응답 화면" src="./docs/images/rag-preview.png" /> </p> <br />


## 🛠 기술 스택

### Frontend

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"> <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white"> <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> <img src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white">

### Backend

<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"> <img src="https://img.shields.io/badge/Uvicorn-2D3748?style=for-the-badge&logo=gunicorn&logoColor=white"> <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white"> <img src="https://img.shields.io/badge/Redis-FF4438?style=for-the-badge&logo=redis&logoColor=white"> <img src="https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white">

### AI / Document Processing

<img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"> <img src="https://img.shields.io/badge/Qwen2.5--VL-1A73E8?style=for-the-badge&logo=alibabacloud&logoColor=white"> <img src="https://img.shields.io/badge/HWP/HWPX_Document-005BAC?style=for-the-badge&logoColor=white"> <img src="https://img.shields.io/badge/PDF_Parsing-B30B00?style=for-the-badge&logo=adobeacrobatreader&logoColor=white">

### DevOps & Testing

<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"> <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white"> <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white"> <img src="https://img.shields.io/badge/pytest-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white">

<br />

## 🖥 개발 환경

| 분류 | 기술 |
| --- | --- |
| OS | Windows 11 / macOS / Ubuntu Linux |
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| State / Data | Zustand, TanStack Query |
| Backend | Python 3.12+, FastAPI, Uvicorn |
| AI / VLM | OpenAI API, Qwen2.5-VL |
| Queue | RabbitMQ |
| Cache | Redis |
| Database / Storage | SQLite |
| API 통신 | RESTful API, WebSocket |
| DevOps | Docker, Docker Compose |
| Package Manager | npm, pip |

<br/>

## 시스템 아키텍처
<br/>
<img width="3560" height="1764" alt="Image" src="https://github.com/user-attachments/assets/3a9a7bc5-8463-4e6f-a71a-5b5206f35a2f" />
<br/>

## 설치방법

1. Repository Clone
git clone https://github.com/kookmin-sw/capstone-2026-23.git
cd capstone-2026-23
2. Backend 설치
cd backend

python3.12 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
3. Frontend 설치
cd frontend

npm install
<br />

## 실행방법
Backend 실행
cd backend
source .venv/bin/activate

uvicorn api:app --host 0.0.0.0 --port 8000 --reload
Backend API 문서는 아래 주소에서 확인할 수 있습니다.

http://localhost:8000/docs
Frontend 실행
cd frontend

npm run dev
Frontend 개발 서버는 기본적으로 아래 주소에서 실행됩니다.

http://localhost:5173
<br />
Docker 실행
Redis, RabbitMQ, API 서버, Worker를 함께 실행하려면 Docker Compose를 사용할 수 있습니다.

cd backend

docker compose up --build
GPU 기반 로컬 VLM Worker를 함께 실행하려면 profile을 지정합니다.

docker compose --profile gpu up --build
<br />
사용법
웹 브라우저에서 프론트엔드 페이지에 접속합니다.
http://localhost:5173
문서 업로드 화면에서 HWP, HWPX, PDF 또는 이미지 파일을 업로드합니다.

문서 변환 작업을 생성합니다.

작업 진행 상태를 확인합니다.

변환이 완료되면 추출된 텍스트, 표, 이미지 결과를 미리보기로 확인합니다.

필요한 경우 변환 결과를 다운로드합니다.

업로드된 문서를 기반으로 검색하거나 RAG 질의응답을 수행합니다.

<br />
API 사용 예시
import requests

url = "http://localhost:8000/api/v1/process/file"

with open("sample.pdf", "rb") as file:
    files = {"file": file}
    response = requests.post(url, files=files)

result = response.json()
print(result)
자세한 API 명세는 Swagger 문서에서 확인할 수 있습니다.

http://localhost:8000/docs


## 🤝 협업 방식

DURMONT는 프론트엔드와 백엔드를 독립적으로 개발하면서도, 전체 프로젝트 구조와 API 인터페이스의 일관성을 유지하는 방식으로 협업했습니다.

---

### Git Flow

```text
main
 └── develop
      ├── feature/기능명
      ├── fix/버그명
      ├── refactor/개선명
      ├── chore/작업명
      └── docs/문서명
```

| 브랜치 | 설명 |
| --- | --- |
| `main` | 최종 배포 및 제출용 브랜치 |
| `develop` | 프론트엔드와 백엔드 작업이 통합되는 개발 브랜치 |
| `feature/*` | 새로운 기능 개발 |
| `fix/*` | 버그 수정 |
| `refactor/*` | 코드 구조 개선 및 리팩토링 |
| `chore/*` | 설정, 패키지, 빌드 등 기타 작업 |
| `docs/*` | README, API 문서 등 문서 작업 |

---

### 개발 흐름

```text
이슈 생성
  → 브랜치 생성
  → 기능 개발
  → 커밋
  → Push
  → Pull Request 생성
  → 코드 리뷰 및 CI 확인
  → develop merge
  → main merge 및 배포/제출
```

| 단계 | 내용 |
| --- | --- |
| Issue | 구현할 기능, 수정할 버그, 문서 작업을 Issue로 등록 |
| Branch | 작업 유형에 맞는 브랜치 생성 |
| Commit | Conventional Commits 형식으로 변경 내용 기록 |
| Push | 원격 저장소에 작업 브랜치 업로드 |
| Pull Request | 변경 내용, 테스트 여부, 참고 사항 작성 |
| Review | 팀원 리뷰 또는 자동화 도구 확인 후 머지 |
| Merge | `develop`에 통합 후 안정화된 버전을 `main`에 반영 |

---

### Branch Naming Convention

| 접두사 | 용도 | 예시 |
| --- | --- | --- |
| `feature/` | 새로운 기능 개발 | `feature/file-upload` |
| `fix/` | 버그 수정 | `fix/job-status-error` |
| `refactor/` | 코드 구조 개선 | `refactor/parser-pipeline` |
| `chore/` | 설정, 패키지, 빌드 작업 | `chore/update-deps` |
| `docs/` | 문서 작성 및 수정 | `docs/readme-update` |
| `test/` | 테스트 코드 작성 | `test/parser-api` |

---

### Commit Convention

커밋 메시지는 Conventional Commits 형식을 사용합니다.

```text
type(scope): message
```

`scope`는 선택 사항이며, 작업 범위를 나타냅니다.

```text
feat(parser): add document convert API
fix(queue): resolve job status update bug
docs(readme): update installation guide
refactor(api): separate parser router logic
test(frontend): add file uploader test
```

| 타입 | 설명 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | 코드 포맷팅, UI 스타일 수정 |
| `refactor` | 기능 변경 없는 코드 구조 개선 |
| `test` | 테스트 코드 추가 및 수정 |
| `chore` | 빌드, 패키지, 설정 등 기타 작업 |
| `init` | 프로젝트 초기 설정 |
| `update` | 기존 기능 보완 |
| `remove` | 파일 또는 코드 삭제 |
| `move` | 파일 또는 코드 이동 |
| `rename` | 파일 또는 폴더 이름 변경 |
| `comment` | 주석 추가 또는 수정 |
| `upload` | 이미지, 문서 등 파일 업로드 |

---

### Pull Request Rule

| 항목 | 규칙 |
| --- | --- |
| PR 대상 | 기능 브랜치에서 `develop`으로 PR 생성 |
| PR 내용 | 변경 내용, 테스트 여부, 참고 사항 작성 |
| Review | 팀원 1인 이상 확인 후 머지 |
| CI | 가능하면 lint, test, build 통과 후 머지 |
| Conflict | 충돌 해결 후 다시 확인 |
| Merge 기준 | 기능 동작 확인 및 코드 품질 확인 후 머지 |

---

### Issue Management

GitHub Issue, Milestone, Label을 활용하여 작업을 관리했습니다.

| 항목 | 설명 |
| --- | --- |
| Issue | 기능 구현, 버그 수정, 문서 작업 등 작업 단위 관리 |
| Milestone | 주차별 목표 및 발표/제출 일정 관리 |
| Label | `frontend`, `backend`, `ai`, `docs`, `bug`, `enhancement` 등으로 작업 분류 |
| Issue Template | 작업 목적, 구현 내용, 체크리스트를 명확히 기록 |

---

### Code Quality

| 항목 | 사용 도구 |
| --- | --- |
| Frontend Formatting | Prettier |
| Frontend Lint | ESLint |
| Frontend Unit Test | Vitest |
| Frontend E2E Test | Playwright |
| Backend Test | pytest |
| API 문서 | FastAPI Swagger |
| 배포 환경 | Docker, Docker Compose |

---

### 협업 원칙

| 원칙 | 설명 |
| --- | --- |
| 역할 분리 | 프론트엔드, 백엔드, AI/문서 처리 작업 범위를 분리 |
| API 우선 협업 | 요청/응답 구조를 기준으로 프론트와 백엔드 병렬 개발 |
| 작은 단위 작업 | 기능을 작은 Issue와 PR 단위로 나누어 관리 |
| 문서화 | 설치 방법, API, 사용법, 시행착오를 README와 docs에 기록 |
| 리뷰 기반 통합 | PR 단위로 변경 내용을 확인한 뒤 `develop`에 통합 |
| 안정성 우선 | 기능 추가뿐 아니라 병목, 오류, 배포 가능성을 함께 검토 |

<br/>
팀 DURMONT 소개
<table> <tr> <td align="center" width="180px"> <img src="https://github.com/0yeonnnn0.png" width="120px" height="120px" alt="김동연" /> <br /> <strong>김동연</strong> <br /> PM & Full Stack <br /> <a href="https://github.com/0yeonnnn0">GitHub</a> </td> <td align="center" width="180px"> <img src="https://github.com/K-Dongjin.png" width="120px" height="120px" alt="김동진" /> <br /> <strong>김동진</strong> <br /> Frontend <br /> <a href="https://github.com/K-Dongjin">GitHub</a> </td> <td align="center" width="180px"> <img src="https://github.com/gahyeon1022.png" width="120px" height="120px" alt="박가현" /> <br /> <strong>박가현</strong> <br /> Backend <br /> <a href="https://github.com/gahyeon1022">GitHub</a> </td> <td align="center" width="180px"> <img src="https://github.com/jun-kookmin.png" width="120px" height="120px" alt="배경준" /> <br /> <strong>배경준</strong> <br /> Backend <br /> <a href="https://github.com/jun-kookmin">GitHub</a> </td> <td align="center" width="180px"> <img src="https://github.com/seunG-Zzun.png" width="120px" height="120px" alt="하승준" /> <br /> <strong>하승준</strong> <br /> Backend & AI <br /> <a href="https://github.com/seunG-Zzun">GitHub</a> </td> <td align="center" width="180px"> <img src="https://github.com/kaye0ng.png" width="120px" height="120px" alt="강아영" /> <br /> <strong>강아영</strong> <br /> AI <br /> <a href="https://github.com/kaye0ng">GitHub</a> </td> </tr> </table> <br />
상세 문서

Backend README

Frontend README

Backend Architecture

Backend Install Guide

API 문서

Worker Routing

Frontend Project Guide

Frontend Testing Guide
<br />
GitHub Pages
팀 페이지는 GitHub Pages를 통해 확인할 수 있습니다.

[https://kookmin-sw.github.io/capstone-2026-23/
](https://kookmin-sw.github.io/2026-capstone-23/) <br />
기타
본 프로젝트는 국민대학교 소프트웨어융합대학 2026 캡스톤디자인 산학협력 프로젝트로 진행되었습니다.
