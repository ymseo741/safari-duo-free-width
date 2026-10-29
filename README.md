# Safari Duo Free Width

**A free, open-source Safari userscript that experiments with extending pages into the area beside Safari’s side controls on iPhone Duo.**

[한국어 안내](README.ko.md) · [Script](safari-duo-free-width.user.js) · [MIT license](LICENSE)

[Download latest release](https://github.com/ymseo741/safari-duo-free-width/releases/latest) · [Raw userscript](https://raw.githubusercontent.com/ymseo741/safari-duo-free-width/main/safari-duo-free-width.user.js)

Version **0.1.7** enables all four options by default on each website. There is no permanent floating button, no paid unlock, and no build step.

## What it does

- Expands the document body beyond the usual narrow layout width on supported window sizes.
- Optionally sets an explicit viewport width instead of `device-width`.
- Can request `shrink-to-fit=no` and clip certain large fixed/sticky overlays near the right edge.
- Keeps viewport settings in place when a site changes them after loading.
- Provides an on-demand settings panel. Preferences are stored separately for each origin.

This modifies webpage layout. It does not modify Safari’s native toolbar or add controls inside browser chrome.

## Install

1. Install the **Userscripts** extension for Safari if you do not already use it: [official project](https://github.com/quoid/userscripts).
2. Open the [raw userscript](https://raw.githubusercontent.com/ymseo741/safari-duo-free-width/main/safari-duo-free-width.user.js) in Safari, then open the Userscripts extension popup to install it. Alternatively, download the raw `.user.js` file.
3. If you downloaded the file manually, put it in the directory configured in Userscripts.
4. Enable Userscripts in Safari and allow it on the websites where you want the script to run. Allow all websites if you want automatic application across websites.
5. Disable older copies of **Safari Duo Free Width**. Keep only one version enabled, then reload the page.

The script matches HTTP and HTTPS pages, but it only activates its width changes when its device and window-size checks match. Safari-internal pages are not supported. It does not run inside embedded frames.

## Open settings

Add **`#duo-controls`** to the end of the current page URL. For example:

```text
https://m.naver.com/#duo-controls
```

If the URL already has a fragment after `#`, temporarily replace that fragment. Press **닫기** (Close) to dismiss the panel. No floating button remains on the page.

| Button | Meaning |
| --- | --- |
| 전체폭 | Full width: expands the body to the detected target width. |
| 보정 | Overlay correction: clips some near-fullscreen fixed/sticky overlays at the right edge. It may not help left-side controls. |
| 자동축소 방지 | Requests `shrink-to-fit=no`. This is an experimental request to Safari, not a guaranteed zoom lock. |
| 뷰포트 너비 지정 | Explicit viewport width: sets a numeric viewport width rather than `device-width`. This was the key change in the successful Split View trial. |
| 진단 | Shows dimensions and current settings in an alert. |

All four options start **ON** in 0.1.7, including when migrating older preferences. Choices you make afterward are saved per origin. Settings do not synchronize between websites or devices. If storage is blocked, changes may only last for the current page session.

## Testing and limitations

**User-reported results:** outer-screen operation worked in earlier versions. In version 0.1.6, the user reported success with Safari on both the left and right of inner-screen Split View, with all options enabled. The test site was `m.naver.com`, on a device reported as running iOS 27.2 beta.

Version 0.1.7 changes the default preferences to all ON; it does not add a newly verified rendering method. Local DOM tests cover settings migration, viewport directives, release on wider windows, and restoring previous viewport settings. They do **not** reproduce Safari’s native painting behind its controls. Compatibility across websites and future Safari versions remains unverified.

- Full-width activation is limited by the current iPhone user-agent, portrait media-query, and viewport-size checks. It is not a universal iPad or desktop layout tool.
- A site’s fixed-width containers, fixed elements, or embedded content may still leave a gap or clip content.
- The script cannot reliably infer whether Safari is on the left or right from the recorded browser coordinates. Overlay correction currently samples only the right edge.
- Some viewport meta tags are modified while active. Pinch zoom and page sizing can still depend on Safari.
- This is an experimental workaround, not an Apple-supported Safari setting.

## Troubleshooting

If a website does not change, check that Userscripts has permission for that website and that only the latest script is enabled. Open `#duo-controls` and confirm the options are ON.

If content becomes clipped or awkward, turn off **보정**, then **뷰포트 너비 지정**, or disable **전체폭**. For a clean comparison, disable the userscript and reload. When reporting an issue, include the website URL, OS version, outer/inner screen, left/right Split View placement, and which options are enabled. Review diagnostic information before posting it publicly.

## Privacy

The script has no analytics, remote code imports, or network requests of its own. It reads page layout and stores preferences in the current origin’s `localStorage`; scripts on that origin can access that storage. Diagnostic information is displayed locally and is not automatically uploaded.

## Share and contribute

You may use, copy, modify, and redistribute this project under the [MIT license](LICENSE), retaining its copyright and license notice. Forks, compatibility reports, and pull requests are welcome. Please distinguish device-tested behavior from simulated DOM tests.

Safari, iPhone, and other product names belong to their respective owners. This project is independent and is not affiliated with Apple or Userscripts.


## References

- [Offform: Designing websites for iPhone Duo](https://www.offform.design/designing-websites-for-iphone-duo-how-we-made-our-framer-sites-go-edge-to-edge/)
- [WebKit: LocalFrameView.cpp](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/page/LocalFrameView.cpp)
- [Userscripts metadata documentation](https://github.com/quoid/userscripts#metadata)

The script was written for this project using publicly described techniques. It does not contain source code from OutSpan or Wide Web.
