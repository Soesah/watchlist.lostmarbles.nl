package models

// Franchise is a data model
type Franchise struct {
	Type      int64    `json:"type"`
	ImdbID    string   `json:"imdbID"`
	Name      string   `json:"name"`
	Items     []string `json:"items"`
	DateAdded string   `json:"date_added"`
}
