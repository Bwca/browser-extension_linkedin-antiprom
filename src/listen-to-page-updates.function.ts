export function listenToPageUpdates(
    targetNode: HTMLElement,
    mutationCallback: () => void
): void {
    const config: MutationObserverInit = {
        attributes: false,
        childList: true,
        subtree: true,
    };

    const callback: MutationCallback = (mutationsList) =>
        mutationsList.forEach((mutation) => {
            const hasTasksListUpdated =
                mutation.type === 'childList' && mutation.addedNodes.length;
            if (hasTasksListUpdated) {
                mutationCallback();
            }
        });

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
}
