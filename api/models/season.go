package models

// Season is a data model
type Season struct {
	Year         int64     `json:"year"`
	Nr           int64     `json:"nr"`
	SeriesImdbID string    `json:"-"`
	Episodes     []Episode `json:"episodes"`
}

// SeasonData is an internal data model
type SeasonData struct {
	Year         int64  `json:"year"`
	Nr           int64  `json:"nr"`
	SeriesImdbID string `json:"-"`
}

// GetSeason returns a season with its episodes
func (season SeasonData) GetSeason(episodes []Episode) Season {

	var seasonEpisodes []Episode

	for _, episode := range episodes {
		if episode.SeriesImdbID == season.SeriesImdbID && episode.SeasonNr == season.Nr {
			seasonEpisodes = append(seasonEpisodes, episode)
		}
	}

	return Season{
		Year:         season.Year,
		Nr:           season.Nr,
		Episodes:     seasonEpisodes,
		SeriesImdbID: season.SeriesImdbID,
	}

}
