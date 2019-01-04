package models

// Episode is a data model
type Episode struct {
	ImdbID      string `json:"imdbId,omitempty"`
	Nr          int    `json:"nr,omitempty"`
	Title       string `json:"title,omitempty"`
	Watched     bool   `json:"watched,omitempty"`
	DateWatched string `json:"date__watched,omitempty"`
}
