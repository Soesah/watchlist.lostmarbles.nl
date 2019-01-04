package models

// Documentary is a data model
type Documentary struct {
	Type        int    `json:"type,omitempty"`
	ImdbID      string `json:"imdb_id,omitempty"`
	Name        string `json:"name,omitempty"`
	Year        int    `json:"year,omitempty"`
	Score       int    `json:"score,omitempty"`
	Director    string `json:"director,omitempty"`
	Watched     bool   `json:"watched,omitempty"`
	DateWatched string `json:"date_watched,omitempty"`
	DateAdded   string `json:"date_added,omitempty"`
}
