package models

// Franchise is a data model
type Franchise struct {
	Type      int      `json:"type,omitempty"`
	ImdbID    string   `json:"imdbId,omitempty"`
	Name      string   `json:"name,omitempty"`
	Items     []string `json:"items,omitempty"`
	DateAdded string   `json:"date_added,omitempty"`
}

// FranchiseData is an internal data model
type FranchiseData struct {
	Type      int
	ImdbID    string
	Name      string
	Items     string
	DateAdded string
}
