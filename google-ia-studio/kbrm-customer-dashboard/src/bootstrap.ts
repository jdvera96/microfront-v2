import { mount } from './mount';

export { mount, unmount } from './mount';

// Standalone mode:
// - En desarrollo/preview del Remote, el selector existe en el DOM (index.html)
// - Dentro del Shell, el selector NO existe y el Shell llamará mount(host)
const standaloneEl = document.querySelector('app-kbrm-customer-dashboard-mfe');
if (standaloneEl) {
  mount(standaloneEl.parentElement ?? document.body).catch(console.error);
}


