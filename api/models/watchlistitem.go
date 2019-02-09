package models

import (
	"errors"
)

const (
	//TypeMovie is the internal type nr of a Movie
	TypeMovie = 0
	//TypeSeries is the internal type nr of a Series
	TypeSeries = 1
	//TypeDocumentary is the internal type nr of a Documentary
	TypeDocumentary = 2
	//TypeGame is the internal type nr of a Game
	TypeGame = 3
	//TypeFranchise is the internal type nr of a Franchise
	TypeFranchise = 4
)

// WatchlistItem is the generic data model
type WatchlistItem struct {
	Type        int64    `json:"type"`
	ImdbID      string   `json:"imdbID"`
	Title       string   `json:"title"`
	Name        string   `json:"name"`
	Year        int64    `json:"year"`
	Score       int64    `json:"score"`
	Actors      []string `json:"actors"`
	Length      string   `json:"length"`
	Plot        string   `json:"plot"`
	Director    string   `json:"director"`
	Watched     bool     `json:"watched"`
	DateWatched string   `json:"date_watched"`
	DatePlayed  string   `json:"date_played"`
	DateAdded   string   `json:"date_added"`
	Finished    bool     `json:"finished"` // series
	Seasons     []Season `json:"seasons"`
	Publisher   string   `json:"publisher"` // game
	Genre       string   `json:"genre"`
	Played      bool     `json:"played"`
	Items       []string `json:"items"` // franchise
}

// GetTitle checks whether the title is in the name or title property
func (item WatchlistItem) GetTitle() string {
	if item.Title != "" {
		return item.Title
	}
	return item.Name
}

// Size returns the commit size for the item
func (item WatchlistItem) Size() int {
	var count int
	if item.IsMovie() || item.IsFranchise() || item.IsGame() || item.IsDocumentary() {
		count = 1
	}
	if item.IsSeries() {
		count = 1 + len(item.Seasons)
		for _, season := range item.Seasons {
			count += len(season.Episodes)
		}
	}
	return count
}

// Movie returns the item as a movie
func (item WatchlistItem) Movie() Movie {
	return Movie{
		Type:        item.Type,
		ImdbID:      item.ImdbID,
		Title:       item.GetTitle(),
		Year:        item.Year,
		Score:       item.Score,
		Actors:      item.Actors,
		Length:      item.Length,
		Plot:        item.Plot,
		Director:    item.Director,
		Watched:     item.Watched,
		DateWatched: item.DateWatched,
		DateAdded:   item.DateAdded,
	}
}

// GetSeries returns a SeriesData
func (item WatchlistItem) GetSeries() Series {
	return Series{
		Type:      item.Type,
		ImdbID:    item.ImdbID,
		Title:     item.GetTitle(),
		Plot:      item.Plot,
		Finished:  item.Finished,
		Actors:    item.Actors,
		Seasons:   item.Seasons,
		DateAdded: item.DateAdded,
	}
}

// SeriesData returns the item as a seriesData
func (item WatchlistItem) SeriesData() SeriesData {

	return SeriesData{
		Type:      item.Type,
		ImdbID:    item.ImdbID,
		Title:     item.GetTitle(),
		Actors:    item.Actors,
		Plot:      item.Plot,
		DateAdded: item.DateAdded,
	}
}

// SeasonsData returns the item as a Season
func (item WatchlistItem) SeasonsData() []SeasonData {

	var seasons []SeasonData

	for _, season := range item.Seasons {
		data := SeasonData{
			Year:         season.Year,
			Nr:           season.Nr,
			SeriesImdbID: item.ImdbID,
		}
		seasons = append(seasons, data)
	}
	return seasons
}

// EpisodesData returns the item as a Season
func (item WatchlistItem) EpisodesData() []Episode {

	var episodes []Episode

	for _, season := range item.Seasons {
		for _, ep := range season.Episodes {
			data := Episode{
				ImdbID:       ep.ImdbID,
				Nr:           ep.Nr,
				Title:        ep.Title,
				Watched:      ep.Watched,
				DateWatched:  ep.DateWatched,
				SeasonNr:     season.Nr,
				SeriesImdbID: item.ImdbID,
			}
			episodes = append(episodes, data)
		}
	}
	return episodes
}

// Documentary returns the item as a documentary
func (item WatchlistItem) Documentary() Documentary {
	return Documentary{
		Type:        item.Type,
		ImdbID:      item.ImdbID,
		Title:       item.GetTitle(),
		Year:        item.Year,
		Score:       item.Score,
		Director:    item.Director,
		Watched:     item.Watched,
		DateWatched: item.DateWatched,
		DateAdded:   item.DateAdded,
	}
}

// Game returns the item as a game
func (item WatchlistItem) Game() Game {
	return Game{
		Type:       item.Type,
		ImdbID:     item.ImdbID,
		Title:      item.GetTitle(),
		Year:       item.Year,
		Score:      item.Score,
		Plot:       item.Plot,
		Actors:     item.Actors,
		Publisher:  item.Publisher,
		Genre:      item.Genre,
		Played:     item.Played,
		DatePlayed: item.DatePlayed,
		DateAdded:  item.DateAdded,
	}
}

// Franchise returns the item as a Franchise
func (item WatchlistItem) Franchise() Franchise {
	return Franchise{
		Type:      item.Type,
		ImdbID:    item.ImdbID,
		Name:      item.GetTitle(),
		Items:     item.Items,
		DateAdded: item.DateAdded,
	}
}

// IsMovie returns if the item is a movie
func (item WatchlistItem) IsMovie() bool {
	return item.Type == TypeMovie
}

// IsSeries returns if the item is a movie
func (item WatchlistItem) IsSeries() bool {
	return item.Type == TypeSeries
}

// IsDocumentary returns if the item is a movie
func (item WatchlistItem) IsDocumentary() bool {
	return item.Type == TypeDocumentary
}

// IsGame returns if the item is a movie
func (item WatchlistItem) IsGame() bool {
	return item.Type == TypeGame
}

// IsFranchise returns if the item is a movie
func (item WatchlistItem) IsFranchise() bool {
	return item.Type == TypeFranchise
}

// WatchlistItemSet affords some methods to get a limited batch of items to save to the datastore
type WatchlistItemSet struct {
	Items []WatchlistItem
	Limit int
}

// GetBatch returns 500 items or less
func (set WatchlistItemSet) GetBatch(index int) ([]WatchlistItem, int, error) {
	var batch []WatchlistItem

	if set.Limit == 0 {
		return batch, index, errors.New("No limit provided for set")
	}

	var batchIndex = 0
	for batchIndex < set.Limit {
		// if the index if out of bounds, quit
		if index+1 > len(set.Items) {
			batchIndex = set.Limit
		} else {

			item := set.Items[index]

			// don't go over the set.Limit in a batch
			if batchIndex+item.Size() >= set.Limit {

				batchIndex = set.Limit

			} else {

				// increase the batchIndex
				batchIndex += item.Size()

				// increase the index
				index++

				// append to the batch
				batch = append(batch, item)
			}

		}
	}

	return batch, index, nil
}
