package models

// Series is a data model
type Series struct {
	Type      int64    `json:"type"`
	ImdbID    string   `json:"imdbId"`
	Name      string   `json:"name"`
	Plot      string   `json:"plot"`
	Finished  bool     `json:"finished"`
	Seasons   []Season `json:"seasons" datastore:"seasons,noindex"`
	Actors    []string `json:"actors"`
	DateAdded string   `json:"date_added"`
}

// SeriesData is an internal data model
type SeriesData struct {
	Type      int64
	ImdbID    string
	Name      string
	Plot      string
	Finished  bool
	Actors    []string
	DateAdded string
}
