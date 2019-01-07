package system

import (
	"errors"
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
)

// ImportData imports all data
func ImportData(items []models.WatchlistItem, r *http.Request) ([]models.WatchlistItem, error) {

	ctx := appengine.NewContext(r)

	ClearAllItems(r)

	var movieKeys []*datastore.Key
	var movies []models.Movie
	var seriesKeys []*datastore.Key
	var series []models.SeriesData
	var seasonKeys []*datastore.Key
	var seasons []models.SeasonData
	var episodeKeys []*datastore.Key
	var episodes []models.Episode
	var documentaryKeys []*datastore.Key
	var documentaries []models.Documentary
	var gameKeys []*datastore.Key
	var games []models.Game
	var franchiseKeys []*datastore.Key
	var franchises []models.Franchise

	for _, item := range items {
		var key *datastore.Key

		if item.IsMovie() {
			key = api.MovieKey(ctx, item.Movie())
			movieKeys = append(movieKeys, key)
			movies = append(movies, item.Movie())
		}

		if item.IsSeries() {
			key = api.SeriesDataKey(ctx, item.Series())
			seriesKeys = append(seriesKeys, key)
			series = append(series, item.Series())
			// import seasons with series parent key
			for _, season := range item.SeasonsData() {
				key = api.SeasonKey(ctx, season, item.Series())
				seasonKeys = append(seasonKeys, key)
				seasons = append(seasons, season)

			}
			// import episodes with season parent key and series parent key
			for _, episode := range item.EpisodesData() {
				key = api.EpisodeKey(ctx, episode, item.Series())
				episodeKeys = append(episodeKeys, key)
				episodes = append(episodes, episode)

			}
		}

		if item.IsDocumentary() {
			key = api.DocumentaryKey(ctx, item.Documentary())
			documentaryKeys = append(documentaryKeys, key)
			documentaries = append(documentaries, item.Documentary())
		}

		if item.IsGame() {
			key = api.GameKey(ctx, item.Game())
			gameKeys = append(gameKeys, key)
			games = append(games, item.Game())
		}

		if item.IsFranchise() {
			key = api.FranchiseKey(ctx, item.Franchise())
			franchiseKeys = append(franchiseKeys, key)
			franchises = append(franchises, item.Franchise())
		}

	}

	_, err := datastore.PutMulti(ctx, movieKeys, movies)

	if err != nil {
		return items, errors.New(err.Error() + " when importing movies")
	}

	_, err = datastore.PutMulti(ctx, seriesKeys, series)

	if err != nil {
		return items, errors.New(err.Error() + " when importing series")
	}

	_, err = datastore.PutMulti(ctx, seasonKeys, seasons)

	if err != nil {
		return items, errors.New(err.Error() + " when importing seasons")
	}

	_, err = datastore.PutMulti(ctx, episodeKeys, episodes)

	if err != nil {
		return items, errors.New(err.Error() + " when importing episodes")
	}

	_, err = datastore.PutMulti(ctx, documentaryKeys, documentaries)

	if err != nil {
		return items, errors.New(err.Error() + " when importing documentaries")
	}

	_, err = datastore.PutMulti(ctx, gameKeys, games)

	if err != nil {
		return items, errors.New(err.Error() + " when importing games")
	}

	_, err = datastore.PutMulti(ctx, franchiseKeys, franchises)

	if err != nil {
		return items, errors.New(err.Error() + " when importing franchises")
	}

	return items, nil
}

// ExportData is used to export all items
func ExportData(r *http.Request) ([]interface{}, error) {

	ctx := appengine.NewContext(r)

	var items []interface{}

	var movies []models.Movie
	var seriesData []models.SeriesData
	var seasonsData []models.SeasonData
	var episodes []models.Episode
	var documentaries []models.Documentary
	var games []models.Game
	var franchises []models.Franchise

	// movies
	q := datastore.NewQuery(api.MovieKind)
	_, err := q.GetAll(ctx, &movies)
	if err != nil {
		return nil, err
	}
	for _, movie := range movies {
		items = append(items, movie)
	}

	// series
	q = datastore.NewQuery(api.SeriesKind)
	_, err = q.GetAll(ctx, &seriesData)
	if err != nil {
		return nil, err
	}

	q = datastore.NewQuery(api.SeasonKind)
	_, err = q.GetAll(ctx, &seasonsData)
	if err != nil {
		return nil, err
	}

	q = datastore.NewQuery(api.EpisodeKind)
	_, err = q.GetAll(ctx, &episodes)
	if err != nil {
		return nil, err
	}

	// add the episodes to the seasons
	var seasons []models.Season
	for _, seasonData := range seasonsData {
		season := seasonData.GetSeason(episodes)
		seasons = append(seasons, season)
	}
	// add the seasons to the series
	for _, serialData := range seriesData {
		serial := serialData.GetSeries(seasons)
		items = append(items, serial)
	}

	// documentaries
	q = datastore.NewQuery(api.DocumentaryKind)
	_, err = q.GetAll(ctx, &documentaries)
	if err != nil {
		return nil, err
	}
	for _, documentary := range documentaries {
		items = append(items, documentary)
	}

	// games
	q = datastore.NewQuery(api.GameKind)
	_, err = q.GetAll(ctx, &games)
	if err != nil {
		return nil, err
	}
	for _, game := range games {
		items = append(items, game)
	}

	// franchises
	q = datastore.NewQuery(api.FranchiseKind)
	_, err = q.GetAll(ctx, &franchises)
	if err != nil {
		return nil, err
	}
	for _, franchise := range franchises {
		items = append(items, franchise)
	}

	return items, nil
}

// ClearAllItems is used to delete all items
func ClearAllItems(r *http.Request) error {

	ctx := appengine.NewContext(r)

	var movies []models.Movie
	var series []models.SeriesData
	var seasons []models.SeasonData
	var episodes []models.Episode
	var documentaries []models.Documentary
	var games []models.Game
	var franchises []models.Franchise

	q := datastore.NewQuery(api.MovieKind)
	keys, err := q.GetAll(ctx, &movies)
	if err != nil {
		return err
	}
	err = datastore.DeleteMulti(ctx, keys)

	q = datastore.NewQuery(api.SeriesKind)
	keys, err = q.GetAll(ctx, &series)
	if err != nil {
		return err
	}
	err = datastore.DeleteMulti(ctx, keys)

	q = datastore.NewQuery(api.SeasonKind)
	keys, err = q.GetAll(ctx, &seasons)
	if err != nil {
		return err
	}
	err = datastore.DeleteMulti(ctx, keys)

	q = datastore.NewQuery(api.EpisodeKind)
	keys, err = q.GetAll(ctx, &episodes)
	if err != nil {
		return err
	}
	err = datastore.DeleteMulti(ctx, keys)

	q = datastore.NewQuery(api.DocumentaryKind)
	keys, err = q.GetAll(ctx, &documentaries)
	if err != nil {
		return err
	}
	err = datastore.DeleteMulti(ctx, keys)

	q = datastore.NewQuery(api.GameKind)
	keys, err = q.GetAll(ctx, &games)
	if err != nil {
		return err
	}
	err = datastore.DeleteMulti(ctx, keys)

	q = datastore.NewQuery(api.FranchiseKind)
	keys, err = q.GetAll(ctx, &franchises)
	if err != nil {
		return err
	}
	err = datastore.DeleteMulti(ctx, keys)

	if err != nil {
		return err
	}

	return nil
}
