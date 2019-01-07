package watchlist

import (
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
)

// GetWatchList returns the whole watch list
func GetWatchList(r *http.Request) ([]interface{}, error) {
	var list []interface{}

	return list, nil
}

// AddMovie adds a movie
func AddMovie(movie models.Movie, r *http.Request) error {

	return nil
}

// AddSeries adds a series
func AddSeries(series models.Series, r *http.Request) error {

	return nil
}

// AddDocumentary adds a documentary
func AddDocumentary(documentary models.Documentary, r *http.Request) error {

	return nil
}

// AddGame adds a game
func AddGame(game models.Game, r *http.Request) error {

	return nil
}

// AddFranchise adds a franchise
func AddFranchise(franchise models.Franchise, r *http.Request) error {

	return nil
}

// UpdateMovie updates a movie
func UpdateMovie(movie models.Movie, r *http.Request) error {

	return nil
}

// UpdateSeries updates a series
func UpdateSeries(series models.Series, r *http.Request) error {

	return nil
}

// UpdateDocumentary updates a documentary
func UpdateDocumentary(documentary models.Documentary, r *http.Request) error {

	return nil
}

// UpdateGame updates a game
func UpdateGame(game models.Game, r *http.Request) error {

	return nil
}

// UpdateFranchise updates a franchise
func UpdateFranchise(franchise models.Franchise, r *http.Request) error {

	return nil
}

// DeleteMovie deletes a movie
func DeleteMovie(movie models.Movie, r *http.Request) error {

	return nil
}

// DeleteSeries deletes a series
func DeleteSeries(series models.Series, r *http.Request) error {

	return nil
}

// DeleteDocumentary deletes a documentary
func DeleteDocumentary(documentary models.Documentary, r *http.Request) error {

	return nil
}

// DeleteGame deletes a game
func DeleteGame(game models.Game, r *http.Request) error {

	return nil
}

// DeleteFranchise deletes a franchise
func DeleteFranchise(franchise models.Franchise, r *http.Request) error {

	return nil
}
