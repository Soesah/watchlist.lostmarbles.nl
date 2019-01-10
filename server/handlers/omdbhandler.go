package handlers

import (
	"net/http"
	"net/url"

	"github.com/Soesah/watchlist.lostmarbles.nl/api/omdb"
	"github.com/Soesah/watchlist.lostmarbles.nl/server/httpext"
	"github.com/go-chi/chi"
)

// OMDBSearch gets results from the OMDB API
func OMDBSearch(w http.ResponseWriter, r *http.Request) {
	search := url.QueryEscape(chi.URLParam(r, "search"))
	year := chi.URLParam(r, "year")
	results, err := omdb.Search(search, year, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpext.JSON(w, results)
}

// OMDBGet gets a result from the OMDB API
func OMDBGet(w http.ResponseWriter, r *http.Request) {
	imdbID := chi.URLParam(r, "imdbID")

	item, err := omdb.Get(imdbID, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpext.JSON(w, item)
}
