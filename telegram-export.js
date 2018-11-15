function getContacts() {
  const AppUsersManager = angular
    .element(document.querySelector('html'))
    .injector()
    .get('AppUsersManager');

  return AppUsersManager.getContacts().then(ids => ids.map(id => AppUsersManager.getUser(id)));
}

function saveContacts() {
  getContacts().then(contacts => {
    saveJSON(contacts, 'contacts.json');
  });
}

function showContacts() {
  getContacts().then(contacts => {
    contacts.forEach(contact => {
      console.log(`[${contact.id}] ${contact.first_name} ${contact.last_name}`);
    });
  });
}

function saveChat(userId) {
  const LIMIT = 100000;

  var AppMessagesManager = angular
    .element(document.querySelector('html'))
    .injector()
    .get('AppMessagesManager');

  AppMessagesManager.getHistory(userId, 0, LIMIT)
    .then(res => res.history.map(id => AppMessagesManager.wrapForHistory(id)))
    .then(json => saveJSON(json, `${userId}.json`));
}

function saveJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, undefined, 4)], { type: 'text/json' });
  const e = document.createEvent('MouseEvents');
  const a = document.createElement('a');

  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
  e.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  a.dispatchEvent(e);
}