package models

// Documentary is a data model
type Documentary struct {
	Type        int64    `json:"type"`
	ImdbID      string   `json:"imdbID"`
	Title       string   `json:"title"`
	Year        int64    `json:"year"`
	Score       int64    `json:"score"`
	Director    string   `json:"director"`
	Actors      []string `json:"actors"`
	Watched     bool     `json:"watched"`
	DateWatched string   `json:"date_watched"`
	DateAdded   string   `json:"date_added"`
}
