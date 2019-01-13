package watchlist

import (
	"context"
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
)

const (
	typeMOVIE       = "movie"
	typeSERIES      = "series"
	typeDOCUMENTARY = "documentary"
	typeGAME        = "game"
	typeFRANCHISE   = "franchise"
	typeEPISODE     = "episode"
)

// GetWatchList returns the whole watch list
func GetWatchList(r *http.Request) ([]interface{}, error) {
	var list []interface{}

	var movies []models.Movie
	var seriesData []models.SeriesData
	var seasonsData []models.SeasonData
	var episodes []models.Episode
	var documentaries []models.Documentary
	var games []models.Game
	var franchises []models.Franchise

	ctx := appengine.NewContext(r)

	options := datastore.TransactionOptions{
		XG: true,
	}

	err := datastore.RunInTransaction(ctx, func(ct context.Context) error {

		// movies
		q := datastore.NewQuery(api.MovieKind)
		_, err := q.GetAll(ctx, &movies)
		if err != nil {
			return err
		}
		for _, movie := range movies {
			list = append(list, movie)
		}

		// series
		q = datastore.NewQuery(api.SeriesKind)
		_, err = q.GetAll(ctx, &seriesData)
		if err != nil {
			return err
		}

		q = datastore.NewQuery(api.SeasonKind)
		_, err = q.GetAll(ctx, &seasonsData)
		if err != nil {
			return err
		}

		q = datastore.NewQuery(api.EpisodeKind)
		_, err = q.GetAll(ctx, &episodes)
		if err != nil {
			return err
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
			list = append(list, serial)
		}

		// documentaries
		q = datastore.NewQuery(api.DocumentaryKind)
		_, err = q.GetAll(ctx, &documentaries)
		if err != nil {
			return err
		}
		for _, documentary := range documentaries {
			list = append(list, documentary)
		}

		// games
		q = datastore.NewQuery(api.GameKind)
		_, err = q.GetAll(ctx, &games)
		if err != nil {
			return err
		}
		for _, game := range games {
			list = append(list, game)
		}

		// franchises
		q = datastore.NewQuery(api.FranchiseKind)
		_, err = q.GetAll(ctx, &franchises)
		if err != nil {
			return err
		}
		for _, franchise := range franchises {
			list = append(list, franchise)
		}

		return nil
	}, &options)

	if err != nil {
		return nil, err
	}

	return list, nil
}

// ToggleItemWatched adds a movie
func ToggleItemWatched(itemType string, imdbID string, r *http.Request) (interface{}, error) {

	var key *datastore.Key
	var item interface{}
	ctx := appengine.NewContext(r)

	if itemType == typeMOVIE {
		var movie models.Movie
		key = api.MovieKey(ctx, imdbID)
		err := datastore.Get(ctx, key, &movie)
		if err != nil {
			return item, err
		}
		movie.Watched = !movie.Watched
		_, err = datastore.Put(ctx, key, &movie)
		if err != nil {
			return item, err
		}
		item = movie
	}
	// if itemType == typeSERIES {
	// 	var series models.Series
	// 	key = api.SeriesKey(ctx, imdbID)
	// 	err := datastore.Get(ctx, key, &series)
	// 	if err != nil {
	// 		return item, err
	// 	}
	// 	series.Watched = !series.Watched
	// 	_, err = datastore.Put(ctx, key, series)
	// 	if err != nil {
	// 		return item, err
	// 	}
	// 	item = series
	// }
	if itemType == typeDOCUMENTARY {
		var documentary models.Documentary
		key = api.DocumentaryKey(ctx, imdbID)
		err := datastore.Get(ctx, key, &documentary)
		if err != nil {
			return item, err
		}
		documentary.Watched = !documentary.Watched
		_, err = datastore.Put(ctx, key, documentary)
		if err != nil {
			return item, err
		}
		item = documentary
	}
	if itemType == typeGAME {
		var game models.Game
		key = api.GameKey(ctx, imdbID)
		err := datastore.Get(ctx, key, &game)
		if err != nil {
			return item, err
		}
		game.Played = !game.Played
		_, err = datastore.Put(ctx, key, game)
		if err != nil {
			return item, err
		}
		item = game
	}
	// if itemType == typeEPISODE {
	// 	key = api.EpisodeKey(ctx, imdbID)
	// }

	return item, nil
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
