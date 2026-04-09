# ImageMatch Web

Android 마작 스타일 이미지 매칭 게임의 웹 버전입니다.

## 게임 방법

1. **빈 칸을 클릭**하면 4방향(상/하/좌/우)으로 가장 가까운 블록을 탐색합니다
2. 같은 종류의 블록 2개가 발견되면 **자동으로 제거**됩니다
3. 제한 시간(60초) 내에 모든 블록을 제거하면 **스테이지 클리어**
4. 힌트 버튼(💡)으로 매칭 가능한 쌍을 확인할 수 있습니다

## 실행 방법

```bash
# 의존성 설치 (개발용)
npm install

# 빌드
npm run build

# index.html을 브라우저에서 열기
# (로컬 서버 권장)
npx serve .
```

## 개발

```bash
# 테스트 실행
npm test

# 테스트 (watch 모드)
npm run test:watch
```

## 프로젝트 구조

```
src/
├── game/           # 게임 코어 로직
│   ├── Block.ts        # 블록 데이터
│   ├── Board.ts        # 보드 (8x12) 및 매칭 알고리즘
│   ├── BoardProfile.ts # 화면/레이아웃 상수
│   ├── GameInfo.ts     # 점수/스테이지/힌트/시간
│   ├── GameState.ts    # 상태 머신
│   └── Mahjong.ts      # 메인 게임 컨트롤러
├── ui/             # 렌더링 및 입력
│   ├── AssetGenerator.ts  # PNG 이미지 로딩 + 프로시저럴 폴백
│   ├── Renderer.ts        # Canvas 렌더러
│   └── InputHandler.ts    # 터치/마우스 입력
├── storage/        # 데이터 저장
│   └── GameStorage.ts     # IndexedDB 저장/불러오기
├── __tests__/      # 테스트 (78개)
├── App.ts          # 앱 통합
└── main.ts         # 엔트리 포인트
```

## 특징

- **외부 라이브러리 없음**: 런타임 의존성 제로
- **TypeScript**: strict 모드 전체 적용
- **반응형**: Galaxy Z Fold 7 펼친 화면 포함 모든 화면에서 스크롤 없이 동작
- **이어하기**: IndexedDB로 게임 상태 자동 저장, 탭 전환/브라우저 종료 후 이어하기 가능
- **TDD**: 78개 단위 테스트 (Jest)
- **원본 이미지**: Android 앱의 실제 PNG 이미지 사용 (프로시저럴 폴백 지원)
- **무지개 타이머**: 7색 무지개 그라데이션 시간 게이지
- **매칭 애니메이션**: 클릭 위치 표시 → 경로 라인 → 블록 사라짐 (700ms, 타이머 정지 + 입력 차단)

## Android 원본 대비 개선 사항

| 항목 | 변경 내용 |
|------|-----------|
| 점수 계산 | `calculatorScore()` 미구현 → `블록수×10 + 시간×5` 구현 |
| 시간 초기화 | 61초(MAX_TIME+1) → 60초(MAX_TIME)로 수정 |
| 저장 기능 | 없음 → IndexedDB 자동 저장/이어하기 |
| 반응형 | 고정 해상도 → 동적 화면 크기 대응 |

## 기술 스택

- TypeScript 5.4+
- HTML5 Canvas
- IndexedDB
- Jest (테스트)

## 원본

- Android 앱: [imagematch/](imagematch/) 디렉토리 참조
- 설계 문서: [doc/](doc/) 디렉토리 참조
