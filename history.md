# Image Match Web - 작업 이력

## 2026-04-10: Android → Web 포팅 완료

### 작업 개요
Android Java 기반 Mahjong 스타일 이미지 매칭 게임을 HTML5 Canvas + TypeScript 웹앱으로 포팅

### 수행 작업

#### 1. 프로젝트 초기 설정
- TypeScript + Jest 기반 프로젝트 구조 생성
- tsconfig.json (strict mode, ES2020 target)
- jest.config.js (ts-jest 기반)
- 자체 번들러 (build.js) 작성 - 외부 런타임 의존성 없음

#### 2. 게임 코어 로직 포팅 (src/game/)
- **Block.ts**: 블록 데이터 클래스 (type, x, y, far)
- **Board.ts**: 8x12 보드 로직, 4방향 매칭 알고리즘, 셔플, 힌트 시스템
- **BoardProfile.ts**: 화면 크기 계산, 상수 정의
- **GameInfo.ts**: 점수, 스테이지, 힌트, 시간 관리
- **GameState.ts**: 상태 머신 (NONE/IDLE/PLAY/PAUSE/END/GAMEOVER)
- **Mahjong.ts**: 메인 게임 컨트롤러, 상태 전환, 옵저버 패턴

#### 3. UI/렌더링 엔진 (src/ui/)
- **AssetGenerator.ts**: 프로시저럴 그래픽 생성 (65종 카드 + 버튼)
- **Renderer.ts**: Canvas 렌더러, DPR 대응, 반응형 레이아웃
- **InputHandler.ts**: 터치/마우스 입력 처리, 상태별 커맨드 라우팅

#### 4. 저장/불러오기 (src/storage/)
- **GameStorage.ts**: IndexedDB 기반 게임 상태 저장/복원
- 탭 전환/앱 백그라운드 시 자동 저장
- 이어하기 지원

#### 5. 앱 통합 (src/)
- **App.ts**: 게임 루프, 타이머, 자동 저장, 이벤트 처리
- **main.ts**: 엔트리 포인트

#### 6. TDD 테스트 (src/__tests__/)
- Block.test.ts: 7개 테스트
- Board.test.ts: 20개 테스트
- GameInfo.test.ts: 32개 테스트
- Mahjong.test.ts: 19개 테스트
- **총 78개 테스트 전부 통과**

### Android 원본 버그 수정 사항

| # | 버그 | 위치 | 수정 내용 |
|---|------|------|-----------|
| 1 | `calculatorScore()` 항상 0 반환 | GameInfoImpl.java:131 | `removedBlockCount * 10 + time * 5` 공식 구현 |
| 2 | 시간 초기화 `MAX_TIME+1` (61초) | GameInfoImpl.java:28,210 | `MAX_TIME` (60초)으로 수정 |
| 3 | `insertBlock()` 100회 루프 실패 시 경고 없음 | BoardImpl.java:181 | 실패 시 false 반환 확인, 호출부에서 1000회 루프로 재시도 |
| 4 | `shuffleImageList()` next > blockKind 시 셔플 누락 | BoardImpl.java:70 | 동일 로직 유지 (경미한 이슈) |

---

## 2026-04-10: 이미지 리소스 + 무지개 타이머 + 매칭 애니메이션

### 작업 개요
실제 Android 이미지 리소스 적용, 무지개색 타이머 바, 매칭 경로 애니메이션 추가

### 수행 작업

#### 1. 실제 이미지 리소스 적용
- `imagematch/res/drawable/` PNG 파일을 `assets/blocks/`, `assets/buttons/`로 복사
- **AssetGenerator.ts** 완전 리라이트: 비동기 이미지 로딩 (`loadImages()`)
- 이미지 로드 실패 시 프로시저럴 그래픽으로 자동 폴백
- `updateSize()` 시 로드된 원본 이미지에서 리사이즈

#### 2. 무지개색 타이머 바
- **Renderer.ts** `drawTimerBar()` 수정
- 단색 → 7색 무지개 그라데이션 (빨-주-노-초-청-남-보)
- 남은 시간만큼의 너비에 무지개 전체가 표시됨

#### 3. 매칭 애니메이션 (경로 표시 + 블록 사라짐)
- **Mahjong.ts**: `previewRemovableBlocks()` 메서드 추가 (제거 전 매칭 블록 미리보기)
- **Renderer.ts**: `drawMatchAnimation()` 메서드 추가 (3단계 애니메이션)
  - Phase 1 (0~40%): 클릭 위치 펄스 원 + 경로 라인 확장 애니메이션
  - Phase 2 (40~70%): 매칭 블록 하이라이트 + 플래시 효과
  - Phase 3 (70~100%): 블록 축소 + 페이드아웃
