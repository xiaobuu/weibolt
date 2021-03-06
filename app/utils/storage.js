/*

  Only happen on background reducers

*/

let handler;

function saveState(state) {
  clearTimeout(handler);
  handler = setTimeout(() => {
    chrome.storage.local.set({ state: JSON.stringify(state) });
  }, 300);
}

// todos unmarked count
function setBadge(todos) {
  if (chrome.browserAction) {
    if (!Array.isArray(todos)) return;
    const count = todos.filter((todo) => !todo.marked).length;
    chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
  }
}

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    store.subscribe(() => {
      const state = store.getState();
      saveState(state);
      // setBadge(state.todos);
    });
    return store;
  };
}
