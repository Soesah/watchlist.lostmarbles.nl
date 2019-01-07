package models

// Movie is a data model
type Movie struct {
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
	DateAdded   string   `json:"date_added"`
}
