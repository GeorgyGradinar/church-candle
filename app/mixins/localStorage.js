export default function storage() {

    function setLocalStorage(KEY, value) {
        localStorage.setItem(KEY, JSON.stringify(value));
    }

    function getLocalStorage(KEY) {
        let saved = process.client && localStorage.getItem(KEY);
        return saved ? JSON.parse(saved) : '';
    }

    function removeLocalStorage(KEY) {
        if (process.client) {
            localStorage.removeItem(KEY);
        }
    }

    return {setLocalStorage, getLocalStorage, removeLocalStorage}
}
