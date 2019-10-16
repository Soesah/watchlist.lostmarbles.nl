package watchlist

import (
	"context"
	"errors"
	"net/http"
	"time"

	"cloud.google.com/go/datastore"
	"github.com/Soesah/watchlist.lostmarbles.nl/api"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/util"
	"google.golang.org/api/iterator"
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
	empty := make([]string, 0)

	// movies
	movies, err := LoadMovies(r)
	if err != nil {
		return list, err
	}

	for _, movie := range movies {
		if len(movie.Actors) == 0 {
			movie.Actors = empty
		}
		list = append(list, movie)
	}

	// series
	series, err := LoadSeries(r)
	if err != nil {
		return list, err
	}

	for _, series := range series {
		list = append(list, series)
	}

	// documentaries
	documentaries, err := LoadDocumentaries(r)
	if err != nil {
		return list, err
	}

	for _, documentary := range documentaries {
		if len(documentary.Actors) == 0 {
			documentary.Actors = empty
		}
		list = append(list, documentary)
	}

	// games
	games, err := LoadGames(r)
	if err != nil {
		return list, err
	}

	for _, game := range games {
		if len(game.Actors) == 0 {
			game.Actors = empty
		}
		list = append(list, game)
	}

	// franchises
	franchises, err := LoadFranchises(r)
	if err != nil {
		return list, err
	}

	for _, franchise := range franchises {
		if len(franchise.Items) == 0 {
			franchise.Items = empty
		}
		list = append(list, franchise)
	}

	return list, nil
}

