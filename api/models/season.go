package models

// Season is a data model
type Season struct {
	Year     int64     `json:"year"`
	Nr       int64     `json:"nr"`
	Episodes []Episode `json:"episodes"`
}

// SeasonData is an internal data model
type SeasonData struct {
	Year int64 `json:"year"`
	Nr   int64 `json:"nr"`
}
