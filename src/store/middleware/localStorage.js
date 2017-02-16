let localStorage = window.localStorage;

if (! window.localStorage) {
    localStorage = {
        getItem(name, def) {
            return def;
        },

        setItem(name, value) {
            return;
        }
    };
}

export default store => next => action => {
    let result = next(action);
    let state = JSON.stringify(store.getState());

    localStorage.setItem('state', state);

    return result;
}