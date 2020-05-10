package models

// Series is a data model
type Series struct {
	Type           int64    `json:"type"`
	ImdbID         string   `json:"imdbID"`
	PreviousImdbID string   `json:"previousImdbID"`
	Title          string   `json:"title"`
	Plot           string   `json:"plot"`
	Finished       bool     `json:"finished"`
	Seasons        []Season `json:"seasons" datastore:"seasons,noindex"`
	Actors         []string `json:"actors"`
	DateAdded      string   `json:"date_added"`
}
