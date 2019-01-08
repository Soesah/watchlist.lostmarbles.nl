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
func Search(search string, year string, r *http.Request) (models.OMDbResults, error) {
	var results models.OMDbResults

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

	err = decoder.Decode(&results)

	if err != nil {
		return results, err
	}

	return results, nil
}

// Get returns a single item from OMDB
func Get(r *http.Request) (models.OMDBObject, error) {
	var item models.OMDBObject

	return item, nil
}
