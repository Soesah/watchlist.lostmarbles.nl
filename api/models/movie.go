package models

// Movie is a data model
type Movie struct {
	Type        int      `json:"type,omitempty"`
	ImdbID      string   `json:"imdbId,omitempty"`
	Name        string   `json:"name,omitempty"`
	Year        int      `json:"year,omitempty"`
	Score       int      `json:"score,omitempty"`
	Actors      []string `json:"actors,omitempty"`
	Length      string   `json:"length,omitempty"`
	Plot        int      `json:"plot,omitempty"`
	Director    string   `json:"director,omitempty"`
	Watched     bool     `json:"watched,omitempty"`
	DateWatched string   `json:"date_watched,omitempty"`
	DateAdded   string   `json:"date_added,omitempty"`
}

// MovieData is an internal data model
type MovieData struct {
	Type        int
	ImdbID      string
	Name        string
	Year        int
	Score       int
	Actors      string
	Length      string
	Plot        int
	Director    string
	Watched     bool
	DateWatched string
	DateAdded   string
}
