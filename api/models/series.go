package models

// Series is a data model
type Series struct {
	Type      int64    `json:"type"`
	ImdbID    string   `json:"imdbId"`
	Name      string   `json:"name"`
	Plot      string   `json:"plot"`
	Finished  bool     `json:"finished"`
	Seasons   []Season `json:"seasons" datastore:"seasons,noindex"`
	Actors    []string `json:"actors"`
	DateAdded string   `json:"date_added"`
}

// SeriesData is an internal data model
type SeriesData struct {
	Type      int64
	ImdbID    string
	Name      string
	Plot      string
	Finished  bool
	Actors    []string
	DateAdded string
}

// GetSeries returns a Series with seasons
func (seriesData SeriesData) GetSeries(seasons []Season) Series {
	var seriesSeasons []Season

	for _, season := range seasons {
		if season.SeriesImdbID == seriesData.ImdbID {
			seriesSeasons = append(seriesSeasons, season)
		}
	}

	return Series{
		Type:      seriesData.Type,
		ImdbID:    seriesData.ImdbID,
		Name:      seriesData.Name,
		Plot:      seriesData.Plot,
		Finished:  seriesData.Finished,
		Seasons:   seriesSeasons,
		Actors:    seriesData.Actors,
		DateAdded: seriesData.DateAdded,
	}
}
