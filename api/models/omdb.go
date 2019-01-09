package models

import "strconv"

// OMDBSearch holds the search results from OMDB
type OMDBSearch struct {
	Search       []OMDBResult `json:"Search"`
	TotalResults string       `json:"totalResults"`
}

// Results returns sanetized search results
func (res OMDBSearch) Results() Results {
	count, _ := strconv.Atoi(res.TotalResults)
	var results []Result
	for _, item := range res.Search {
		year, _ := strconv.Atoi(item.Year)
		t := 1
		results = append(results, Result{
			Title:  item.Title,
			Year:   year,
			ImdbID: item.ImdbID,
			Type:   t,
			Poster: item.Poster,
		})
	}
	return Results{
		Results: results,
		Count:   count,
	}
}

// Results holds the search results
type Results struct {
	Results []Result `json:"results"`
	Count   int      `json:"count"`
}

// OMDBResult holds the search result from OMDB
type OMDBResult struct {
	Title  string `json:"Title"`
	Year   string `json:"Year"`
	ImdbID string `json:"imdbID"`
	Type   string `json:"Type"`
	Poster string `json:"Poster"`
}

// Result holds a search result
type Result struct {
	Title  string `json:"title"`
	Year   int    `json:"year"`
	ImdbID string `json:"imdbID"`
	Type   int    `json:"type"`
	Poster string `json:"poster"`
}

//OMDBObject is the item result from OMDB
type OMDBObject struct {
	Title        string `json:"title"`
	Year         string `json:"year"`
	Rated        string `json:"rated"`
	Released     string `json:"released"`
	Runtime      string `json:"runtime"`
	Genre        string `json:"genre"`
	Director     string `json:"director"`
	Writer       string `json:"writer"`
	Actors       string `json:"actors"`
	TotalSeasons string `json:"total_seasons"`
	Plot         string `json:"plot"`
	Language     string `json:"language"`
	Country      string `json:"country"`
	Awards       string `json:"awards"`
	Poster       string `json:"poster"`
	Metascore    string `json:"metascore"`
	imdbRating   string
	imdbVotes    string
	imdbID       string
	ImdbID       string `json:"imdbID"`
	Type         string `json:"type"`
	Episodes     string `json:"episodes"`
}

// SetImdbID sets imdbID to a public property
func (item OMDBObject) SetImdbID() {
	item.ImdbID = item.imdbID
}
