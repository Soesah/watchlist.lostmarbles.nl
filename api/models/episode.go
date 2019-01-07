package models

// Episode is a data model
type Episode struct {
	ImdbID      string `json:"imdbId"`
	SeasonNr    int64  `json:"-"`
	Nr          int64  `json:"nr"`
	Title       string `json:"title"`
	Watched     bool   `json:"watched"`
	DateWatched string `json:"date__watched"`
}
