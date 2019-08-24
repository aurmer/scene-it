let moviesRequestPending = false
let moviePage = 1

function submitForm(evt) {
  evt.preventDefault()

  const searchString = $('.search-bar').val()
  const urlEncodedSearchString = encodeURIComponent(searchString)
  const searchURL = "http://www.omdbapi.com/?apikey=3430a78&s=" + urlEncodedSearchString

  axios.get(searchURL)
    .then(function(response) {
      renderMovies(response.data.Search)
    })
}

function renderMovies(moviesList,appendFlag){
  const moviesHTML = moviesList.map(renderMovieCard)
  if(appendFlag) {
    $('#movies-container').append(moviesHTML.join(''))
  } else {
    $('#movies-container').html(moviesHTML.join(''))
  }
}

function renderMovieCard(movie) {
  let footer = ""
  const currentPage = document.title

  if(currentPage === "Scene It") {
    footer = `    <div class="card-footer">
        <a href="#" class="btn btn-primary" onclick="saveToWatchlist('${movie.imdbID}')">Add!</a>
      </div>`
  } else if (currentPage === "Scene It - Watchlist") {
    footer = `    <div class="card-footer">
        <a href="#" class="btn btn-primary" >Watch Now</a>
      </div>`
  }

  return `<div class="card movie">
    <img class="card-img-top" src="${movie.Poster}" alt="${movie.Title}">
    <div class="card-body">
      <h5 class="card-title">${movie.Title}</h5>
      <p class="card-text">${movie.Year}</p>
    </div>
    ${footer}
  </div>`
}

function saveToWatchlist(movieID) {
  const movie = movieData.find(getMovieByID.bind(null,movieID))

  let watchlist = []
  let watchlistJSON = localStorage.getItem('watchlist')

  try {
    watchlist = JSON.parse(watchlistJSON)
  }
  catch (error) {
    console.warn(error)
  }

  if(!Array.isArray(watchlist)) {
    watchlist = []
  }

  const findFn = getMovieByID.bind(null, movieID)
  const isMovieInList = watchlist.find(findFn)
  if( !isMovieInList ) {
    watchlist.push(movie)
    watchlistJSON = JSON.stringify(watchlist)
    localStorage.setItem('watchlist',watchlistJSON)
  }
}

function getMovieByID(movieID,element) {
  return element.imdbID === movieID
}

function infiniteScrollCheck() {
  const myScrollY = document.documentElement.scrollTop
  const viewportHeight = window.innerHeight
  const documentHeight = document.body.clientHeight

  if(!moviesRequestPending && myScrollY > documentHeight - viewportHeight - 600) { //600 magic number triggers this call 600 pixels before the user reaches the bottom of the document
    loadNextMovies()
    moviesRequestPending = true
  }
}

function loadNextMovies() {
  moviePage++

  const searchString = $('.search-bar').val()
  const urlEncodedSearchString = encodeURIComponent(searchString)
  const searchURL = "http://www.omdbapi.com/?apikey=3430a78&s=" + urlEncodedSearchString + "&page=" + moviePage
  // console.log(searchURL)

  axios.get(searchURL)
    .then(function(response) {
      // let mygo = response.data
      // console.dir(response.data)
      renderMovies(response.data.Search,true)
      moviesRequestPending = false
    })
}
//TODO: figure out error bubble for the missing url
function moviesErrorCatch(error) {
  moviePosterErrorCatch(error)
}

function moviePosterErrorCatch(error) {
  console.warn(error)
}
