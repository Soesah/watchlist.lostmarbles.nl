package system

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/watchlist"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
)

// ImportData imports all data
func ImportData(items []models.WatchlistItem, r *http.Request) (int, int, error) {

	ctx := appengine.NewContext(r)

	ClearAllItems(r)

	set := models.WatchlistItemSet{
		Items: items,
		Limit: 450,
	}

	batch, index, _ := set.GetBatch(0)
	count := len(batch)
	batchcount := 1

	// save the batch while there is something in it
	for len(batch) != 0 {

		options := datastore.TransactionOptions{
			XG: true,
		}

		err := datastore.RunInTransaction(ctx, func(ct context.Context) error {

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

			for _, item := range batch {
				var key *datastore.Key

				if item.IsMovie() {
					key = api.MovieKey(ctx, item.Movie().ImdbID)
					movieKeys = append(movieKeys, key)
					movies = append(movies, item.Movie())
				}

				if item.IsSeries() {
					key = api.SeriesDataKey(ctx, item.SeriesData().ImdbID)
					seriesKeys = append(seriesKeys, key)
					series = append(series, item.SeriesData())
					// import seasons with series parent key
					for _, season := range item.SeasonsData() {
						key = api.SeasonKey(ctx, season.Nr, season.SeriesImdbID)
						seasonKeys = append(seasonKeys, key)
						seasons = append(seasons, season)

					}
					// import episodes with season parent key and series parent key
					for _, episode := range item.EpisodesData() {
						key = api.EpisodeKey(ctx, episode.Nr, episode.SeasonNr, episode.SeriesImdbID)
						episodeKeys = append(episodeKeys, key)
						episodes = append(episodes, episode)

					}
				}

				if item.IsDocumentary() {
					key = api.DocumentaryKey(ctx, item.Documentary().ImdbID)
					documentaryKeys = append(documentaryKeys, key)
					documentaries = append(documentaries, item.Documentary())
				}

				if item.IsGame() {
					key = api.GameKey(ctx, item.Game().ImdbID)
					gameKeys = append(gameKeys, key)
					games = append(games, item.Game())
				}

				if item.IsFranchise() {
					key = api.FranchiseKey(ctx, item.Franchise().ImdbID)
					franchiseKeys = append(franchiseKeys, key)
					franchises = append(franchises, item.Franchise())
				}

			}

			_, err := datastore.PutMulti(ct, movieKeys, movies)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing movies, tried %v items", len(movies)))
			}

			_, err = datastore.PutMulti(ct, seriesKeys, series)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing series, tried %v items", len(series)))
			}

			_, err = datastore.PutMulti(ct, seasonKeys, seasons)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing seasons, tried %v items", len(seasons)))
			}

			_, err = datastore.PutMulti(ct, episodeKeys, episodes)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing episodes, tried %v items", len(episodes)))
			}

			_, err = datastore.PutMulti(ct, documentaryKeys, documentaries)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing documentaries, tried %v items", len(documentaries)))
			}

			_, err = datastore.PutMulti(ct, gameKeys, games)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing games, tried %v items", len(games)))
			}

			_, err = datastore.PutMulti(ct, franchiseKeys, franchises)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing franchises, tried %v items", len(franchises)))
			}

			return nil

		}, &options)

		if err != nil {
			return 0, 0, err
		}

		// get a new batch
		batch, index, _ = set.GetBatch(index)
		count += len(batch)
		batchcount++
	}

	return count, batchcount, nil
}

// ExportData is used to export all items
func ExportData(r *http.Request) ([]interface{}, error) {
	return watchlist.GetWatchList(r)
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
