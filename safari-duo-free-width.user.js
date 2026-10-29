// ==UserScript==
// @name         Safari Duo Free Width
// @description  iPhone Duo 전체폭 및 자동 축소 방지 실험 스크립트
// @version      0.1.7
// @license      MIT
// @namespace    https://github.com/ymseo741/safari-duo-free-width
// @homepageURL  https://github.com/ymseo741/safari-duo-free-width
// @supportURL   https://github.com/ymseo741/safari-duo-free-width/issues
// @downloadURL  https://raw.githubusercontent.com/ymseo741/safari-duo-free-width/main/safari-duo-free-width.user.js
// @updateURL    https://raw.githubusercontent.com/ymseo741/safari-duo-free-width/main/safari-duo-free-width.user.js
// @match        *://*/*
// @run-at       document-start
// @inject-into  content
// @grant        none
// @noframes
// ==/UserScript==

(() => {
    'use strict';
    if (window.top !== window.self) return;
    const STYLE_ID = 'duo-free-width-style';
    const PANEL_ID = 'duo-free-width-panel';
    if (document.getElementById(STYLE_ID)) return;

    // 알려진 Duo 외측 세로 화면의 CSS 너비. 화면 정보가 제한된 경우에만 사용.
    const DUO_OUTER_WIDTH = 466;
    const SETTINGS_KEY = 'safari-duo-free-width-settings';
    const originalMetas = new Map();
    const clipped = new Map();
    let enabled = true;
    let overlayFix = true;
    let shrinkFix = true;
    let explicitWidth = true;
    try {
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
        // 이번 버전 첫 실행에는 이전 OFF 설정도 모두 ON으로 전환.
        // 이후 사용자가 직접 바꾼 설정은 사이트별로 유지.
        if (saved?.defaultsVersion === 1) {
            if (typeof saved.enabled === 'boolean') enabled = saved.enabled;
            if (typeof saved.overlayFix === 'boolean') overlayFix = saved.overlayFix;
            if (typeof saved.shrinkFix === 'boolean') shrinkFix = saved.shrinkFix;
            if (typeof saved.explicitWidth === 'boolean') explicitWidth = saved.explicitWidth;
        }
        saveSettings();
    } catch (_) { /* 저장이 차단되어도 현재 페이지에서는 계속 작동 */ }
    let active = false;
    let timer = null;
    let style = null;
    let panel = null;
    let toggle = null;
    let overlayToggle = null;
    let shrinkToggle = null;
    let widthToggle = null;
    let controlsOpen = location.hash === '#duo-controls';
    let activationScreenWidth = null;
    let activationTargetWidth = null;
    let info = {};

    function saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify({ defaultsVersion: 1, enabled, overlayFix, shrinkFix, explicitWidth }));
        } catch (_) { /* 저장이 차단된 경우 새 페이지에서는 기본값 사용 */ }
    }

    function schedule() {
        if (timer !== null || document.hidden) return;
        timer = setTimeout(() => {
            timer = null;
            update();
        }, 100);
    }

    function repairViewport() {
        let metas = [...document.querySelectorAll('meta[name="viewport" i]')];
        if (!metas.length) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            originalMetas.set(meta, { original: null, last: null, created: true });
            document.head.append(meta);
            metas = [meta];
        }
        for (const meta of metas) {
            const current = meta.getAttribute('content');
            let saved = originalMetas.get(meta);
            if (!saved) {
                saved = { original: current, last: null, created: false };
                originalMetas.set(meta, saved);
            } else if (saved.last !== null && current !== saved.last) {
                saved.original = current;
                saved.created = false;
            }
            const rest = (current || '').split(/[,;]/).map(s => s.trim())
                .filter(s => s && !/^(width|initial-scale)\s*=/i.test(s) &&
                    !(shrinkFix && /^shrink-to-fit\s*=/i.test(s)));
            if (shrinkFix) rest.push('shrink-to-fit=no');
            const width = explicitWidth ? activationTargetWidth : 'device-width';
            const next = [`width=${width}`, 'initial-scale=1', ...rest].join(', ');
            saved.last = next;
            if (current !== next) meta.setAttribute('content', next);
        }
    }

    function restoreViewport() {
        for (const [meta, saved] of originalMetas) {
            if (!meta.isConnected || meta.getAttribute('content') !== saved.last) continue;
            if (saved.created) meta.remove();
            else if (saved.original === null) meta.removeAttribute('content');
            else meta.setAttribute('content', saved.original);
        }
        originalMetas.clear();
    }

    function restoreClips() {
        for (const [element, saved] of clipped) {
            if (element.style.getPropertyValue('clip-path') !== saved.applied) continue;
            if (saved.value) element.style.setProperty('clip-path', saved.value, saved.priority);
            else element.style.removeProperty('clip-path');
        }
        clipped.clear();
    }

    function clipOverlay(viewportWidth) {
        // WebKit이 우측 가장자리에서 샘플링할 수 있는 화면 크기 고정 요소만 처리.
        let element = document.elementFromPoint(
            Math.max(1, viewportWidth - 4), Math.max(1, innerHeight / 2)
        );
        while (element && element !== document.body && element !== document.documentElement) {
            if (element === panel) break;
            const computed = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            if (/^(fixed|sticky)$/.test(computed.position) &&
                rect.width >= viewportWidth * 0.9 && rect.height >= innerHeight * 0.85 &&
                rect.right >= viewportWidth - 4 && !clipped.has(element) &&
                computed.clipPath === 'none') {
                const value = element.style.getPropertyValue('clip-path');
                const priority = element.style.getPropertyPriority('clip-path');
                const applied = `inset(0px ${Math.max(6, rect.right - viewportWidth + 6)}px 0px 0px)`;
                element.style.setProperty('clip-path', applied, 'important');
                clipped.set(element, {
                    value, priority, applied: element.style.getPropertyValue('clip-path')
                });
            }
            element = element.parentElement;
        }
    }

    function mountPanel() {
        if (panel?.isConnected) return;
        panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style.cssText = 'position:fixed!important;left:8px!important;bottom:48px!important;' +
            'width:168px!important;height:auto!important;max-width:calc(100vw - 16px)!important;' +
            'z-index:2147483647!important;';
        const shadow = panel.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<style>
            :host { font:12px -apple-system,sans-serif;--bg:rgba(255,255,255,.94);--ink:#17212b; }
            button { font:inherit;border:1px solid rgba(120,130,140,.3);border-radius:9px;
                padding:9px;background:var(--bg);color:var(--ink);touch-action:manipulation; }
            #controls { display:flex;flex-direction:column;gap:6px;padding:8px;border-radius:14px;
                background:var(--bg);color:var(--ink);box-shadow:0 4px 22px #0003; }
            @media(prefers-color-scheme:dark) { :host { --bg:rgba(35,39,44,.94);--ink:#f5f7fa; } }
        </style><div id="controls"><button id="toggle" type="button"></button>
        <button id="overlay" type="button"></button>
        <button id="shrink" type="button"></button>
        <button id="widthMode" type="button"></button><button id="info" type="button">진단</button>
        <button id="close" type="button">닫기</button></div>`;
        shadow.getElementById('close').addEventListener('click', () => {
            controlsOpen = false;
            if (location.hash === '#duo-controls') {
                try { history.replaceState(history.state, '', location.pathname + location.search); }
                catch (_) { /* 주소를 바꾸지 못해도 패널은 닫음 */ }
            }
            update();
        });
        toggle = shadow.getElementById('toggle');
        toggle.addEventListener('click', () => {
            enabled = !enabled;
            saveSettings();
            update();
        });
        overlayToggle = shadow.getElementById('overlay');
        overlayToggle.addEventListener('click', () => {
            overlayFix = !overlayFix;
            saveSettings();
            update();
        });
        shrinkToggle = shadow.getElementById('shrink');
        shrinkToggle.addEventListener('click', () => {
            shrinkFix = !shrinkFix;
            restoreViewport();
            saveSettings();
            update();
        });
        widthToggle = shadow.getElementById('widthMode');
        widthToggle.addEventListener('click', () => {
            explicitWidth = !explicitWidth;
            restoreViewport();
            saveSettings();
            update();
        });
        shadow.getElementById('info').addEventListener('click', () => {
            const meta = [...document.querySelectorAll('meta[name="viewport" i]')]
                .map(m => m.content).join('\n');
            alert('Safari Duo Free Width 0.1.7\n' +
                JSON.stringify({ ...info, active, shrinkFix, explicitWidth,
                    scale: window.visualViewport?.scale,
                    visualWidth: window.visualViewport?.width,
                    bodyWidth: Math.round(document.body.getBoundingClientRect().width),
                    scrollWidth: document.documentElement.scrollWidth,
                    clippedOverlays: clipped.size }, null, 2) + '\nviewport: ' + meta);
        });
        document.body.append(panel);
    }

    function applyState() {
        const html = document.documentElement;
        if (!html || !document.head || !document.body) return;
        const viewportWidth = html.clientWidth;
        const reportedWidth = screen.width;
        const reportedGap = reportedWidth - viewportWidth;
        const portrait = matchMedia('(orientation: portrait)').matches;
        const iphone = /iPhone/.test(navigator.userAgent);
        // 382px 주변의 알려진 외측 뷰포트에서만 수동 너비 보정을 허용.
        const fallback = viewportWidth >= 378 && viewportWidth <= 386 &&
            Math.abs(reportedGap) < 4;
        const detected = (reportedGap >= 40 && reportedGap <= 200 && viewportWidth <= 420) || fallback;
        // 활성화 후 메타 변경으로 뷰포트가 일시적으로 달라져도 켜짐/꺼짐이 반복되지 않도록 유지.
        // 내부 세로 화면으로 넓어졌다면 화면 정보가 제한되어 있어도 유지하지 않음.
        const held = active && viewportWidth <= (explicitWidth ? activationTargetWidth : 420) &&
            reportedWidth === activationScreenWidth;
        const eligible = iphone && portrait && (detected || held);
        const targetWidth = held ? activationTargetWidth : fallback ? DUO_OUTER_WIDTH : reportedWidth;
        const zoomed = Math.abs((window.visualViewport?.scale ?? 1) - 1) > 0.02;
        info = { viewportWidth, reportedWidth, targetWidth, fallback, eligible, zoomed };

        if (!style?.isConnected) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.append(style);
        }
        active = eligible && enabled;
        if (!active) {
            if (style.textContent) style.textContent = '';
            restoreClips();
            restoreViewport();
        } else {
            activationScreenWidth = reportedWidth;
            activationTargetWidth = targetWidth;
            repairViewport();
            const css = `
                html { overflow-x:hidden!important; }
                html, body { touch-action:${zoomed ? 'auto' : 'pan-y pinch-zoom'}!important; }
                body { box-sizing:border-box!important;width:${targetWidth}px!important;
                    min-width:${targetWidth}px!important;max-width:none!important;
                    margin-left:0!important;margin-right:0!important;overflow-x:visible!important; }
            `;
            if (style.textContent !== css) style.textContent = css;
            restoreClips();
            if (!zoomed && overlayFix) clipOverlay(viewportWidth);
        }
        // 평소에는 패널 DOM도 만들지 않음. 명시적인 설정 주소에서만 표시.
        if (controlsOpen) {
            mountPanel();
            const label = active ? '전체폭 ON' : '전체폭 OFF';
            if (toggle.textContent !== label) toggle.textContent = label;
            const widthLabel = explicitWidth ? '뷰포트 너비 지정 ON (실험)' : '뷰포트 너비 지정 OFF';
            if (widthToggle.textContent !== widthLabel) widthToggle.textContent = widthLabel;
            const shrinkLabel = shrinkFix ? '자동축소 방지 ON (실험)' : '자동축소 방지 OFF';
            if (shrinkToggle.textContent !== shrinkLabel) shrinkToggle.textContent = shrinkLabel;
            const overlayLabel = overlayFix ? '보정 ON' : '보정 OFF';
            if (overlayToggle.textContent !== overlayLabel) overlayToggle.textContent = overlayLabel;
        } else if (panel) {
            panel.remove();
            panel = null;
            toggle = null;
            overlayToggle = null;
            shrinkToggle = null;
            widthToggle = null;
        }
    }

    function update() {
        observer.disconnect();
        try { applyState(); }
        finally { observer.observe(document, observerOptions); }
    }

    const observerOptions = {
        childList: true, subtree: true, attributes: true,
        attributeFilter: ['content', 'name', 'class', 'style']
    };
    const observer = new MutationObserver(records => {
        if (records.some(r => r.target !== style && r.target !== panel &&
            !panel?.contains(r.target))) schedule();
    });
    observer.observe(document, observerOptions);
    for (const event of ['DOMContentLoaded', 'visibilitychange']) {
        document.addEventListener(event, schedule);
    }
    for (const event of ['load', 'pageshow', 'resize', 'orientationchange', 'scroll']) {
        window.addEventListener(event, schedule, { passive: true });
    }
    window.addEventListener('hashchange', () => {
        controlsOpen = location.hash === '#duo-controls';
        schedule();
    });
    window.visualViewport?.addEventListener('resize', schedule, { passive: true });
    update();
})();
