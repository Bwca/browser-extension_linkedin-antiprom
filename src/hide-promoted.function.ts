const promotedPostsSet = new WeakSet();

export function hidePromoted(): void {
    const promotedPosts = document.evaluate(
        "//div[div/div/div/div/a/div/span[contains(., 'Promoted')]]",
        document
    );

    let item: Node | null;
    while ((item = promotedPosts.iterateNext())) {
        if (promotedPostsSet.has(item)) {
            continue;
        }
        (item as HTMLElement).style.display = 'none';
        promotedPostsSet.add(item);
    }
}
