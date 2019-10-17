package watchlist

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/storage"
)

var (
	errNoMoviesToSave        = errors.New("No movies to save")
	errNoSeriesToSave        = errors.New("No series to save")
	errNoDocumentariesToSave = errors.New("No documentaries to save")
	errNoGamesToSave         = errors.New("No games to save")
	errNoFranchisesToSave    = errors.New("No franchises to save")
)

// LoadMovies loads the movies
func LoadMovies(r *http.Request) ([]models.Movie, error) {
	var movies []models.Movie

	data, err := storage.GetFile("movies", r)

	if err != nil {
		return movies, err
	}

	err = json.Unmarshal(data, &movies)

	if err != nil {
		return movies, err
	}

	return movies, nil
}

// StoreMovies stores the movies
func StoreMovies(movies []models.Movie, r *http.Request) error {

	if len(movies) == 0 {
		return errNoMoviesToSave
	}

	data, err := json.MarshalIndent(movies, "", "  ")

	if err != nil {
		return err
	}

	err = storage.PutFile("movies", data, r)

	if err != nil {
		return err
	}

	return nil
}

// LoadSeries loads the series
func LoadSeries(r *http.Request) ([]models.Series, error) {
	var series []models.Series

	data, err := storage.GetFile("series", r)

	if err != nil {
		return series, err
	}

	err = json.Unmarshal(data, &series)

	if err != nil {
		return series, err
	}

	return series, nil
}

// StoreSeries stores the series
func StoreSeries(series []models.Series, r *http.Request) error {

	if len(series) == 0 {
		return errNoSeriesToSave
	}

	data, err := json.MarshalIndent(series, "", "  ")

	if err != nil {
		return err
	}

	err = storage.PutFile("series", data, r)

	if err != nil {
		return err
	}

	return nil
}

// LoadDocumentaries loads the documentaries
func LoadDocumentaries(r *http.Request) ([]models.Documentary, error) {
	var documentaries []models.Documentary

	data, err := storage.GetFile("documentaries", r)

	if err != nil {
		return documentaries, err
	}

	err = json.Unmarshal(data, &documentaries)

	if err != nil {
		return documentaries, err
	}

	return documentaries, nil
}

// StoreDocumentaries stores the documentaries
func StoreDocumentaries(documentaries []models.Documentary, r *http.Request) error {

	if len(documentaries) == 0 {
		return errNoDocumentariesToSave
	}

	data, err := json.MarshalIndent(documentaries, "", "  ")

	if err != nil {
		return err
	}

	err = storage.PutFile("documentaries", data, r)

	if err != nil {
		return err
	}

	return nil
}

// LoadGames loads the movies
func LoadGames(r *http.Request) ([]models.Game, error) {
	var games []models.Game

	data, err := storage.GetFile("games", r)

	if err != nil {
		return games, err
	}

	err = json.Unmarshal(data, &games)

	if err != nil {
		return games, err
	}

	return games, nil
}

// StoreGames stores the games
func StoreGames(games []models.Game, r *http.Request) error {

	if len(games) == 0 {
		return errNoGamesToSave
	}

	data, err := json.MarshalIndent(games, "", "  ")

	if err != nil {
		return err
	}

	err = storage.PutFile("games", data, r)

	if err != nil {
		return err
	}

	return nil
}

// LoadFranchises loads the movies
func LoadFranchises(r *http.Request) ([]models.Franchise, error) {
	var franchises []models.Franchise

	data, err := storage.GetFile("franchises", r)

	if err != nil {
		return franchises, err
	}

	err = json.Unmarshal(data, &franchises)

	if err != nil {
		return franchises, err
	}

	return franchises, nil
}

// StoreFranchises stores the franchises
func StoreFranchises(franchises []models.Franchise, r *http.Request) error {

	if len(franchises) == 0 {
		return errNoFranchisesToSave
	}

	data, err := json.MarshalIndent(franchises, "", "  ")

	if err != nil {
		return err
	}

	err = storage.PutFile("franchises", data, r)

	if err != nil {
		return err
	}

	return nil
}