- **App.ts**: `startMatchAnimation()` 메서드 추가 (700ms rAF 루프)

#### 4. 애니메이션 중 타이머 정지 + 터치 차단
- **InputHandler.ts**: `setBlocked()` 메서드 추가, 차단 시 모든 입력 무시
- **App.ts**: `animating` 플래그로 타이머 틱 스킵
- 애니메이션 완료 후 자동 차단 해제 및 승리 조건 확인

---

## 2026-04-10: 타이머 바 위치 수정 + 애니메이션 시간 단축

### 수정 사항
1. **타이머 바 상단 짤림 수정**: `BoardProfile.setScreenSize()`에서 `startY`를 `bs`→`bs*1.5`로 변경, 분모 `boardHeight+5`→`boardHeight+5.5`로 조정하여 상단 여백 확보
2. **매칭 애니메이션 단축**: 700ms → 450ms로 변경하여 더 빠른 게임 템포

---

## 2026-04-10: 경로 끝점 원 추가 + 힌트 경로 표시 + 시작 버튼 수정

### 수정 사항
1. **애니메이션 경로 끝점 원**: 매칭 경로 라인의 시작점/끝점에 시안색 원(r=6) 추가, 3단계 모두 적용
2. **힌트 경로 표시**: 힌트 활성화 시 클릭 위치→매칭 블록 사이에 노란 경로 라인 + 끝점 원 표시, 클릭 셀에 점선 테두리
3. **시작 버튼 안 먹힘 수정**: `App.init()`에서 `InputHandler.setCurrentState()`를 호출하지 않아 상태가 `0`(MENU)으로 남아있던 버그. 게임 상태 동기화 추가

---

## 2026-04-10: 릴리스 스크립트 추가

### 수행 작업
- **release.sh** 스크립트 생성: 빌드 후 배포용 `release/` 폴더 자동 생성
  - 기존 `release/` 폴더 삭제 → `npm run build` → 필요한 파일만 복사
  - `index.html`, `bundle.js`, `assets/` 만 포함 (개발 파일 제외)
  - `index.html` 내 스크립트 경로 자동 수정 (`dist/bundle.js` → `bundle.js`)
- `.gitignore`에 `release/` 추가

---

## 2026-04-10: 고해상도(HiDPI) 디스플레이 이미지 흐림 수정

### 문제
웹앱에서 블록/버튼 이미지가 흐릿하게 표시됨. 고해상도(DPR 2x, 3x) 디스플레이에서 특히 심함.

### 원인
- 메인 캔버스는 `devicePixelRatio` 처리를 하여 고해상도 렌더링
- 그러나 `AssetGenerator`가 생성하는 오프스크린 캔버스(블록/버튼 이미지)는 1x 해상도로 생성
- 1x 이미지가 DPR 배율의 메인 캔버스에 확대되면서 흐림 발생

### 수정 사항

#### 1. AssetGenerator.ts - 오프스크린 캔버스 DPR 적용
- `dpr` 프로퍼티 추가, 생성자 및 `updateSize()`에서 갱신
- `drawImageToCanvas()`: 캔버스 크기를 `w*dpr × h*dpr`로 생성, 컨텍스트 `scale(dpr, dpr)` 적용
- `createFallbackBlock()`: 동일한 DPR 스케일링 적용
- `createFallbackButton()`: 일반 버튼 및 타이머바 모두 DPR 스케일링 적용

#### 2. Renderer.ts - 이미지 보간 품질 향상
- `resize()`에서 `imageSmoothingEnabled = true`, `imageSmoothingQuality = 'high'` 설정

### 기술 스택
- **언어**: TypeScript (strict mode)
- **렌더링**: HTML5 Canvas (Android 원본 PNG 이미지 + 프로시저럴 폴백)
- **저장소**: IndexedDB
- **테스트**: Jest + ts-jest
- **빌드**: TypeScript Compiler + 자체 번들러
- **외부 런타임 의존성**: 없음

### 지원 기기
- Galaxy Z Fold 7 펼친 화면 (2176x1812) 스크롤 없이 동작
- 모든 모바일/데스크톱 브라우저 (반응형)
- 터치 + 마우스 입력 지원
