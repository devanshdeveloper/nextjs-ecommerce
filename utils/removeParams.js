export function removeParams(url) {
    const urlObj = new URL(url);
    urlObj.search = '';
    return urlObj.toString();
}
