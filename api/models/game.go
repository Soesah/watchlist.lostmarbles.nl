package models

// Game is a data model
type Game struct {
	Type       int64    `json:"type"`
	ImdbID     string   `json:"imdbId"`
	Name       string   `json:"name"`
	Year       int64    `json:"year"`
	Score      int64    `json:"score"`
	Plot       string   `json:"plot"`
	Actors     []string `json:"actors"`
	Publisher  string   `json:"publisher"`
	Genre      string   `json:"genre"`
	Played     bool     `json:"played"`
	DatePlayed string   `json:"date_played"`
	DateAdded  string   `json:"date_added"`
}
