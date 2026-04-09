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
