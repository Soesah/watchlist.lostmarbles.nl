package handlers

import (
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api/watchlist"
	"github.com/Soesah/watchlist.lostmarbles.nl/server/httpext"
)

// GetList gets the whole watchlist
func GetList(w http.ResponseWriter, r *http.Request) {
	list, err := watchlist.GetWatchList(r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpext.JSON(w, list)
}

// AddMovie is used to add a movie
func AddMovie(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Movie added succesfully")
}

// AddSeries is used to add a series
func AddSeries(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Series added succesfully")
}

// AddDocumentary is used to add a documentary
func AddDocumentary(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Documentary added succesfully")
}

// AddGame is used to add a game
func AddGame(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Game added succesfully")
}

// AddFranchise is used to add a franchise
func AddFranchise(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Franchise added succesfully")
}

// UpdateMovie is used to updated a movie
func UpdateMovie(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Movie update succesfully")
}

// UpdateSeries is used to updated a series
func UpdateSeries(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Series update succesfully")
}

// UpdateDocumentary is used to updated a documentary
func UpdateDocumentary(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Documentary update succesfully")
}

// UpdateGame is used to updated a game
func UpdateGame(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Game update succesfully")
}

// UpdateFranchise is used to updated a franchise
func UpdateFranchise(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Franchise update succesfully")
}

// DeleteMovie is used to delete a movie
func DeleteMovie(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Movie deleted succesfully")
}

// DeleteSeries is used to delete a series
func DeleteSeries(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Series deleted succesfully")
}

// DeleteDocumentary is used to delete a documentary
func DeleteDocumentary(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Documentary deleted succesfully")
}

// DeleteGame is used to delete a game
func DeleteGame(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Game deleted succesfully")
}

// DeleteFranchise is used to delete a franchise
func DeleteFranchise(w http.ResponseWriter, r *http.Request) {

	httpext.SuccessAPI(w, "Franchise deleted succesfully")
}
