import { listenToPageUpdates } from './listen-to-page-updates.function';
import { hidePromoted } from './hide-promoted.function';
import { debounce } from './debounce.function';

async function waitForMain(timeoutMs = 5000): Promise<HTMLElement> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const main = (document.querySelector<HTMLElement>('main') || document.getElementById('main')) as HTMLElement | null;
        if (main) return main;

        // If document is already interactive/complete, fall back to body
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            if (document.body) return document.body as HTMLElement;
        }

        await new Promise((res) => setTimeout(res, 100));
    }

    // final fallback to body
    return document.body as HTMLElement;
}

void (async function main() {
    const mainContainer = await waitForMain();

    // run once immediately to hide any existing promoted posts
    try {
        hidePromoted();
    } catch (err) {
        // don't break the whole script if hiding fails
        // eslint-disable-next-line no-console
        console.error('hidePromoted error:', err);
    }

    const debounceTimeMs = 500;
    const debouncedHidePromoted = debounce(hidePromoted, debounceTimeMs);

    listenToPageUpdates(mainContainer, debouncedHidePromoted);
})();
