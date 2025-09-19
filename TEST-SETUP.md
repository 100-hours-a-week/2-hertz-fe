# 🧪 단위 테스트 설정 및 실행 가이드

## 📖 개요

이 프로젝트에는 Jest와 React Testing Library를 사용한 포괄적인 단위 테스트 환경이 구축되어 있습니다.

## 🛠️ 설치된 테스트 도구

- **Jest**: JavaScript 테스트 프레임워크
- **React Testing Library**: React 컴포넌트 테스트 도구
- **@testing-library/jest-dom**: Jest DOM 매처 확장
- **@testing-library/user-event**: 사용자 이벤트 시뮬레이션
- **ts-jest**: TypeScript 지원

## 📁 테스트 파일 구조

```
src/
├── __tests__/
│   ├── components/
│   │   ├── LoadingSpinner.test.tsx      # 로딩 스피너 컴포넌트 테스트
│   │   └── KeywordTag.test.tsx          # 키워드 태그 컴포넌트 테스트
│   ├── utils/
│   │   └── format.test.ts               # 날짜 포맷 함수 테스트
│   ├── lib/
│   │   ├── utils.test.ts                # 클래스명 유틸리티 테스트
│   │   └── api/
│   │       ├── auth.test.ts             # 인증 API 테스트
│   │       └── user.test.ts             # 사용자 API 테스트
│   ├── stores/
│   │   ├── useSSEStore.test.ts          # SSE 스토어 테스트
│   │   ├── useConfirmModalStore.test.ts # 확인 모달 스토어 테스트
│   │   └── useNewAlarmStore.test.ts     # 알림 스토어 테스트
│   ├── error-handling.test.ts           # 에러 핸들링 테스트
│   └── test-utils.tsx                   # 테스트 유틸리티 함수
├── jest.config.js                       # Jest 설정 파일
└── jest.setup.js                        # Jest 초기 설정 파일
```

## 📋 테스트 스크립트

```bash
# 모든 테스트 실행
pnpm test

# 변경 사항 감지하여 테스트 실행 (watch 모드)
pnpm test:watch

# 커버리지 포함 테스트 실행
pnpm test:coverage
`
# CI/CD 환경용 테스트 실행
pnpm test:ci
```

## 🎯 테스트 커버리지 목표

- **Statements**: 50% 이상
- **Branches**: 50% 이상
- **Functions**: 50% 이상
- **Lines**: 50% 이상

## 📊 커버리지 리포트

커버리지 리포트는 다음 형식으로 생성됩니다:

- **텍스트**: 터미널에 표시
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`

## 🧩 작성된 테스트 영역

### 1. 컴포넌트 테스트

- **LoadingSpinner**: 로딩 상태 표시 컴포넌트
  - 기본 렌더링
  - SyncLoader 속성 확인
  - 접근성 검증
  - 레이아웃 스타일 확인
- **KeywordTag**: 키워드 태그 표시 컴포넌트
  - 키워드 매핑 로직
  - PreferredPeople 특별 처리
  - variant 속성 테스트
  - 다양한 입력값 처리

### 2. 유틸리티 함수 테스트

- **formatKoreanDate**: 날짜 한국어 포맷팅
  - 유효한 날짜 처리
  - 잘못된 입력 처리
  - 경계값 테스트
  - 출력 형식 검증

- **cn**: 클래스명 결합 유틸리티
  - 기본 기능
  - 조건부 클래스
  - 객체/배열 형태 처리
  - Tailwind CSS 충돌 해결

### 3. API 함수 테스트

- **auth.ts**: 인증 관련 API
  - 카카오 로그인
  - 액세스 토큰 재발급
  - 로그아웃
  - 에러 처리

- **user.ts**: 사용자 관련 API
  - 사용자 정보 조회
  - 한줄소개 수정
  - 웹푸시 구독
  - 타입 안전성 검증

### 4. 상태 관리 테스트

- **useSSEStore**: SSE 연결 관리
  - 초기 상태
  - reconnect 함수 설정
  - 상태 공유 확인

- **useConfirmModalStore**: 확인 모달 상태
  - 모달 열기/닫기
  - 임시 숨기기/복원
  - 콜백 함수 동작

- **useNewAlarmStore**: 알림 상태
  - 상태 변경
  - 타입 안전성
  - 여러 컴포넌트 간 공유

### 5. 에러 핸들링 테스트

- 다양한 타입의 잘못된 입력
- 네트워크 에러 시뮬레이션
- 메모리 누수 방지
- 경계값 테스트
- 동시성 테스트

## 🔧 Jest 설정 주요 사항

### 모듈 별칭 매핑

```javascript
moduleNameMapping: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@components/(.*)$': '<rootDir>/src/components/$1',
  '^@lib/(.*)$': '<rootDir>/src/lib/$1',
  // ... 기타 별칭들
}
```

### 모킹 설정

- Next.js 컴포넌트 (Image, Link, Router)
- Socket.IO
- EventSource (SSE)
- IntersectionObserver
- localStorage/sessionStorage

### 커버리지 제외 파일

- 타입 정의 파일 (\*.d.ts)
- 스토리북 파일 (\*.stories.tsx)
- 테스트 파일 자체
- Next.js 앱 라우터 파일들

## 🚀 테스트 실행 방법

1. **전체 테스트 실행**:

   ```bash
   pnpm test
   ```

2. **특정 파일 테스트**:

   ```bash
   pnpm test LoadingSpinner.test.tsx
   ```

3. **커버리지 포함 실행**:

   ```bash
   pnpm test:coverage
   ```

4. **변경 감지 모드**:
   ```bash
   pnpm test:watch
   ```

## 📝 테스트 작성 가이드

### 기본 테스트 구조

```typescript
import { render, screen } from '@/__tests__/test-utils'
import ComponentToTest from '@/components/ComponentToTest'

describe('ComponentToTest', () => {
  it('should render correctly', () => {
    render(<ComponentToTest />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### API 테스트 예시

```typescript
import { mockApiResponse, mockApiError } from '@/__tests__/test-utils';

describe('API Function', () => {
  it('should handle success response', async () => {
    const mockData = { success: true };
    mockAxios.get.mockResolvedValue(mockApiResponse(mockData));

    const result = await apiFunction();
    expect(result).toEqual(mockData);
  });
});
```

## 🐛 문제 해결

### 모듈을 찾을 수 없는 경우

- `moduleNameMapping` 설정 확인
- 파일 경로가 올바른지 확인

### 컴포넌트 렌더링 실패

- 필요한 Provider가 래핑되어 있는지 확인
- `test-utils.tsx`의 커스텀 render 함수 사용

### TypeScript 에러

- `tsconfig.json` 설정 확인
- Jest의 TypeScript 설정 확인

## 📈 개선 사항

앞으로 추가할 수 있는 테스트:

- E2E 테스트 (Playwright/Cypress)
- 시각적 회귀 테스트
- 성능 테스트
- 접근성 테스트 확장
- API 통합 테스트
