const hiddenSet = new WeakSet<Element>();

function hideElement(el: Element) {
    if (hiddenSet.has(el)) return;
    try {
        (el as HTMLElement).style.setProperty('display', 'none', 'important');
    } catch (e) {
        (el as HTMLElement).style.display = 'none';
    }
    hiddenSet.add(el);
}

export function hidePromoted(): void {
    // Look for text nodes containing the word 'promoted' (case-insensitive)
    const xpath = "//text()[contains(translate(., 'PROMOTED', 'promoted'), 'promoted')]";
    const iterator = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < iterator.snapshotLength; i++) {
        const node = iterator.snapshotItem(i);
        if (!node || !node.parentElement) continue;

        // Find closest article/post-like ancestor to hide the whole post
        const postAncestor = node.parentElement.closest('article, div.feed-shared-update, div.feed-shared-actor') || node.parentElement.closest('div[data-id]') || node.parentElement;
        hideElement(postAncestor);
    }

    // As a fallback, also look for elements that have exact text 'Promoted' in spans/buttons
    const promotes = Array.from(document.querySelectorAll('span, button')).filter((el) => el.textContent && /promoted/i.test(el.textContent));
    promotes.forEach((el) => {
        const ancestor = el.closest('article, div.feed-shared-update, div.feed-shared-actor') || el.closest('div[data-id]') || el;
        hideElement(ancestor);
    });
}
