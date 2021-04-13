export function debounce(fn: () => void, milliseconds: number): () => void {
    let timeout: number;

    return () => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(fn, milliseconds);
    };
}
