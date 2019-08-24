$(document).ready(initPage)

function initPage() {
  $('#search-form').on('submit',submitForm)

  window.addEventListener('scroll',infiniteScrollCheck,{passive: true})

  document.querySelector('#movies-container').addEventListener('error',moviesErrorCatch)
}
