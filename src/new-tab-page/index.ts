import '../app.css'

import App from '../components/App.svelte'

const target = document.getElementById('app')!
document.addEventListener('DOMContentLoaded', () => {
  new App({ target, props: {} })
})
