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

const postAncestorSelectors = [
    'article',
    'div[role="article"]',
    '*[role="listitem"]',
    'div.feed-shared-update',
    'div.feed-shared-update-v2',
    'div.occludable-update',
    'div.feed-shared-actor',
    'div.feed-shared-commentary',
    'div.comments-comment-item',
    'div.comments-comments-list__comment-item',
    'div.comments-comment-card',
    '[data-comment-id]',
    '[data-test-comment-item]',
    'div[data-id]',
    'div[data-urn]',
    'div[data-entity-urn]',
    'div[data-feed-item-id]',
    '[data-test-feed-item]',
] as const;

const containerSelectors = [
    'article',
    'div[role="article"]',
    '*[role="listitem"]',
    'div[data-feed-item-id]',
    '[data-test-feed-item]',
    'div.feed-shared-update',
    'div.feed-shared-update-v2',
    'div.occludable-update',
] as const;

function findPostAncestor(el: Element): Element | null {
    for (const selector of postAncestorSelectors) {
        const ancestor = el.closest(selector);
        if (ancestor) return ancestor;
    }
    return null;
}

function hideMatchingContainers(regex: RegExp): void {
    const candidates = Array.from(document.querySelectorAll(containerSelectors.join(',')));
    for (const container of candidates) {
        if (!container.textContent) continue;
        if (regex.test(container.textContent)) {
            hideElement(container);
        }
    }
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function hidePromoted(options: { hidePromoted: boolean; hideSuggested: boolean; hideCustom: boolean; customKeywords: string } = { hidePromoted: true, hideSuggested: true, hideCustom: false, customKeywords: '' }): void {
    const terms: string[] = [];
    if (options.hidePromoted) terms.push('promoted');
    if (options.hideSuggested) terms.push('suggested');

    if (options.hideCustom && options.customKeywords) {
        const customTerms = options.customKeywords
            .split(',')
            .map((term) => term.trim())
            .filter(Boolean);
        terms.push(...customTerms);
    }

    if (terms.length === 0) return; // Nothing to hide

    const xpathConditions = terms
        .map((term) => {
            const lowered = term.toLowerCase();
            return `contains(translate(., '${term.toUpperCase()}', '${lowered}'), '${lowered}')`;
        })
        .join(' or ');
    const xpath = `//text()[${xpathConditions}]`;
    const iterator = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    const regex = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'i');
    const visited = new WeakSet<Element>();

    for (let i = 0; i < iterator.snapshotLength; i++) {
        const node = iterator.snapshotItem(i);
        if (!node || !node.parentElement) continue;

        const ancestor = findPostAncestor(node.parentElement);
        if (ancestor) hideElement(ancestor);
    }

    const contentSelectors = ['span', 'button', 'div', 'p', 'strong', 'b', 'a'];
    const promotes = Array.from(document.querySelectorAll(contentSelectors.join(','))).filter(
        (el) => el.textContent && regex.test(el.textContent)
    );

    promotes.forEach((el) => {
        if (visited.has(el)) return;
        visited.add(el);

        const ancestor = findPostAncestor(el);
        if (ancestor) hideElement(ancestor);
    });

    hideMatchingContainers(regex);
}
