import { listenToPageUpdates } from './listen-to-page-updates.function';
import { hidePromoted } from './hide-promoted.function';
import { debounce } from './debounce.function';

void (function main() {
    const mainContainer = document.getElementById('main');
    if (!mainContainer) {
        throw 'No main element found!';
    }
    hidePromoted();

    const debounceTimeMs = 500;
    const debouncedHidePromoted = debounce(hidePromoted, debounceTimeMs);

    listenToPageUpdates(mainContainer, debouncedHidePromoted);
})();
