package watchlist

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/Soesah/watchlist.lostmarbles.nl/api"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/util"
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
	list := make([]interface{}, 0)

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
func ToggleItemWatched(itemType string, imdbID string, r *http.Request) (interface{}, string, error) {

	var key *datastore.Key
	var item interface{}
	var watched string
	ctx := appengine.NewContext(r)

	if itemType == typeMOVIE {
		var movie models.Movie
		key = api.MovieKey(ctx, imdbID)
		err := datastore.Get(ctx, key, &movie)
		if err != nil {
			return item, "", err
		}
		movie.Watched = !movie.Watched
		if movie.Watched {
			watched = "watched"
		} else {
			watched = "not watched"
		}

		_, err = datastore.Put(ctx, key, &movie)
		if err != nil {
			return item, "", err
		}
		item = movie
	}
	if itemType == typeDOCUMENTARY {
		var documentary models.Documentary
		key = api.DocumentaryKey(ctx, imdbID)
		err := datastore.Get(ctx, key, &documentary)
		if err != nil {
			return item, "", err
		}
		documentary.Watched = !documentary.Watched
		if documentary.Watched {
			watched = "watched"
		} else {
			watched = "not watched"
		}
		_, err = datastore.Put(ctx, key, &documentary)
		if err != nil {
			return item, "", err
		}
		item = documentary
	}
	if itemType == typeGAME {
		var game models.Game
		key = api.GameKey(ctx, imdbID)
		err := datastore.Get(ctx, key, &game)
		if err != nil {
			return item, "", err
		}
		game.Played = !game.Played
		if game.Played {
			watched = "played"
		} else {
			watched = "not played"
		}

		_, err = datastore.Put(ctx, key, &game)
		if err != nil {
			return item, "", err
		}
		item = game
	}

	return item, watched, nil
}

// ToggleSeriesWatched toggles an entire series to watched/unwatched
func ToggleSeriesWatched(imdbID string, set bool, r *http.Request) (models.Series, string, error) {
	var series models.Series
	var episodes []models.Episode
	watched := "watched"
	if !set {
		watched = "not watched"
	}
	ctx := appengine.NewContext(r)

	key := api.SeriesKey(ctx, imdbID)

	q := datastore.NewQuery(api.EpisodeKind).Ancestor(key)

	keys, err := q.GetAll(ctx, &episodes)

	if err != nil {
		return series, watched, err
	}

	for index := range episodes {
		episodes[index].Watched = set
	}

	_, err = datastore.PutMulti(ctx, keys, episodes)

	if err != nil {
		return series, watched, err
	}

	series, err = GetSeries(imdbID, r)

	if err != nil {
		return series, watched, err
	}

	return series, watched, nil
}

// ToggleSeasonWatched toggles an entire season to watched/unwatched
func ToggleSeasonWatched(imdbID string, seasonNr int64, set bool, r *http.Request) (models.Series, string, error) {
	var series models.Series
	var episodes []models.Episode
	watched := "watched"
	if !set {
		watched = "not watched"
	}

	ctx := appengine.NewContext(r)

	key := api.SeasonKey(ctx, seasonNr, imdbID)

	q := datastore.NewQuery(api.EpisodeKind).Ancestor(key)

	keys, err := q.GetAll(ctx, &episodes)

	if err != nil {
		return series, watched, err
	}

	for index := range episodes {
		episodes[index].Watched = set
	}

	_, err = datastore.PutMulti(ctx, keys, episodes)

	if err != nil {
		return series, watched, err
	}

	series, err = GetSeries(imdbID, r)

	if err != nil {
		return series, watched, err
	}

	return series, watched, nil
}

// ToggleEpisodeWatched toggles an episode to watched/unwatched
func ToggleEpisodeWatched(imdbID string, seasonNr int64, episodeNr int64, r *http.Request) (models.Series, string, error) {
	var series models.Series
	var episode models.Episode
	watched := "watched"

	ctx := appengine.NewContext(r)

	key := api.EpisodeKey(ctx, episodeNr, seasonNr, imdbID)

	err := datastore.Get(ctx, key, &episode)

	if err != nil {
		return series, watched, err
	}

	episode.Watched = !episode.Watched

	_, err = datastore.Put(ctx, key, episode)

	if err != nil {
		return series, watched, err
	}

	series, err = GetSeries(imdbID, r)

	if err != nil {
		return series, watched, err
	}

	return series, watched, nil
}

// AddMovie adds a movie
func AddMovie(movie models.Movie, r *http.Request) (models.Movie, error) {
	var created models.Movie

	ctx := appengine.NewContext(r)

	movie.DateAdded = time.Now().Format(util.DateFormat)

	key := api.MovieKey(ctx, movie.ImdbID)
	_, err := datastore.Put(ctx, key, &movie)

	if err != nil {
		return created, err
	}

	created = movie

	return created, nil
}

