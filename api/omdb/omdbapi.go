package omdb

import (
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
)

// Search returns search results from OMDB
func Search(r *http.Request) ([]models.OMDBObject, error) {
	var list []models.OMDBObject

	return list, nil
}

// Get returns a single item from OMDB
func Get(r *http.Request) (models.OMDBObject, error) {
	var item models.OMDBObject

	return item, nil
}
