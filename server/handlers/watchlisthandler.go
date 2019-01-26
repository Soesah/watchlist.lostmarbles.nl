package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/watchlist"
	"github.com/Soesah/watchlist.lostmarbles.nl/server/httpext"
	"github.com/go-chi/chi"
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

// ToggleItemWatched toggles an item's watched property
func ToggleItemWatched(w http.ResponseWriter, r *http.Request) {
	itemType := chi.URLParam(r, "type")
	imdbID := chi.URLParam(r, "imdbID")

	item, err := watchlist.ToggleItemWatched(itemType, imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpext.JSON(w, item)
}

// AddMovie is used to add a movie
func AddMovie(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var data models.Movie
	err := decoder.Decode(&data)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusBadRequest)
		return
	}

	movie, err := watchlist.AddMovie(data, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpext.SuccessDataAPI(w, "Movie added succesfully", movie)
}

// AddSeries is used to add a series
func AddSeries(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var data models.Series
	err := decoder.Decode(&data)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusBadRequest)
		return
	}

	series, err := watchlist.AddSeries(data, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpext.SuccessDataAPI(w, "Series added succesfully", series)
}

// AddDocumentary is used to add a documentary
func AddDocumentary(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var data models.Documentary
	err := decoder.Decode(&data)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusBadRequest)
		return
	}

	documentary, err := watchlist.AddDocumentary(data, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpext.SuccessDataAPI(w, "Documentary added succesfully", documentary)
}

// AddGame is used to add a game
func AddGame(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var data models.Game
	err := decoder.Decode(&data)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusBadRequest)
		return
	}

	game, err := watchlist.AddGame(data, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpext.SuccessDataAPI(w, "Game added succesfully", game)
}

// AddFranchise is used to add a franchise
func AddFranchise(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var data models.Franchise
	err := decoder.Decode(&data)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusBadRequest)
		return
	}

	franchise, err := watchlist.AddFranchise(data, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpext.SuccessDataAPI(w, "Franchise added succesfully", franchise)
}

// GetMovie returns the Movie
func GetMovie(w http.ResponseWriter, r *http.Request) {
	imdbID := chi.URLParam(r, "imdbID")
	movie, err := watchlist.GetMovie(imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusNotFound)
		return
	}

	httpext.SuccessDataAPI(w, "Movie found", movie)
}

// GetSeries returns the Series
func GetSeries(w http.ResponseWriter, r *http.Request) {
	imdbID := chi.URLParam(r, "imdbID")
	series, err := watchlist.GetSeries(imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusNotFound)
		return
	}

	httpext.SuccessDataAPI(w, "Series found", series)
}

// GetDocumentary returns the Documentary
func GetDocumentary(w http.ResponseWriter, r *http.Request) {
	imdbID := chi.URLParam(r, "imdbID")
	documentary, err := watchlist.GetDocumentary(imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusNotFound)
		return
	}

	httpext.SuccessDataAPI(w, "Documentary found", documentary)
}

// GetGame returns the Game
func GetGame(w http.ResponseWriter, r *http.Request) {
	imdbID := chi.URLParam(r, "imdbID")
	game, err := watchlist.GetGame(imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusNotFound)
		return
	}

	httpext.SuccessDataAPI(w, "Game found", game)
}

// GetFranchise returns the Franchise
func GetFranchise(w http.ResponseWriter, r *http.Request) {
	imdbID := chi.URLParam(r, "imdbID")
	franchise, err := watchlist.GetFranchise(imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusNotFound)
		return
	}

	httpext.SuccessDataAPI(w, "Franchise found", franchise)
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
	imdbID := chi.URLParam(r, "imdbID")

	err := watchlist.DeleteMovie(imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, "Deleting Movie failed", 500)
	}

	httpext.SuccessAPI(w, "Movie deleted succesfully")
}

// DeleteSeries is used to delete a series
func DeleteSeries(w http.ResponseWriter, r *http.Request) {
	imdbID := chi.URLParam(r, "imdbID")

	err := watchlist.DeleteSeries(imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, "Deleting Series failed", 500)
	}

	httpext.SuccessAPI(w, "Series deleted succesfully")
}

// DeleteDocumentary is used to delete a documentary
func DeleteDocumentary(w http.ResponseWriter, r *http.Request) {
	imdbID := chi.URLParam(r, "imdbID")

	err := watchlist.DeleteDocumentary(imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, "Deleting Documentary failed", 500)
	}

	httpext.SuccessAPI(w, "Documentary deleted succesfully")
}

// DeleteGame is used to delete a game
func DeleteGame(w http.ResponseWriter, r *http.Request) {
	imdbID := chi.URLParam(r, "imdbID")

	err := watchlist.DeleteGame(imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, "Deleting Game failed", 500)
	}

	httpext.SuccessAPI(w, "Game deleted succesfully")
}

// DeleteFranchise is used to delete a franchise
func DeleteFranchise(w http.ResponseWriter, r *http.Request) {
	imdbID := chi.URLParam(r, "imdbID")

	err := watchlist.DeleteFranchise(imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, "Deleting Franchise failed", 500)
	}

	httpext.SuccessAPI(w, "Franchise deleted succesfully")
}