// AddSeries adds a series
func AddSeries(series models.WatchlistItem, r *http.Request) (models.Series, error) {
	var created models.Series
	var seasonKeys []*datastore.Key
	var seasons []models.SeasonData
	var episodeKeys []*datastore.Key
	var episodes []models.Episode

	ctx := appengine.NewContext(r)

	series.DateAdded = time.Now().Format(util.DateFormat)

	key := api.SeriesDataKey(ctx, series.ImdbID)
	seriesData := series.SeriesData()
	_, err := datastore.Put(ctx, key, &seriesData)

	if err != nil {
		return created, err
	}

	// import seasons with series parent key
	for _, season := range series.SeasonsData() {
		key = api.SeasonKey(ctx, season.Nr, season.SeriesImdbID)
		seasonKeys = append(seasonKeys, key)
		seasons = append(seasons, season)

	}
	// import episodes with season parent key and series parent key
	for _, episode := range series.EpisodesData() {
		key = api.EpisodeKey(ctx, episode.Nr, episode.SeasonNr, episode.SeriesImdbID)
		episodeKeys = append(episodeKeys, key)
		episodes = append(episodes, episode)

	}

	_, err = datastore.PutMulti(ctx, seasonKeys, seasons)

	if err != nil {
		return created, errors.New(err.Error() + " when importing seasons")
	}

	_, err = datastore.PutMulti(ctx, episodeKeys, episodes)

	if err != nil {
		return created, errors.New(err.Error() + " when importing episodes")
	}

	created = series.GetSeries()

	return created, nil
}

// AddDocumentary adds a documentary
func AddDocumentary(documentary models.Documentary, r *http.Request) (models.Documentary, error) {
	var created models.Documentary

	ctx := appengine.NewContext(r)

	documentary.DateAdded = time.Now().Format(util.DateFormat)

	key := api.DocumentaryKey(ctx, documentary.ImdbID)
	_, err := datastore.Put(ctx, key, &documentary)

	if err != nil {
		return created, err
	}

	created = documentary

	return created, nil
}

// AddGame adds a game
func AddGame(game models.Game, r *http.Request) (models.Game, error) {
	var created models.Game

	ctx := appengine.NewContext(r)

	game.DateAdded = time.Now().Format(util.DateFormat)

	key := api.GameKey(ctx, game.ImdbID)
	_, err := datastore.Put(ctx, key, &game)

	if err != nil {
		return created, err
	}

	created = game

	return created, nil
}

// AddFranchise adds a franchise
func AddFranchise(franchise models.Franchise, r *http.Request) (models.Franchise, error) {
	var created models.Franchise

	ctx := appengine.NewContext(r)

	franchise.DateAdded = time.Now().Format(util.DateFormat)

	key := api.FranchiseKey(ctx, franchise.ImdbID)
	_, err := datastore.Put(ctx, key, &franchise)

	if err != nil {
		return created, err
	}

	created = franchise

	return created, nil
}

// GetMovie returns the Movie
func GetMovie(imdbID string, r *http.Request) (models.Movie, error) {
	var item models.Movie

	ctx := appengine.NewContext(r)

	key := api.MovieKey(ctx, imdbID)
	err := datastore.Get(ctx, key, &item)

	if err != nil {
		return item, err
	}

	return item, nil
}

// GetSeries returns the Series
func GetSeries(imdbID string, r *http.Request) (models.Series, error) {
	var item models.Series
	var seriesData models.SeriesData
	var seasonsData []models.SeasonData
	var episodes []models.Episode

	ctx := appengine.NewContext(r)
	key := api.SeriesDataKey(ctx, imdbID)

	err := datastore.Get(ctx, key, &seriesData)
	if err != nil {
		return item, err
	}

	q := datastore.NewQuery(api.SeasonKind).Ancestor(key)
	_, err = q.GetAll(ctx, &seasonsData)
	if err != nil {
		return item, err
	}

	q = datastore.NewQuery(api.EpisodeKind).Ancestor(key)
	_, err = q.GetAll(ctx, &episodes)
	if err != nil {
		return item, err
	}

	// add the episodes to the seasons
	var seasons []models.Season
	for _, seasonData := range seasonsData {
		season := seasonData.GetSeason(episodes)
		seasons = append(seasons, season)
	}

	item = seriesData.GetSeries(seasons)

	return item, nil

	// return item, nil
}

// GetDocumentary returns the Documentary
func GetDocumentary(imdbID string, r *http.Request) (models.Documentary, error) {
	var item models.Documentary

	ctx := appengine.NewContext(r)

	key := api.DocumentaryKey(ctx, imdbID)
	err := datastore.Get(ctx, key, &item)

	if err != nil {
		return item, err
	}

	return item, nil
}

