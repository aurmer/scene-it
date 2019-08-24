$(document).ready(initPage)

const myMovieJSON = JSON.parse(localStorage.getItem('watchlist'))
let myMovieList = []

if(Array.isArray(myMovieJSON)) {
  myMovieList = myMovieJSON
}

function initPage() {
  renderMovies(myMovieList)
}
