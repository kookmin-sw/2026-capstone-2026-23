
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
2. 서비스 개발 배경
                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

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

<br/>
## 🛠 기술 스택

### Frontend

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"> <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white"> <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> <img src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white">

### Backend

<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"> <img src="https://img.shields.io/badge/Uvicorn-2D3748?style=for-the-badge&logo=gunicorn&logoColor=white"> <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white"> <img src="https://img.shields.io/badge/Redis-FF4438?style=for-the-badge&logo=redis&logoColor=white"> <img src="https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white">

### AI / Document Processing

<img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"> <img src="https://img.shields.io/badge/Qwen2.5--VL-1A73E8?style=for-the-badge&logo=alibabacloud&logoColor=white"> <img src="https://img.shields.io/badge/DeepSeek_OCR-4D6BFF?style=for-the-badge&logoColor=white"> <img src="https://img.shields.io/badge/HWP/HWPX_Document-005BAC?style=for-the-badge&logoColor=white"> <img src="https://img.shields.io/badge/PDF_Parsing-B30B00?style=for-the-badge&logo=adobeacrobatreader&logoColor=white">

### DevOps & Testing

<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"> <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white"> <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white"> <img src="https://img.shields.io/badge/pytest-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white">

<br />

## 개발환경
>>개발환경에 대한 소개
>>
>><br/>


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
<br />
데모 및 프리뷰
문서 업로드
<p align="center"> <img width="80%" alt="문서 업로드 화면" src="./docs/images/upload-preview.png" /> </p>
변환 결과 미리보기
<p align="center"> <img width="80%" alt="변환 결과 미리보기" src="./docs/images/result-preview.png" /> </p>
RAG 질의응답
<p align="center"> <img width="80%" alt="RAG 질의응답 화면" src="./docs/images/rag-preview.png" /> </p> <br />
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
