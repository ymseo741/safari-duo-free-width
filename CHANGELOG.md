# Changelog

## 0.1.7

- Start all four options ON for new sites and migrate earlier saved preferences once.
- Preserve choices made after migration per origin.
- 모든 옵션의 기본값을 ON으로 변경하고 이전 설정을 한 번 이전합니다.

## 0.1.6

- Add an optional numeric viewport width and retain activation when that changes the layout viewport width.
- User reported successful operation on both sides of inner-screen Split View with all options ON.
- 숫자 뷰포트 너비 옵션을 추가했습니다. 내부 분할 화면의 양쪽 배치에서 사용자 동작 확인을 받았습니다.

## 0.1.5

- Add an optional `shrink-to-fit=no` directive. This change alone did not resolve the reported Split View issue.
- 자동 축소 방지 요청을 추가했으나, 이 변경만으로 분할 화면 문제가 해결되지는 않았습니다.

## 0.1.4

- Keep settings behind `#duo-controls` without a permanent on-page launcher.
- 상시 버튼을 없애고 설정 주소에서만 패널을 표시합니다.
