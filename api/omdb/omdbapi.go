package omdb

import (
	"encoding/json"
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"github.com/Soesah/watchlist.lostmarbles.nl/server/config"
	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

func getURL(params string) string {
	return "http://www.omdbapi.com/?" + params + "&apiKey=" + config.Get().OMDBApiKey
}

// Search returns search results from OMDB
func Search(search string, year string, r *http.Request) (models.Results, error) {
	var omdbSearch models.OMDBSearch
	var results models.Results

	url := getURL("s=" + search)

	if year != "" {
		url = getURL("s=" + search + "&y=" + year)
	}

	ctx := appengine.NewContext(r)

	client := urlfetch.Client(ctx)
	resp, err := client.Get(url)

	if err != nil {
		return results, err
	}

	decoder := json.NewDecoder(resp.Body)

	err = decoder.Decode(&omdbSearch)

	if err != nil {
		return results, err
	}

	return omdbSearch.Results(), nil
}

// Get returns a single item from OMDB
func Get(imdbID string, r *http.Request) (models.ResultItem, error) {
	var item models.OMDBObject
	var res models.ResultItem

	url := getURL("i=" + imdbID + "&r=json")

	ctx := appengine.NewContext(r)

	client := urlfetch.Client(ctx)
	resp, err := client.Get(url)

	if err != nil {
		return res, err
	}

	decoder := json.NewDecoder(resp.Body)

	err = decoder.Decode(&item)

	if err != nil {
		return res, err
	}

	return item.GetResultItem(), nil
}