// ToggleItemWatched adds a movie
func ToggleItemWatched(itemType string, imdbID string, r *http.Request) (interface{}, string, error) {

	var key *datastore.Key
	var item interface{}
	var watched string

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	if itemType == typeMOVIE {
		var movie models.Movie
		key = api.MovieKey(imdbID)
		err := client.Get(ctx, key, &movie)
		if err != nil {
			return item, "", err
		}
		movie.Watched = !movie.Watched
		if movie.Watched {
			movie.DateWatched = util.DateNow()
			watched = "watched"
		} else {
			watched = "not watched"
		}

		_, err = client.Put(ctx, key, &movie)
		if err != nil {
			return item, "", err
		}
		item = movie
	}
	if itemType == typeDOCUMENTARY {
		var documentary models.Documentary
		key = api.DocumentaryKey(imdbID)
		err := client.Get(ctx, key, &documentary)
		if err != nil {
			return item, "", err
		}
		documentary.Watched = !documentary.Watched
		if documentary.Watched {
			documentary.DateWatched = util.DateNow()
			watched = "watched"
		} else {
			watched = "not watched"
		}
		_, err = client.Put(ctx, key, &documentary)
		if err != nil {
			return item, "", err
		}
		item = documentary
	}
	if itemType == typeGAME {
		var game models.Game
		key = api.GameKey(imdbID)
		err := client.Get(ctx, key, &game)
		if err != nil {
			return item, "", err
		}
		game.Played = !game.Played
		if game.Played {
			game.DatePlayed = util.DateNow()
			watched = "played"
		} else {
			watched = "not played"
		}

		_, err = client.Put(ctx, key, &game)
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
	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.SeriesKey(imdbID)
	var err error

	q := datastore.NewQuery(api.EpisodeKind).Ancestor(key)

	it := client.Run(ctx, q)
	var keys []*datastore.Key

	for {
		var episode models.Episode
		ekey, err := it.Next(&episode)
		if err == iterator.Done {
			break
		}
		keys = append(keys, ekey)
		episodes = append(episodes, episode)
	}

	if err != nil {
		return series, watched, err
	}

	for index := range episodes {
		episodes[index].Watched = set
		if set {
			episodes[index].DateWatched = util.DateNow()
		}
	}

	_, err = client.PutMulti(ctx, keys, episodes)

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

	var err error
	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.SeasonKey(seasonNr, imdbID)

	q := datastore.NewQuery(api.EpisodeKind).Ancestor(key)

	it := client.Run(ctx, q)
	var keys []*datastore.Key

	for {
		var episode models.Episode
		ekey, err := it.Next(&episode)
		if err == iterator.Done {
			break
		}
		keys = append(keys, ekey)
		episodes = append(episodes, episode)
	}

	if err != nil {
		return series, watched, err
	}

	for index := range episodes {
		episodes[index].Watched = set
		if set {
			episodes[index].DateWatched = util.DateNow()
		}
	}

	_, err = client.PutMulti(ctx, keys, episodes)

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

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.EpisodeKey(episodeNr, seasonNr, imdbID)

	err := client.Get(ctx, key, &episode)

	if err != nil {
		return series, watched, err
	}

	episode.Watched = !episode.Watched
	if episode.Watched {
		episode.DateWatched = util.DateNow()
	}

	_, err = client.Put(ctx, key, &episode)

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

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	movie.DateAdded = time.Now().Format(util.DateFormat)

	key := api.MovieKey(movie.ImdbID)
	_, err := client.Put(ctx, key, &movie)

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

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	series.DateAdded = time.Now().Format(util.DateFormat)

	key := api.SeriesDataKey(series.ImdbID)
	seriesData := series.SeriesData()
	_, err := client.Put(ctx, key, &seriesData)

	if err != nil {
		return created, err
	}

	// import seasons with series parent key
	for _, season := range series.SeasonsData() {
		key = api.SeasonKey(season.Nr, season.SeriesImdbID)
		seasonKeys = append(seasonKeys, key)
		seasons = append(seasons, season)

	}
	// import episodes with season parent key and series parent key
	for _, episode := range series.EpisodesData() {
		key = api.EpisodeKey(episode.Nr, episode.SeasonNr, episode.SeriesImdbID)
		episodeKeys = append(episodeKeys, key)
		episodes = append(episodes, episode)

	}

	_, err = client.PutMulti(ctx, seasonKeys, seasons)

	if err != nil {
		return created, errors.New(err.Error() + " when importing seasons")
	}

	_, err = client.PutMulti(ctx, episodeKeys, episodes)

	if err != nil {
		return created, errors.New(err.Error() + " when importing episodes")
	}

	created = series.GetSeries()

	return created, nil
}

// AddDocumentary adds a documentary
func AddDocumentary(documentary models.Documentary, r *http.Request) (models.Documentary, error) {
	var created models.Documentary

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	documentary.DateAdded = time.Now().Format(util.DateFormat)

	key := api.DocumentaryKey(documentary.ImdbID)
	_, err := client.Put(ctx, key, &documentary)

	if err != nil {
		return created, err
	}

	created = documentary

	return created, nil
}

// AddGame adds a game
func AddGame(game models.Game, r *http.Request) (models.Game, error) {
	var created models.Game

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	game.DateAdded = time.Now().Format(util.DateFormat)

	key := api.GameKey(game.ImdbID)
	_, err := client.Put(ctx, key, &game)

	if err != nil {
		return created, err
	}

	created = game

	return created, nil
}

// AddFranchise adds a franchise
func AddFranchise(franchise models.Franchise, r *http.Request) (models.Franchise, error) {
	var created models.Franchise

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	franchise.DateAdded = time.Now().Format(util.DateFormat)

	key := api.FranchiseKey(franchise.ImdbID)
	_, err := client.Put(ctx, key, &franchise)

	if err != nil {
		return created, err
	}

	created = franchise

	return created, nil
}

// GetMovie returns the Movie
func GetMovie(imdbID string, r *http.Request) (models.Movie, error) {
	var item models.Movie

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.MovieKey(imdbID)
	err := client.Get(ctx, key, &item)

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

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.SeriesDataKey(imdbID)

	err := client.Get(ctx, key, &seriesData)
	if err != nil {
		return item, err
	}

	q := datastore.NewQuery(api.SeasonKind).Ancestor(key)
	it := client.Run(ctx, q)

	for {
		var season models.SeasonData
		_, err := it.Next(&season)
		if err == iterator.Done {
			break
		}
		seasonsData = append(seasonsData, season)
	}

	q = datastore.NewQuery(api.EpisodeKind).Ancestor(key)
	it = client.Run(ctx, q)

	for {
		var episode models.Episode
		_, err := it.Next(&episode)
		if err == iterator.Done {
			break
		}
		episodes = append(episodes, episode)
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

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.DocumentaryKey(imdbID)
	err := client.Get(ctx, key, &item)

	if err != nil {
		return item, err
	}

	return item, nil
}

// GetGame returns the Game
func GetGame(imdbID string, r *http.Request) (models.Game, error) {
	var item models.Game

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.GameKey(imdbID)
	err := client.Get(ctx, key, &item)

	if err != nil {
		return item, err
	}

	return item, nil
}

// GetFranchise returns the Franchise
func GetFranchise(imdbID string, r *http.Request) (models.Franchise, error) {
	var item models.Franchise

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.FranchiseKey(imdbID)
	err := client.Get(ctx, key, &item)

	if err != nil {
		return item, err
	}

	return item, nil
}

// UpdateMovie updates a movie
func UpdateMovie(movie models.Movie, r *http.Request) (models.Movie, error) {
	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.MovieKey(movie.ImdbID)
	_, err := client.Put(ctx, key, &movie)

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
	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.DocumentaryKey(documentary.ImdbID)
	_, err := client.Put(ctx, key, &documentary)

	if err != nil {
		return documentary, err
	}

	return documentary, nil
}

// UpdateGame updates a game
func UpdateGame(game models.Game, r *http.Request) (models.Game, error) {
	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.GameKey(game.ImdbID)
	_, err := client.Put(ctx, key, &game)

	if err != nil {
		return game, err
	}

	return game, nil
}

// UpdateFranchise updates a franchise
func UpdateFranchise(franchise models.Franchise, r *http.Request) (models.Franchise, error) {
	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	key := api.FranchiseKey(franchise.ImdbID)
	_, err := client.Put(ctx, key, &franchise)

	if err != nil {
		return franchise, err
	}

	return franchise, nil
}

// DeleteMovie deletes a movie
func DeleteMovie(imdbID string, r *http.Request) error {

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")
	key := api.MovieKey(imdbID)

	err := client.Delete(ctx, key)

	if err != nil {
		return err
	}

	return nil
}

// DeleteSeries deletes a series
func DeleteSeries(imdbID string, r *http.Request) error {

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")
	key := api.SeriesKey(imdbID)

	err := client.Delete(ctx, key)

	if err != nil {
		return err
	}

	q := datastore.NewQuery(api.SeasonKind).Ancestor(key)
	it := client.Run(ctx, q)

	var sKeys []*datastore.Key

	for {
		var season models.SeasonData
		key, err := it.Next(&season)
		if err == iterator.Done {
			break
		}
		sKeys = append(sKeys, key)
	}

	if err != nil {
		return err
	}

	err = client.DeleteMulti(ctx, sKeys)

	if err != nil {
		return err
	}
	var eKeys []*datastore.Key

	q = datastore.NewQuery(api.EpisodeKind).Ancestor(key)
	it = client.Run(ctx, q)

	for {
		var episode models.Episode
		key, err := it.Next(&episode)
		if err == iterator.Done {
			break
		}
		eKeys = append(eKeys, key)
	}
	if err != nil {
		return err
	}

	err = client.DeleteMulti(ctx, eKeys)

	if err != nil {
		return err
	}

	return nil
}

// DeleteDocumentary deletes a documentary
func DeleteDocumentary(imdbID string, r *http.Request) error {

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")
	key := api.DocumentaryKey(imdbID)

	err := client.Delete(ctx, key)

	if err != nil {
		return err
	}

	return nil
}

// DeleteGame deletes a game
func DeleteGame(imdbID string, r *http.Request) error {

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")
	key := api.GameKey(imdbID)

	err := client.Delete(ctx, key)

	if err != nil {
		return err
	}
	return nil
}

// DeleteFranchise deletes a franchise
func DeleteFranchise(imdbID string, r *http.Request) error {

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")
	key := api.FranchiseKey(imdbID)

	err := client.Delete(ctx, key)

	if err != nil {
		return err
	}

	return nil
}
