package models

// Series is a data model
type Series struct {
	Type      int      `json:"type,omitempty"`
	ImdbID    string   `json:"imdbId,omitempty"`
	Name      string   `json:"name,omitempty"`
	Plot      string   `json:"plot,omitempty"`
	Finished  bool     `json:"finished,omitempty"`
	Seasons   []Season `json:"seasons,omitempty"`
	Actors    []string `json:"actors,omitempty"`
	DateAdded string   `json:"date_added,omitempty"`
}

// SeriesData is a data model
type SeriesData struct {
	Type      int
	ImdbID    string
	Name      string
	Plot      string
	Finished  bool
	Seasons   string
	Actors    string
	DateAdded string
}
