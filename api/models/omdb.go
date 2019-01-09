package models

import (
	"strconv"
	"strings"
)

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
		results = append(results, Result{
			Title:  item.Title,
			Year:   int64(year),
			ImdbID: item.ImdbID,
			Type:   getInternalType(item.Type),
			Poster: item.Poster,
		})
	}
	return Results{
		Results: results,
		Count:   count,
	}
}

// OMDBResult holds the search result from OMDB
type OMDBResult struct {
	Title  string `json:"Title"`
	Year   string `json:"Year"`
	ImdbID string `json:"imdbID"`
	Type   string `json:"Type"`
	Poster string `json:"Poster"`
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

// GetResultItem returns a result item from an IMDBObject
func (item OMDBObject) GetResultItem() ResultItem {
	year, _ := strconv.Atoi(item.Year)
	return ResultItem{
		Title:        item.Title,
		Year:         int64(year),
		Released:     item.Released,
		Runtime:      item.Runtime,
		Genre:        item.Genre,
		Director:     item.Director,
		Writer:       item.Writer,
		Actors:       strings.Split(item.Actors, ", "),
		TotalSeasons: item.TotalSeasons,
		Plot:         item.Plot,
		Language:     item.Language,
		Poster:       item.Poster,
		ImdbID:       item.ImdbID,
		Type:         getInternalType(item.Type),
		Episodes:     item.Episodes,
	}
}

func getInternalType(t string) int64 {
	if t == "movie" {
		return TypeMovie
	}
	if t == "series" {
		return TypeSeries
	}
	return -1
}
