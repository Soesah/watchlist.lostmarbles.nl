package models

import (
	"strconv"
	"strings"
	"time"

	"github.com/Soesah/watchlist.lostmarbles.nl/api/util"
)

// OMDBSearch holds the search results from OMDB
type OMDBSearch struct {
	Search       []OMDBResult `json:"Search"`
	TotalResults string       `json:"totalResults"`
}

// Results returns sanetized search results
func (res OMDBSearch) Results() Results {
	count, _ := strconv.Atoi(res.TotalResults)
	results := make([]Result, 0)
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

// OMDBSeason holds a season from OMDB
type OMDBSeason struct {
	Title        string        `json:"Title"`
	Season       string        `json:"Season"`
	TotalSeasons string        `json:"totalSeasons"`
	Episodes     []OMDBEpisode `json:"Episodes"`
	Response     string        `json:"Response"`
}

// OMDBEpisode hold an episode from OMDB
type OMDBEpisode struct {
	Title      string `json:"Title"`
	Released   string `json:"Released"`
	Episode    string `json:"Episode"`
	ImdbRating string `json:"imdbRating"`
	ImdbID     string `json:"imdbID"`
}

// GetSeason returns in internal Season for a OMDB Season
func (se OMDBSeason) GetSeason(imdbID string) Season {
	t, _ := time.Parse(util.DateFormat, se.Episodes[0].Released)
	nr, _ := strconv.Atoi(se.Season)

	var episodes []Episode

	for _, ep := range se.Episodes {
		epNr, _ := strconv.Atoi(ep.Episode)
		episodes = append(episodes, Episode{
			ImdbID:       ep.ImdbID,
			Nr:           int64(epNr),
			Title:        ep.Title,
			Watched:      false,
			DateWatched:  "",
			SeriesImdbID: imdbID,
			SeasonNr:     int64(nr),
		})
	}

	season := Season{
		Year:         int64(t.Year()),
		Nr:           int64(nr),
		SeriesImdbID: imdbID,
		Episodes:     episodes,
	}

	return season
}
