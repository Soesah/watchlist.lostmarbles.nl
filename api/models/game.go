package models

// Game is a data model
type Game struct {
	Type       int      `json:"type,omitempty"`
	ImdbID     string   `json:"imdbId,omitempty"`
	Name       string   `json:"name,omitempty"`
	Year       int      `json:"year,omitempty"`
	Score      int      `json:"score,omitempty"`
	Plot       string   `json:"plot,omitempty"`
	Actors     []string `json:"actors,omitempty"`
	Publisher  string   `json:"publisher,omitempty"`
	Genre      string   `json:"genre,omitempty"`
	Played     bool     `json:"played,omitempty"`
	DatePlayed string   `json:"date_played,omitempty"`
	DateAdded  string   `json:"date_added,omitempty"`
}

// GameData is an internal data model
type GameData struct {
	Type       int
	ImdbID     string
	Name       string
	Year       int
	Score      int
	Plot       string
	Actors     string
	Publisher  string
	Genre      string
	Played     bool
	DatePlayed string
	DateAdded  string
}
