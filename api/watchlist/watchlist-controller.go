package watchlist

import (
	"encoding/json"
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/storage"
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

// LoadSeries loads the movies
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

// LoadDocumentaries loads the movies
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
