package models

const (
	typeMovie       = 0
	typeSeries      = 1
	typeDocumentary = 2
	typeGame        = 3
	typeFranchise   = 4
)

// WatchlistItem is the generic data model
type WatchlistItem struct {
	Type        int64    `json:"type"`
	ImdbID      string   `json:"imdbId"`
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

// Movie returns the item as a movie
func (item WatchlistItem) Movie() Movie {
	return Movie{
		Type:        item.Type,
		ImdbID:      item.ImdbID,
		Name:        item.Name,
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

// Series returns the item as a series
func (item WatchlistItem) Series() SeriesData {

	return SeriesData{
		Type:      item.Type,
		ImdbID:    item.ImdbID,
		Name:      item.Name,
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
			Year: season.Year,
			Nr:   season.Nr,
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
				ImdbID:      ep.ImdbID,
				SeasonNr:    season.Nr,
				Nr:          ep.Nr,
				Title:       ep.Title,
				Watched:     ep.Watched,
				DateWatched: ep.DateWatched,
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
		Name:        item.Name,
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
		Name:       item.Name,
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
		Name:      item.Name,
		Items:     item.Items,
		DateAdded: item.DateAdded,
	}
}

// IsMovie returns if the item is a movie
func (item WatchlistItem) IsMovie() bool {
	return item.Type == typeMovie
}

// IsSeries returns if the item is a movie
func (item WatchlistItem) IsSeries() bool {
	return item.Type == typeSeries
}

// IsDocumentary returns if the item is a movie
func (item WatchlistItem) IsDocumentary() bool {
	return item.Type == typeDocumentary
}

// IsGame returns if the item is a movie
func (item WatchlistItem) IsGame() bool {
	return item.Type == typeGame
}

// IsFranchise returns if the item is a movie
func (item WatchlistItem) IsFranchise() bool {
	return item.Type == typeFranchise
}
