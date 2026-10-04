import { listenToPageUpdates } from './listen-to-page-updates.function';
import { hidePromoted } from './hide-promoted.function';
import { debounce } from './debounce.function';

async function waitForMain(timeoutMs = 5000): Promise<HTMLElement> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const main = document.querySelector<HTMLElement>('main, [role="main"], [data-testid="mainFeed"], #main');
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

async function getOptions(): Promise<{ hidePromoted: boolean; hideSuggested: boolean; hideCustom: boolean; customKeywords: string }> {
    return new Promise((resolve) => {
        chrome.storage.sync.get({
            hidePromoted: true,  // default to true
            hideSuggested: true, // default to true
            hideCustom: false,
            customKeywords: ''
        }, (items: { hidePromoted: boolean; hideSuggested: boolean; hideCustom: boolean; customKeywords: string }) => {
            resolve({
                hidePromoted: items.hidePromoted,
                hideSuggested: items.hideSuggested,
                hideCustom: items.hideCustom,
                customKeywords: items.customKeywords
            });
        });
    });
}

void (async function main() {
    const mainContainer = await waitForMain();
    const observerTarget = document.body || mainContainer;
    let options = await getOptions();

    // run once immediately to hide any existing promoted posts
    try {
        hidePromoted(options);
    } catch (err) {
        // don't break the whole script if hiding fails
        // eslint-disable-next-line no-console
        console.error('hidePromoted error:', err);
    }

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'sync') return;

        const relevantKeys = ['hidePromoted', 'hideSuggested', 'hideCustom', 'customKeywords'];
        const hasRelevantChange = relevantKeys.some((key) => key in changes);
        if (!hasRelevantChange) return;

        options = {
            hidePromoted: typeof changes.hidePromoted?.newValue === 'boolean' ? changes.hidePromoted.newValue : options.hidePromoted,
            hideSuggested: typeof changes.hideSuggested?.newValue === 'boolean' ? changes.hideSuggested.newValue : options.hideSuggested,
            hideCustom: typeof changes.hideCustom?.newValue === 'boolean' ? changes.hideCustom.newValue : options.hideCustom,
            customKeywords: typeof changes.customKeywords?.newValue === 'string' ? changes.customKeywords.newValue : options.customKeywords,
        };

        try {
            hidePromoted(options);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('hidePromoted error after storage change:', err);
        }
    });

    const debounceTimeMs = 500;
    const debouncedHidePromoted = debounce(() => hidePromoted(options), debounceTimeMs);

    listenToPageUpdates(observerTarget, debouncedHidePromoted);
})();
