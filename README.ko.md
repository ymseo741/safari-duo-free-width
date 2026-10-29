# Safari Duo Free Width

**iPhone Duo Safari의 측면 컨트롤 옆 여백까지 웹페이지를 넓히기 위한 무료 오픈소스 유저스크립트입니다.**

[English](README.md) · [전체 스크립트](safari-duo-free-width.user.js) · [MIT 라이선스](LICENSE)

[최신 릴리스 받기](https://github.com/ymseo741/safari-duo-free-width/releases/latest) · [스크립트 원본](https://raw.githubusercontent.com/ymseo741/safari-duo-free-width/main/safari-duo-free-width.user.js)

**0.1.7**은 모든 사이트에서 옵션 네 개를 기본 ON으로 시작합니다. 상시 떠 있는 버튼이나 유료 잠금이 없으며, 별도 빌드 없이 Userscripts에 넣어 사용합니다.

## 주요 기능

- 지원되는 창 크기에서 웹페이지 본문 폭을 확장합니다.
- `device-width` 대신 숫자로 된 뷰포트 너비를 지정할 수 있습니다.
- Safari에 자동 축소 방지를 요청하고, 우측 가장자리의 일부 고정 요소를 보정합니다.
- 사이트가 로딩 후 뷰포트를 다시 설정해도 스크립트 설정을 유지합니다.
- 필요할 때만 설정창을 열며, 옵션은 사이트별로 저장됩니다.

웹페이지의 배치를 변경하는 스크립트입니다. Safari 자체의 툴바를 바꾸거나 브라우저 버튼 옆에 네이티브 버튼을 추가하지는 않습니다.

## 설치 방법

1. Safari용 **Userscripts** 확장을 준비합니다. [공식 프로젝트](https://github.com/quoid/userscripts)
2. Safari에서 [스크립트 원본](https://raw.githubusercontent.com/ymseo741/safari-duo-free-width/main/safari-duo-free-width.user.js)을 연 뒤 Userscripts 확장 메뉴를 열어 설치합니다. 또는 원본 `.user.js` 파일을 내려받습니다.
3. 파일을 직접 내려받았다면 Userscripts 앱에 지정된 스크립트 폴더에 넣습니다.
4. Safari에서 Userscripts를 활성화하고 사용할 사이트의 실행 권한을 허용합니다. 여러 사이트에 자동 적용하려면 **모든 웹사이트 허용**으로 설정합니다.
5. 이전 **Safari Duo Free Width** 파일은 끄고 최신 파일 하나만 켠 뒤 페이지를 새로고침합니다.

실행 대상은 HTTP·HTTPS 사이트 전체입니다. 실제 폭 변경은 기기와 창 크기 조건이 맞을 때 활성화됩니다. Safari 내부 페이지와 페이지 안에 삽입된 프레임은 대상이 아닙니다.

## 설정창 열기

현재 페이지 주소 끝에 **`#duo-controls`**를 붙입니다.

```text
https://m.naver.com/#duo-controls
```

주소에 이미 `#` 뒤의 내용이 있다면 잠시 교체해 주세요. **닫기**를 누르면 설정창이 사라지며 화면에 별도 버튼이 남지 않습니다.

| 옵션 | 기능 |
| --- | --- |
| 전체폭 | 본문을 감지된 목표 너비로 확장합니다. |
| 보정 | 우측 가장자리에 걸린 일부 대형 fixed·sticky 요소를 잘라 배경이 여백을 덮는 현상을 줄이려는 기능입니다. 왼쪽 컨트롤에는 효과가 없을 수 있습니다. |
| 자동축소 방지 | `shrink-to-fit=no`를 요청합니다. Safari의 모든 확대·축소를 고정하는 기능은 아닙니다. |
| 뷰포트 너비 지정 | `device-width` 대신 실제 숫자 너비를 전달합니다. 내부 분할 화면에서 성공한 시험본의 핵심 변경입니다. |
| 진단 | 화면 크기와 현재 설정을 알림창으로 표시합니다. |

0.1.7을 처음 실행하면 기존 버전의 OFF 설정도 **모두 ON**으로 전환합니다. 이후 직접 변경한 옵션은 사이트별로 저장됩니다. 다른 사이트나 다른 기기로 동기화되지는 않습니다. 저장소 사용이 차단된 사이트에서는 현재 페이지에서만 설정이 유지될 수 있습니다.

## 확인된 범위와 제한 사항

**사용자 기기에서 보고된 결과:** 이전 버전에서 외부 화면 동작이 확인됐습니다. 0.1.6에서는 옵션을 모두 켠 상태로 내부 분할 화면의 Safari 왼쪽·오른쪽 배치 모두 작동했다는 피드백을 받았습니다. 시험 사이트는 `m.naver.com`이며, 사용자가 알려준 OS는 iOS 27.2 베타입니다.

0.1.7은 기본 옵션을 모두 ON으로 변경한 버전입니다. 새로운 렌더링 방식이 추가 검증된 것은 아닙니다. 로컬 DOM 테스트로 설정 전환, 이전 설정의 이전 처리, 뷰포트 지시문, 넓은 화면에서 해제되는 동작과 원상복구를 확인했습니다. 이 테스트는 Safari 컨트롤 뒤에 실제로 그려지는 화면을 재현하지 못합니다. 모든 사이트나 향후 Safari 버전에서의 호환성이 확인된 것은 아닙니다.

- 현재는 iPhone 사용자 에이전트, 세로 방향 미디어 쿼리, 특정 뷰포트 크기를 기준으로 동작합니다. 모든 iPad·데스크톱 창을 지원하는 도구는 아닙니다.
- 사이트 내부의 고정 폭 레이아웃이나 삽입 콘텐츠 때문에 여백 또는 잘림이 남을 수 있습니다.
- 수집된 브라우저 좌표만으로 Safari의 좌우 배치를 확실히 구별하지 못합니다. 현재 보정 기능은 우측 가장자리를 검사합니다.
- 활성화 중에는 페이지의 뷰포트 메타태그 일부를 변경합니다. 손가락 확대와 페이지 크기는 Safari의 처리 방식에도 영향을 받습니다.
- Apple의 공식 설정이 아닌 실험적인 우회 방법입니다.

## 문제가 있을 때

변화가 없다면 해당 사이트의 Userscripts 실행 권한과 최신 파일 하나만 켜져 있는지 확인하고, `#duo-controls`에서 옵션이 ON인지 확인해 주세요.

화면이 잘리거나 불편하면 **보정**, **뷰포트 너비 지정**을 차례로 끄거나 **전체폭**을 OFF로 바꿉니다. 원래 화면과 비교하려면 스크립트를 끄고 새로고침해 주세요. 문제를 제보할 때는 사이트 주소, OS 버전, 외부·내부 화면, 분할 화면의 좌우 위치와 켠 옵션을 알려주시면 도움이 됩니다. 진단 결과를 공개하기 전에 내용을 확인해 주세요.

## 개인정보

분석 도구, 외부 코드 로딩, 스크립트 자체의 네트워크 요청이 없습니다. 페이지 배치를 읽고 현재 사이트의 `localStorage`에 옵션을 저장합니다. 같은 사이트의 스크립트도 이 저장소에 접근할 수 있습니다. 진단 내용은 로컬에 표시되며 자동 전송되지 않습니다.

## 공유와 수정

[MIT 라이선스](LICENSE)에 따라 저작권·라이선스 고지를 유지하면 사용, 복사, 수정, 재배포가 가능합니다. 포크, 호환성 제보와 풀 리퀘스트를 환영합니다. 실제 기기에서 확인한 결과와 DOM 모의 테스트 결과를 구별해 주세요.

Safari, iPhone 등 제품명은 각 권리자의 소유입니다. 이 프로젝트는 Apple 및 Userscripts와 제휴하지 않은 독립 프로젝트입니다.


## 참고 자료

- [Offform: Designing websites for iPhone Duo](https://www.offform.design/designing-websites-for-iphone-duo-how-we-made-our-framer-sites-go-edge-to-edge/)
- [WebKit: LocalFrameView.cpp](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/page/LocalFrameView.cpp)
- [Userscripts metadata documentation](https://github.com/quoid/userscripts#metadata)

공개된 구현 원리를 참고해 작성했으며 OutSpan이나 Wide Web의 소스 코드를 포함하지 않습니다.
