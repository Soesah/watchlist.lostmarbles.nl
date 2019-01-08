package models

// OMDbResults holds the search results from OMDB
type OMDbResults struct {
	Search       []OMDbResult `json:"search"`
	TotalResults string       `json:"total_results"`
}

// OMDbResult holds the search result from OMDB
type OMDbResult struct {
	Title  string `json:"title"`
	Year   string `json:"year"`
	ImdbID string `json:"imdbId"`
	Type   string `json:"type"`
	Poster string `json:"poster"`
}

//OMDBObject is the item result from OMDB
type OMDBObject struct {
	Title        string
	Year         string
	Rated        string
	Released     string
	Runtime      string
	Genre        string
	Director     string
	Writer       string
	Actors       string
	TotalSeasons string
	Plot         string
	Language     string
	Country      string
	Awards       string
	Poster       string
	Metascore    string
	ImdbRating   string
	ImdbVotes    string
	ImdbID       string
	Type         string
	Episodes     string
}
