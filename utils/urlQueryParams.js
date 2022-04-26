export function insertUrlParam(key, value) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    return window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
    
}

export function getUrlParam(key) {
    let searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key)
}

// to remove the specific key
export function removeUrlParameter(paramKey) {
    const url = window.location.href
    console.log("url", url)
    var r = new URL(url)
    r.searchParams.delete(paramKey)
    const newUrl = r.href
    console.log("r.href", newUrl)
    window.history.pushState({ path: newUrl }, '', newUrl)
}

export const removeQueryParamsFromRouter = (router, removeList = []) => {
    if (removeList.length > 0) {
        removeList.forEach((param) => delete router.query[param]);
    } else {
        // Remove all
        Object.keys(object).forEach((param) => delete object[param]);
    }
    router.replace(
        {
            pathname: router.pathname,
            query: router.query
        },
        undefined,
        /**
         * Do not refresh the page
         */
        { shallow: true }
    );
};