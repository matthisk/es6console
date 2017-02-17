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

function _load() {
    let state = false;

    if (window.localStorage) {
        state = localStorage.getItem('state', 'false');
        
        try {
            state = JSON.parse(state);
        } catch (e) {
            console.error('Unable to parse persisted state', e);
        }
    }

    return state;
}

export function loadPersistedState(...keys) {
    let state = _load();

    for (let key of keys) {
        if (state !== undefined) state = state[key];
        else return;
    }

    return state;
}