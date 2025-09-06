# Tuning (튜닝)
> 매칭된 인연에 대한 이벤트를 속보처럼 전달하는 소셜 디스커버리 서비스
<img width="1922" height="1080" alt="Group 2085669952" src="https://github.com/user-attachments/assets/73fc8406-8ce2-4ede-aaa7-58911b541026" />
<br>

## 📚 프로젝트 개요

TUNING은 조직 내부 사용자 간의 자연스럽고 부담 없는 소통을 돕는 **소셜 매칭 서비스**입니다. 사용자는 복잡한 설정 없이 관심사 기반의 감정 신호를 통해 자신과 유사한 주파수를 가진 사람들과 연결됩니다. 매칭은 실시간으로 바로 공개되지 않으며, 매일 오후 12시에 튜닝 리포트(뉴스) 알림을 통해 결과가 전달됩니다.

단순한 사용자 소개를 넘어 지속 가능한 관계 형성과 안정적인 커뮤니케이션 환경 제공을 핵심 가치로 생각합니다. 사회적 장벽을 낮추고 누구나 안전하고 편안하게 새로운 인연을 시작할 수 있도록 돕는 것이 저희의 목표입니다.

**당신만의 주파수를 찾고 있다면, 지금 TUNING으로 시작해보세요!**

<br>

