package api

import (
	"cloud.google.com/go/datastore"
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
func WatchlistKey() *datastore.Key {
	return datastore.NameKey(WatchlistKind, "lostmarbles", nil)
}

// ItemKey returns a key for ItemKey -> WatchlistKey
func ItemKey() *datastore.Key {
	return datastore.NameKey(WatchlistItemKind, "item", WatchlistKey())
}

// MovieKey returns a key for Movie -> ItemKey -> WatchlistKey
func MovieKey(imdbID string) *datastore.Key {
	return datastore.NameKey(MovieKind, imdbID, ItemKey())
}

// SeriesKey returns a key for Series -> ItemKey -> WatchlistKey
func SeriesKey(imdbID string) *datastore.Key {
	return datastore.NameKey(SeriesKind, imdbID, ItemKey())
}

// SeriesDataKey returns a key for Series -> ItemKey -> WatchlistKey
func SeriesDataKey(imdbID string) *datastore.Key {
	return datastore.NameKey(SeriesKind, imdbID, ItemKey())
}

// SeasonKey returns a key for Season -> Series -> ItemKey -> WatchlistKey
func SeasonKey(seasonNr int64, imdbID string) *datastore.Key {
	return datastore.IDKey(SeasonKind, seasonNr, SeriesDataKey(imdbID))
}

// EpisodeKey returns a key for Episode -> Series -> ItemKey -> WatchlistKey
func EpisodeKey(episodeNr int64, seasonNr int64, imdbID string) *datastore.Key {
	return datastore.IDKey(EpisodeKind, episodeNr, SeasonKey(seasonNr, imdbID))
}

// DocumentaryKey returns a key for Documentary -> ItemKey -> WatchlistKey
func DocumentaryKey(imdbID string) *datastore.Key {
	return datastore.NameKey(DocumentaryKind, imdbID, ItemKey())
}

// GameKey returns a key for Game -> ItemKey -> WatchlistKey
func GameKey(imdbID string) *datastore.Key {
	return datastore.NameKey(GameKind, imdbID, ItemKey())
}

// FranchiseKey returns a key for Franchise -> ItemKey -> WatchlistKey
func FranchiseKey(imdbID string) *datastore.Key {
	return datastore.NameKey(FranchiseKind, imdbID, ItemKey())
}
