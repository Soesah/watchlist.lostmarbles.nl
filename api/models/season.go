package models

// Season is a data model
type Season struct {
	Year     int       `json:"year,omitempty"`
	Nr       int       `json:"nr,omitempty"`
	Episodes []Episode `json:"episodes,omitempty"`
}
