package models

// Results holds the search results
type Results struct {
	Results []Result `json:"results"`
	Count   int      `json:"count"`
}

// Result holds a search result
type Result struct {
	Type   int64  `json:"type"`
	ImdbID string `json:"imdbID"`
	Title  string `json:"title"`
	Year   int64  `json:"year"`
	Poster string `json:"poster"`
}

//ResultItem is the item result from OMDB
type ResultItem struct {
	Type         int64    `json:"type"`
	ImdbID       string   `json:"imdbID"`
	Title        string   `json:"title"`
	Year         int64    `json:"year"`
	Released     string   `json:"released"`
	Runtime      string   `json:"runtime"`
	Genre        string   `json:"genre"`
	Director     string   `json:"director"`
	Writer       string   `json:"writer"`
	Actors       []string `json:"actors"`
	TotalSeasons string   `json:"seasons_count,omitempty"`
	Plot         string   `json:"plot"`
	Language     string   `json:"language"`
	Poster       string   `json:"poster"`
	Episodes     string   `json:"episodes,omitempty"`
}
