package system

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"cloud.google.com/go/datastore"
	"github.com/Soesah/watchlist.lostmarbles.nl/api"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/watchlist"
	"google.golang.org/api/iterator"
)

// ImportData imports all data
func ImportData(items []models.WatchlistItem, r *http.Request) (int, int, error) {

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

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

		// options := datastore.TransactionOption{
		// 	XG: true,
		// }

		_, err := client.RunInTransaction(ctx, func(tx *datastore.Transaction) error {

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
					key = api.MovieKey(item.Movie().ImdbID)
					movieKeys = append(movieKeys, key)
					movies = append(movies, item.Movie())
				}

				if item.IsSeries() {
					key = api.SeriesDataKey(item.SeriesData().ImdbID)
					seriesKeys = append(seriesKeys, key)
					series = append(series, item.SeriesData())
					// import seasons with series parent key
					for _, season := range item.SeasonsData() {
						key = api.SeasonKey(season.Nr, season.SeriesImdbID)
						seasonKeys = append(seasonKeys, key)
						seasons = append(seasons, season)

					}
					// import episodes with season parent key and series parent key
					for _, episode := range item.EpisodesData() {
						key = api.EpisodeKey(episode.Nr, episode.SeasonNr, episode.SeriesImdbID)
						episodeKeys = append(episodeKeys, key)
						episodes = append(episodes, episode)

					}
				}

				if item.IsDocumentary() {
					key = api.DocumentaryKey(item.Documentary().ImdbID)
					documentaryKeys = append(documentaryKeys, key)
					documentaries = append(documentaries, item.Documentary())
				}

				if item.IsGame() {
					key = api.GameKey(item.Game().ImdbID)
					gameKeys = append(gameKeys, key)
					games = append(games, item.Game())
				}

				if item.IsFranchise() {
					key = api.FranchiseKey(item.Franchise().ImdbID)
					franchiseKeys = append(franchiseKeys, key)
					franchises = append(franchises, item.Franchise())
				}

			}

			_, err := client.PutMulti(ctx, movieKeys, movies)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing movies, tried %v items", len(movies)))
			}

			_, err = client.PutMulti(ctx, seriesKeys, series)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing series, tried %v items", len(series)))
			}

			_, err = client.PutMulti(ctx, seasonKeys, seasons)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing seasons, tried %v items", len(seasons)))
			}

			_, err = client.PutMulti(ctx, episodeKeys, episodes)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing episodes, tried %v items", len(episodes)))
			}

			_, err = client.PutMulti(ctx, documentaryKeys, documentaries)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing documentaries, tried %v items", len(documentaries)))
			}

			_, err = client.PutMulti(ctx, gameKeys, games)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing games, tried %v items", len(games)))
			}

			_, err = client.PutMulti(ctx, franchiseKeys, franchises)

			if err != nil {
				return errors.New(err.Error() + fmt.Sprintf(" when importing franchises, tried %v items", len(franchises)))
			}

			return nil

		})

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

	ctx := context.Background()
	client, _ := datastore.NewClient(ctx, "watchlist-lost-marbles")

	var keys []*datastore.Key

	q := datastore.NewQuery(api.MovieKind)
	it := client.Run(ctx, q)
	for {
		var data models.Movie
		key, err := it.Next(&data)
		if err == iterator.Done {
			break
		}
		keys = append(keys, key)
	}

	q = datastore.NewQuery(api.SeriesKind)
	it = client.Run(ctx, q)
	for {
		var data models.SeriesData
		key, err := it.Next(&data)
		if err == iterator.Done {
			break
		}
		keys = append(keys, key)
	}
	q = datastore.NewQuery(api.SeasonKind)
	it = client.Run(ctx, q)
	for {
		var data models.Season
		key, err := it.Next(&data)
		if err == iterator.Done {
			break
		}
		keys = append(keys, key)
	}
	q = datastore.NewQuery(api.EpisodeKind)
	it = client.Run(ctx, q)
	for {
		var data models.Episode
		key, err := it.Next(&data)
		if err == iterator.Done {
			break
		}
		keys = append(keys, key)
	}
	q = datastore.NewQuery(api.DocumentaryKind)
	it = client.Run(ctx, q)
	for {
		var data models.Documentary
		key, err := it.Next(&data)
		if err == iterator.Done {
			break
		}
		keys = append(keys, key)
	}
	q = datastore.NewQuery(api.GameKind)
	it = client.Run(ctx, q)
	for {
		var data models.Game
		key, err := it.Next(&data)
		if err == iterator.Done {
			break
		}
		keys = append(keys, key)
	}
	q = datastore.NewQuery(api.FranchiseKind)
	it = client.Run(ctx, q)
	for {
		var data models.Franchise
		key, err := it.Next(&data)
		if err == iterator.Done {
			break
		}
		keys = append(keys, key)
	}
	err := client.DeleteMulti(ctx, keys)

	if err != nil {
		return err
	}

	return nil
}