## 📊 프로젝트 전 설계 문서 작성하기
* [기술 스택 선정](https://github.com/100-hours-a-week/2-hertz-wiki/wiki/%5BFE%5D-%EA%B8%B0%EC%88%A0%EC%8A%A4%ED%83%9D-%EC%84%A0%EC%A0%95)<br>
* [유저 플로우 차트 작성](https://github.com/100-hours-a-week/2-hertz-wiki/wiki/%5BFE%5D-%EC%9C%A0%EC%A0%80-%ED%94%8C%EB%A1%9C%EC%9A%B0-%EC%B0%A8%ED%8A%B8-%EC%9E%91%EC%84%B1)
* [프로젝트 도메인 테크스펙 작성](https://github.com/100-hours-a-week/2-hertz-wiki/wiki/%5BFE%5D-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EB%8F%84%EB%A9%94%EC%9D%B8-%ED%85%8C%ED%81%AC%EC%8A%A4%ED%8E%99-%EC%9E%91%EC%84%B1)
* [프론트엔드 개발 표준 및 구조 설계](https://github.com/100-hours-a-week/2-hertz-wiki/wiki/%5BFE%5D-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C-%ED%91%9C%EC%A4%80-%EB%B0%8F-%EA%B5%AC%EC%A1%B0-%EC%84%A4%EA%B3%84)
* [성능 최적화 방안 설계](https://github.com/100-hours-a-week/2-hertz-wiki/wiki/%5BFE%5D-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94-%EB%B0%A9%EC%95%88-%EC%84%A4%EA%B3%84)
<br>

## 👩🏻‍💻 프론트엔드 팀 구성
| 프론트엔드 |
|:-:|
|<img src="https://avatars.githubusercontent.com/u/150661115?v=4" width="150" height="150"/> | 
김다은<br/>[@dani1552](https://github.com/dani1552) |
| **프로젝트 대표자**를 맡아 **기획, UI/UX 전 페이지의 디자인, 개발 및 성능 최적화**를 담당했습니다.|
<br>

## 📍 주요 기능

### 1) 회원가입, 로그인
- 카카오 소셜 로그인 및 조직 별 초대코드 구현, React Hook Form을 이용한 개인정보 입력 다단계 폼을 구현하였습니다.
<img width="1920" height="1080" alt="Frame 2085669726" src="https://github.com/user-attachments/assets/f81b9e56-7cf5-41a5-b96d-a2e220c83b9f" />
<img width="1920" height="1080" alt="Frame 2085669727" src="https://github.com/user-attachments/assets/9e366058-d3ac-4de0-9eac-28213645c8df" />

### 2) 홈 페이지, 매칭 페이지
- 회원가입 시 입력한 개인 정보를 기반으로 AI가 같은 조직 내부에서 가장 잘 맞는 사용자를 추천해줍니다. FCM(Firebase Cloud Messaging) 기반 WebPush으로 기기 알림도 확인할 수 있습니다.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1370f9af-9dd2-4c67-8954-1f1798931a29" />

### 3) 채팅 페이지
- `WebSocket`을 사용한 실시간 채팅, `SSE(Server Sent Events)`를 활용한 매칭 선택 모달 상태 관리 등 복잡하게 구성된 페이지를 구현하였습니다.
- 채팅 우클릭 시 메세지 신고 기능이 구현되어 AI가 부적절한 메세지를 검열합니다.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e23a160a-9789-4e1f-8fa1-f147d8f1692e" />

### 4) 리포트 페이지
- 매칭된 사용자 중 커플 / 친구 카테고리에서 대화를 가장 활발하게 나눈 쌍을 선별해 조직 안의 인연을 재미있는 리포트로 공유합니다.
- 같은 조직 내 사용자들에게 공개되어 이모지로 반응을 남길 수 있습니다.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/32c1ea4c-cc85-49d4-ba04-eb4f97ef0484" />
<br>

## 👥 Team Hertz
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d923b595-6bff-4ec9-ac89-0bb4564ffc4b" />
<img width="1920" height="1080" alt="Frame 2085669741" src="https://github.com/user-attachments/assets/6f4fc3a9-999d-4ca6-8dff-2f53be73006c" />
<br>

## 💻 사용된 기술 스택

| **카테고리** | **기술/라이브러리** | **버전** | **용도** |
|-------------|-------------------|---------|----------|
| **프레임워크** | Next.js | 15.3.0 | React 기반 풀스택 프레임워크 |
| | React | 19.0.0 | UI 라이브러리 |
| | React DOM | 19.0.0 | React DOM 렌더링 |
| **언어** | TypeScript | 5.4.4 | 정적 타입 체크 |
| | JavaScript | ES2017+ | 런타임 언어 |
| **상태 관리** | Zustand | 5.0.3 | 전역 상태 관리 |
| | TanStack Query | 5.74.7 | 서버 상태 관리 |
| **스타일링** | Tailwind CSS | 4.0 | CSS 프레임워크 |
| | Framer Motion | 12.9.7 | 애니메이션 라이브러리 |
| | Tailwind Merge | 3.2.0 | 클래스 병합 유틸리티 |
| **UI 컴포넌트** | Radix UI | 다양한 버전 | Headless UI 컴포넌트 |
| | Lucide React | 0.503.0 | 아이콘 라이브러리 |
| | React Icons | 5.5.0 | 아이콘 라이브러리 |
| | React Spinners | 0.17.0 | 로딩 스피너 |
| **폼 관리** | React Hook Form | 7.56.1 | 폼 상태 관리 |
| | Zod | 3.24.4 | 스키마 검증 |
| | Hookform Resolvers | 5.0.1 | 폼 검증 통합 |
| **HTTP 클라이언트** | Axios | 1.8.4 | HTTP 요청 라이브러리 |
| **실시간 통신** | Socket.io Client | 2.0.3 | WebSocket 통신 |
| | Event Source | 1.0.31 | SSE(Server-Sent Events) |
| **Firebase** | Firebase | 12.0.0 | 푸시 알림, 인증 등 |
| **UI/UX 라이브러리** | Keen Slider | 6.8.6 | 슬라이더 컴포넌트 |
| | Embla Carousel | 8.6.0 | 캐러셀 컴포넌트 |
| | React Hot Toast | 2.5.2 | 토스트 알림 |
| | React Intersection Observer | 9.16.0 | 스크롤 감지 |
| **텍스트 처리** | React Markdown | 10.1.0 | 마크다운 렌더링 |
| **유틸리티** | Day.js | 1.11.13 | 날짜/시간 처리 |
| | clsx | 2.1.1 | 조건부 클래스명 |
| **개발 도구** | ESLint | 9.0 | 코드 린팅 |
| | Prettier | 3.5.3 | 코드 포매팅 |
| | Husky | - | Git hooks |
| | lint-staged | - | 커밋 전 린팅 |
| **패키지 관리** | pnpm | - | 패키지 매니저 |
| **컨테이너** | Docker | - | 컨테이너화 |
| **웹 기술** | PWA | - | Progressive Web App |
| | Service Worker | - | 백그라운드 작업 |
| | Web Manifest | - | 앱 메타데이터 |
| **런타임** | Node.js | 20 (Alpine) | JavaScript 런타임 |
| **최적화** | Turbopack | - | 고속 번들러 (dev 모드) |
<br>

## 프로젝트 아키텍처
<img width="1920" height="1080" alt="빈 슬라이드" src="https://github.com/user-attachments/assets/783e3a7d-5170-4430-8952-a20a340002bb" />
