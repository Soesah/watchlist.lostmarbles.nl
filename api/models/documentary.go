package models

// Documentary is a data model
type Documentary struct {
	Type        int64  `json:"type,omitempty"`
	ImdbID      string `json:"imdb_id,omitempty"`
	Title       string `json:"title,omitempty"`
	Year        int64  `json:"year,omitempty"`
	Score       int64  `json:"score,omitempty"`
	Director    string `json:"director,omitempty"`
	Watched     bool   `json:"watched,omitempty"`
	DateWatched string `json:"date_watched,omitempty"`
	DateAdded   string `json:"date_added,omitempty"`
}