// GetGame returns the Game
func GetGame(imdbID string, r *http.Request) (models.Game, error) {
	var item models.Game

	ctx := appengine.NewContext(r)

	key := api.GameKey(ctx, imdbID)
	err := datastore.Get(ctx, key, &item)

	if err != nil {
		return item, err
	}

	return item, nil
}

// GetFranchise returns the Franchise
func GetFranchise(imdbID string, r *http.Request) (models.Franchise, error) {
	var item models.Franchise

	ctx := appengine.NewContext(r)

	key := api.FranchiseKey(ctx, imdbID)
	err := datastore.Get(ctx, key, &item)

	if err != nil {
		return item, err
	}

	return item, nil
}

// UpdateMovie updates a movie
func UpdateMovie(movie models.Movie, r *http.Request) (models.Movie, error) {
	ctx := appengine.NewContext(r)

	key := api.MovieKey(ctx, movie.ImdbID)
	_, err := datastore.Put(ctx, key, &movie)

	if err != nil {
		return movie, err
	}

	return movie, nil
}

// UpdateSeries updates a series
func UpdateSeries(series models.WatchlistItem, r *http.Request) (models.Series, error) {

	// remove current data
	DeleteSeries(series.ImdbID, r)

	// re-add updated data
	return AddSeries(series, r)
}

// UpdateDocumentary updates a documentary
func UpdateDocumentary(documentary models.Documentary, r *http.Request) (models.Documentary, error) {
	ctx := appengine.NewContext(r)

	key := api.DocumentaryKey(ctx, documentary.ImdbID)
	_, err := datastore.Put(ctx, key, &documentary)

	if err != nil {
		return documentary, err
	}

	return documentary, nil
}

// UpdateGame updates a game
func UpdateGame(game models.Game, r *http.Request) (models.Game, error) {
	ctx := appengine.NewContext(r)

	key := api.GameKey(ctx, game.ImdbID)
	_, err := datastore.Put(ctx, key, &game)

	if err != nil {
		return game, err
	}

	return game, nil
}

// UpdateFranchise updates a franchise
func UpdateFranchise(franchise models.Franchise, r *http.Request) (models.Franchise, error) {
	ctx := appengine.NewContext(r)

	key := api.FranchiseKey(ctx, franchise.ImdbID)
	_, err := datastore.Put(ctx, key, &franchise)

	if err != nil {
		return franchise, err
	}

	return franchise, nil
}

// DeleteMovie deletes a movie
func DeleteMovie(imdbID string, r *http.Request) error {

	ctx := appengine.NewContext(r)
	key := api.MovieKey(ctx, imdbID)

	err := datastore.Delete(ctx, key)

	if err != nil {
		return err
	}

	return nil
}

// DeleteSeries deletes a series
func DeleteSeries(imdbID string, r *http.Request) error {
	var seasonsData []models.SeasonData
	var episodes []models.Episode

	ctx := appengine.NewContext(r)
	key := api.SeriesKey(ctx, imdbID)

	err := datastore.Delete(ctx, key)

	if err != nil {
		return err
	}

	q := datastore.NewQuery(api.SeasonKind).Ancestor(key)
	keys, err := q.GetAll(ctx, &seasonsData)

	if err != nil {
		return err
	}

	err = datastore.DeleteMulti(ctx, keys)

	if err != nil {
		return err
	}

	q = datastore.NewQuery(api.EpisodeKind).Ancestor(key)
	keys, err = q.GetAll(ctx, &episodes)

	if err != nil {
		return err
	}

	err = datastore.DeleteMulti(ctx, keys)

	if err != nil {
		return err
	}

	return nil
}

// DeleteDocumentary deletes a documentary
func DeleteDocumentary(imdbID string, r *http.Request) error {

	ctx := appengine.NewContext(r)
	key := api.DocumentaryKey(ctx, imdbID)

	err := datastore.Delete(ctx, key)

	if err != nil {
		return err
	}

	return nil
}

// DeleteGame deletes a game
func DeleteGame(imdbID string, r *http.Request) error {

	ctx := appengine.NewContext(r)
	key := api.GameKey(ctx, imdbID)

	err := datastore.Delete(ctx, key)

	if err != nil {
		return err
	}
	return nil
}

// DeleteFranchise deletes a franchise
func DeleteFranchise(imdbID string, r *http.Request) error {

	ctx := appengine.NewContext(r)
	key := api.FranchiseKey(ctx, imdbID)

	err := datastore.Delete(ctx, key)

	if err != nil {
		return err
	}

	return nil
}
