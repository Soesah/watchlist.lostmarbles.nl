package api

import (
	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"golang.org/x/net/context"
	"google.golang.org/appengine/datastore"
)

const (
	// WatchlistKind is the super ancestor of all items
	WatchlistKind = "Watchlist"

	// WatchlistItemKind is the ancestor of all watchlist items
	WatchlistItemKind = "WatchlistItem"

	// MovieKind is used for movies
	MovieKind = "Movie"
	// GameKind is used for games
	GameKind = "Game"
	// SeriesKind is used for series
	SeriesKind = "Series"
	// SeasonKind is used for seasons
	SeasonKind = "Season"
	// EpisodeKind is used for episodes
	EpisodeKind = "Episode"
	// DocumentaryKind is used for documentaries
	DocumentaryKind = "Documentary"
	// FranchiseKind is used for franchises
	FranchiseKind = "Franchise"
)

// WatchlistKey returns a key for Watchlist
func WatchlistKey(ctx context.Context) *datastore.Key {
	return datastore.NewKey(ctx, WatchlistKind, "lostmarbles", 0, nil)
}

// ItemKey returns a key for ItemKey -> WatchlistKey
func ItemKey(ctx context.Context) *datastore.Key {
	return datastore.NewKey(ctx, WatchlistItemKind, "item", 0, WatchlistKey(ctx))
}

// MovieKey returns a key for Movie -> ItemKey -> WatchlistKey
func MovieKey(ctx context.Context, movie models.Movie) *datastore.Key {
	return datastore.NewKey(ctx, MovieKind, movie.ImdbID, 0, ItemKey(ctx))
}

// SeriesKey returns a key for Series -> ItemKey -> WatchlistKey
func SeriesKey(ctx context.Context, series models.Series) *datastore.Key {
	return datastore.NewKey(ctx, SeriesKind, series.ImdbID, 0, ItemKey(ctx))
}

// SeriesDataKey returns a key for Series -> ItemKey -> WatchlistKey
func SeriesDataKey(ctx context.Context, series models.SeriesData) *datastore.Key {
	return datastore.NewKey(ctx, SeriesKind, series.ImdbID, 0, ItemKey(ctx))
}

// SeasonKey returns a key for Season -> Series -> ItemKey -> WatchlistKey
func SeasonKey(ctx context.Context, season models.SeasonData, series models.SeriesData) *datastore.Key {
	return datastore.NewKey(ctx, SeasonKind, "", season.Nr, SeriesDataKey(ctx, series))
}

// EpisodeKey returns a key for Episode -> Series -> ItemKey -> WatchlistKey
func EpisodeKey(ctx context.Context, episode models.Episode, series models.SeriesData) *datastore.Key {
	return datastore.NewKey(ctx, EpisodeKind, "", episode.Nr, SeriesDataKey(ctx, series))
}

// DocumentaryKey returns a key for Documentary -> ItemKey -> WatchlistKey
func DocumentaryKey(ctx context.Context, documentary models.Documentary) *datastore.Key {
	return datastore.NewKey(ctx, DocumentaryKind, documentary.ImdbID, 0, ItemKey(ctx))
}

// GameKey returns a key for Game -> ItemKey -> WatchlistKey
func GameKey(ctx context.Context, game models.Game) *datastore.Key {
	return datastore.NewKey(ctx, GameKind, game.ImdbID, 0, ItemKey(ctx))
}

// FranchiseKey returns a key for Franchise -> ItemKey -> WatchlistKey
func FranchiseKey(ctx context.Context, franchise models.Franchise) *datastore.Key {
	return datastore.NewKey(ctx, FranchiseKind, franchise.ImdbID, 0, ItemKey(ctx))
}
