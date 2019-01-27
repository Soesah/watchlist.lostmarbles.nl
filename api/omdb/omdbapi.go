package omdb

import (
	"encoding/json"
	"net/http"
	"strconv"

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

// GetSeasons returns all (sensible) seasons for a series
func GetSeasons(imdbID string, r *http.Request) ([]models.Season, error) {
	seasons := make([]models.Season, 0)

	ctx := appengine.NewContext(r)
	client := urlfetch.Client(ctx)

	season, err := getSeason(client, imdbID, "1", r)

	if err != nil {
		return seasons, err
	}

	totalSeasons, _ := strconv.Atoi(season.TotalSeasons)

	seasons = append(seasons, season.GetSeason(imdbID))

	for i := 1; i < totalSeasons; i++ {
		season, err = getSeason(client, imdbID, strconv.Itoa(i+1), r)

		if err != nil {
			return seasons, err
		}

		seasons = append(seasons, season.GetSeason(imdbID))
	}

	return seasons, nil
}

func getSeason(client *http.Client, imdbID string, nr string, r *http.Request) (models.OMDBSeason, error) {
	var season models.OMDBSeason

	url := getURL("i=" + imdbID + "&Season=" + nr + "&r=json")

	resp, err := client.Get(url)

	if err != nil {
		return season, err
	}

	decoder := json.NewDecoder(resp.Body)

	err = decoder.Decode(&season)

	if err != nil {
		return season, err
	}

	return season, nil
}
