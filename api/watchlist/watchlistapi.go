package watchlist

import (
	"errors"
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/util"
)

const (
	typeMOVIE       = "movie"
	typeSERIES      = "series"
	typeDOCUMENTARY = "documentary"
	typeGAME        = "game"
	typeFRANCHISE   = "franchise"
	typeEPISODE     = "episode"
)

var (
	errMovieNotFound       = errors.New("Movie not found")
	errSeriesNotFound      = errors.New("Series not found")
	errDocumentaryNotFound = errors.New("Documentary not found")
	errGameNotFound        = errors.New("Game not found")
	errFranchiseNotFound   = errors.New("Franchise not found")
)

// GetWatchList returns the whole watch list
func GetWatchList(r *http.Request) ([]interface{}, error) {
	list := make([]interface{}, 0)
	empty := make([]string, 0)

	// movies
	movies, err := LoadMovies(r)
	if err != nil {
		return list, err
	}

	for _, movie := range movies {
		if len(movie.Actors) == 0 {
			movie.Actors = empty
		}
		list = append(list, movie)
	}

	// series
	series, err := LoadSeries(r)
	if err != nil {
		return list, err
	}

	for _, series := range series {
		list = append(list, series)
	}

	// documentaries
	documentaries, err := LoadDocumentaries(r)
	if err != nil {
		return list, err
	}

	for _, documentary := range documentaries {
		if len(documentary.Actors) == 0 {
			documentary.Actors = empty
		}
		list = append(list, documentary)
	}

	// games
	games, err := LoadGames(r)
	if err != nil {
		return list, err
	}

	for _, game := range games {
		if len(game.Actors) == 0 {
			game.Actors = empty
		}
		list = append(list, game)
	}

	// franchises
	franchises, err := LoadFranchises(r)
	if err != nil {
		return list, err
	}

	for _, franchise := range franchises {
		if len(franchise.Items) == 0 {
			franchise.Items = empty
		}
		list = append(list, franchise)
	}

	return list, nil
}

// ToggleItemWatched toggles a movie, documentary or game to watched
func ToggleItemWatched(itemType string, imdbID string, r *http.Request) (interface{}, string, error) {

	var item interface{}
	var watched string

	if itemType == typeMOVIE {
		var updated []models.Movie
		movies, err := LoadMovies(r)

		if err != nil {
			return item, "", err
		}

		for _, item := range movies {
			if item.ImdbID == imdbID {
				item.Watched = !item.Watched
				if item.Watched {
					item.DateWatched = util.DateNow()
					watched = "watched"
				} else {
					watched = "not watched"
				}
			}
			updated = append(updated, item)
		}

		err = StoreMovies(updated, r)

		if err != nil {
			return item, "", err
		}
	}

	if itemType == typeDOCUMENTARY {
		var updated []models.Documentary
		documentaries, err := LoadDocumentaries(r)

		if err != nil {
			return item, "", err
		}

		for _, item := range documentaries {
			if item.ImdbID == imdbID {
				item.Watched = !item.Watched
				if item.Watched {
					item.DateWatched = util.DateNow()
					watched = "watched"
				} else {
					watched = "not watched"
				}
			}
			updated = append(updated, item)
		}

		err = StoreDocumentaries(updated, r)

		if err != nil {
			return item, "", err
		}
	}

	if itemType == typeGAME {
		var updated []models.Game
		games, err := LoadGames(r)

		if err != nil {
			return item, "", err
		}

		for _, item := range games {
			if item.ImdbID == imdbID {
				item.Played = !item.Played
				if item.Played {
					item.DatePlayed = util.DateNow()
					watched = "played"
				} else {
					watched = "not played"
				}
			}
			updated = append(updated, item)
		}

		err = StoreGames(updated, r)

		if err != nil {
			return item, "", err
		}
	}

	return item, watched, nil
}

// ToggleSeriesWatched toggles an entire series to watched/unwatched
func ToggleSeriesWatched(imdbID string, set bool, r *http.Request) (models.Series, string, error) {
	var updated []models.Series
	var series models.Series
	watched := "not watched"

	seriess, err := LoadSeries(r)

	if err != nil {
		return series, watched, err
	}

	for _, s := range seriess {
		if s.ImdbID == imdbID {
			series = s
			var updatedSeasons []models.Season

			for _, se := range s.Seasons {
				season := models.Season{
					Year:         se.Year,
					Nr:           se.Nr,
					SeriesImdbID: se.SeriesImdbID,
				}
				var updatedEpisodes []models.Episode
				for _, ep := range se.Episodes {
					episode := models.Episode{
						ImdbID:       ep.ImdbID,
						Nr:           ep.Nr,
						Title:        ep.Title,
						Watched:      set,
						DateWatched:  ep.DateWatched,
						SeriesImdbID: ep.SeriesImdbID,
						SeasonNr:     ep.SeasonNr,
					}
					if set {
						episode.DateWatched = util.DateNow()
						watched = "watched"
					}
					updatedEpisodes = append(updatedEpisodes, episode)
				}
				season.Episodes = updatedEpisodes
				updatedSeasons = append(updatedSeasons, season)
			}
			series.Seasons = updatedSeasons
			updated = append(updated, series)
		} else {
			updated = append(updated, s)
		}
	}

	if series.ImdbID == "" {
		return series, "", errSeriesNotFound
	}

	err = StoreSeries(updated, r)

	return series, watched, nil
}

// ToggleSeasonWatched toggles an entire season to watched/unwatched
func ToggleSeasonWatched(imdbID string, seasonNr int64, set bool, r *http.Request) (models.Series, string, error) {
	var updated []models.Series
	var series models.Series
	watched := "not watched"

	seriess, err := LoadSeries(r)

	if err != nil {
		return series, watched, err
	}

	for _, s := range seriess {
		if s.ImdbID == imdbID {
			series = s
			var updatedSeasons []models.Season

			for _, se := range s.Seasons {
				if se.Nr == seasonNr {
					season := models.Season{
						Year:         se.Year,
						Nr:           se.Nr,
						SeriesImdbID: se.SeriesImdbID,
					}
					var updatedEpisodes []models.Episode
					for _, ep := range se.Episodes {
						episode := models.Episode{
							ImdbID:       ep.ImdbID,
							Nr:           ep.Nr,
							Title:        ep.Title,
							Watched:      set,
							DateWatched:  ep.DateWatched,
							SeriesImdbID: ep.SeriesImdbID,
							SeasonNr:     ep.SeasonNr,
						}
						if set {
							episode.DateWatched = util.DateNow()
							watched = "watched"
						}
						updatedEpisodes = append(updatedEpisodes, episode)
					}
					season.Episodes = updatedEpisodes
					updatedSeasons = append(updatedSeasons, season)
				} else {
					updatedSeasons = append(updatedSeasons, se)
				}
			}
			series.Seasons = updatedSeasons
			updated = append(updated, series)
		} else {
			updated = append(updated, s)
		}
	}

	if series.ImdbID == "" {
		return series, "", errSeriesNotFound
	}

	err = StoreSeries(updated, r)

	return series, watched, nil
}

// ToggleEpisodeWatched toggles an episode to watched/unwatched
func ToggleEpisodeWatched(imdbID string, seasonNr int64, episodeNr int64, r *http.Request) (models.Series, string, error) {
	var updated []models.Series
	var series models.Series
	watched := "not watched"

	seriess, err := LoadSeries(r)

	if err != nil {
		return series, watched, err
	}

	for _, s := range seriess {
		if s.ImdbID == imdbID {
			series = s
			var updatedSeasons []models.Season

			for _, se := range s.Seasons {
				if se.Nr == seasonNr {
					season := models.Season{
						Year:         se.Year,
						Nr:           se.Nr,
						SeriesImdbID: se.SeriesImdbID,
					}
					var updatedEpisodes []models.Episode
					for _, ep := range se.Episodes {
						if ep.Nr == episodeNr {
							episode := models.Episode{
								ImdbID:       ep.ImdbID,
								Nr:           ep.Nr,
								Title:        ep.Title,
								Watched:      !ep.Watched,
								DateWatched:  ep.DateWatched,
								SeriesImdbID: ep.SeriesImdbID,
								SeasonNr:     ep.SeasonNr,
							}
							if episode.Watched {
								episode.DateWatched = util.DateNow()
								watched = "watched"
							}
							updatedEpisodes = append(updatedEpisodes, episode)
						} else {
							updatedEpisodes = append(updatedEpisodes, ep)
						}
					}
					season.Episodes = updatedEpisodes
					updatedSeasons = append(updatedSeasons, season)
				} else {
					updatedSeasons = append(updatedSeasons, se)
				}
			}
			series.Seasons = updatedSeasons
			updated = append(updated, series)
		} else {
			updated = append(updated, s)
		}
	}

	if series.ImdbID == "" {
		return series, "", errSeriesNotFound
	}

	err = StoreSeries(updated, r)

	return series, watched, nil
}

// AddMovie adds a movie
func AddMovie(movie models.Movie, r *http.Request) (models.Movie, error) {
	movies, err := LoadMovies(r)

	if err != nil {
		return movie, err
	}

	movies = append(movies, movie)

	StoreMovies(movies, r)

	if err != nil {
		return movie, err
	}

	return movie, nil
}

// AddSeries adds a series
func AddSeries(series models.Series, r *http.Request) (models.Series, error) {
	seriess, err := LoadSeries(r)

	if err != nil {
		return series, err
	}

	seriess = append(seriess, series)

	StoreSeries(seriess, r)

	if err != nil {
		return series, err
	}

	return series, nil
}

// AddDocumentary adds a documentary
func AddDocumentary(documentary models.Documentary, r *http.Request) (models.Documentary, error) {
	documentaries, err := LoadDocumentaries(r)

	if err != nil {
		return documentary, err
	}

	documentaries = append(documentaries, documentary)

	StoreDocumentaries(documentaries, r)

	if err != nil {
		return documentary, err
	}

	return documentary, nil
}

// AddGame adds a game
func AddGame(game models.Game, r *http.Request) (models.Game, error) {
	games, err := LoadGames(r)

	if err != nil {
		return game, err
	}

	games = append(games, game)

	StoreGames(games, r)

	if err != nil {
		return game, err
	}

	return game, nil
}

// AddFranchise adds a franchise
func AddFranchise(franchise models.Franchise, r *http.Request) (models.Franchise, error) {
	franchises, err := LoadFranchises(r)

	if err != nil {
		return franchise, err
	}

	franchises = append(franchises, franchise)

	StoreFranchises(franchises, r)

	if err != nil {
		return franchise, err
	}

	return franchise, nil
}

// GetMovie returns a movie
func GetMovie(imdbID string, r *http.Request) (models.Movie, error) {
	var movie models.Movie
	movies, err := LoadMovies(r)

	if err != nil {
		return movie, err
	}

	for _, item := range movies {
		if item.ImdbID == imdbID {
			movie = item
		}
	}

	if movie.Title == "" {
		return movie, errMovieNotFound
	}

	return movie, nil
}

// GetSeries returns a series
func GetSeries(imdbID string, r *http.Request) (models.Series, error) {
	var series models.Series
	seriess, err := LoadSeries(r)

	if err != nil {
		return series, err
	}

	for _, item := range seriess {
		if item.ImdbID == imdbID {
			series = item
		}
	}

	if series.Title == "" {
		return series, errSeriesNotFound
	}

	return series, nil
}

// GetDocumentary returns a documentary
func GetDocumentary(imdbID string, r *http.Request) (models.Documentary, error) {
	var documentary models.Documentary
	documentaries, err := LoadDocumentaries(r)

	if err != nil {
		return documentary, err
	}

	for _, item := range documentaries {
		if item.ImdbID == imdbID {
			documentary = item
		}
	}

	if documentary.Title == "" {
		return documentary, errDocumentaryNotFound
	}

	return documentary, nil
}

// GetGame returns a documentary
func GetGame(imdbID string, r *http.Request) (models.Game, error) {
	var game models.Game
	games, err := LoadGames(r)

	if err != nil {
		return game, err
	}

	for _, item := range games {
		if item.ImdbID == imdbID {
			game = item
		}
	}

	if game.Title == "" {
		return game, errGameNotFound
	}

	return game, nil
}

// GetFranchise returns a documentary
func GetFranchise(imdbID string, r *http.Request) (models.Franchise, error) {
	var franchise models.Franchise
	franchises, err := LoadFranchises(r)

	if err != nil {
		return franchise, err
	}

	for _, item := range franchises {
		if item.ImdbID == imdbID {
			franchise = item
		}
	}

	if franchise.Name == "" {
		return franchise, errFranchiseNotFound
	}

	return franchise, nil
}

// UpdateMovie returns a movie
func UpdateMovie(movie models.Movie, r *http.Request) (models.Movie, error) {
	var updated []models.Movie
	movies, err := LoadMovies(r)

	if err != nil {
		return movie, err
	}

	found := false
	for _, item := range movies {
		if item.ImdbID == movie.ImdbID {
			updated = append(updated, movie)
			found = true
		} else {
			updated = append(updated, item)
		}
	}

	if found == false {
		return movie, errMovieNotFound
	}

	err = StoreMovies(updated, r)

	if err != nil {
		return movie, err
	}

	return movie, nil
}

// UpdateSeries updates a series
func UpdateSeries(series models.Series, r *http.Request) (models.Series, error) {
	var err error

	// remove current data
	if series.PreviousImdbID != "" {
		err = DeleteSeries(series.PreviousImdbID, r)
	} else {
		err = DeleteSeries(series.ImdbID, r)
	}

	if err != nil {
		return series, err
	}

	// re-add updated data
	return AddSeries(series, r)
}

// UpdateDocumentary returns a documentary
func UpdateDocumentary(documentary models.Documentary, r *http.Request) (models.Documentary, error) {
	var updated []models.Documentary
	documentaries, err := LoadDocumentaries(r)

	if err != nil {
		return documentary, err
	}

	found := false
	for _, item := range documentaries {
		if item.ImdbID == documentary.ImdbID {
			updated = append(updated, documentary)
			found = true
		} else {
			updated = append(updated, item)
		}
	}

	if found == false {
		return documentary, errDocumentaryNotFound
	}

	err = StoreDocumentaries(updated, r)

	if err != nil {
		return documentary, err
	}

	return documentary, nil
}

// UpdateGame returns a movie
func UpdateGame(game models.Game, r *http.Request) (models.Game, error) {
	var updated []models.Game
	games, err := LoadGames(r)

	if err != nil {
		return game, err
	}

	found := false
	for _, item := range games {
		if item.ImdbID == game.ImdbID {
			updated = append(updated, game)
			found = true
		} else {
			updated = append(updated, item)
		}
	}

	if found == false {
		return game, errGameNotFound
	}

	err = StoreGames(updated, r)

	if err != nil {
		return game, err
	}

	return game, nil
}

// UpdateFranchise returns a movie
func UpdateFranchise(franchise models.Franchise, r *http.Request) (models.Franchise, error) {
	var updated []models.Franchise
	franchises, err := LoadFranchises(r)

	if err != nil {
		return franchise, err
	}

	found := false
	for _, item := range franchises {
		if item.ImdbID == franchise.ImdbID {
			updated = append(updated, franchise)
			found = true
		} else {
			updated = append(updated, item)
		}
	}

	if found == false {
		return franchise, errFranchiseNotFound
	}

	err = StoreFranchises(updated, r)

	if err != nil {
		return franchise, err
	}

	return franchise, nil
}

// DeleteMovie deletes a movie
func DeleteMovie(imdbID string, r *http.Request) error {

	var updated []models.Movie
	movies, err := LoadMovies(r)

	if err != nil {
		return err
	}

	found := false
	for _, item := range movies {
		if item.ImdbID == imdbID {
			found = true
		} else {
			updated = append(updated, item)
		}
	}

	if found == false {
		return errMovieNotFound
	}

	err = StoreMovies(updated, r)

	if err != nil {
		return err
	}

	return nil
}

// DeleteSeries deletes a series
func DeleteSeries(imdbID string, r *http.Request) error {

	var updated []models.Series
	series, err := LoadSeries(r)

	if err != nil {
		return err
	}

	found := false
	for _, item := range series {
		if item.ImdbID == imdbID {
			found = true
		} else {
			updated = append(updated, item)
		}
	}

	if found == false {
		return errSeriesNotFound
	}

	err = StoreSeries(updated, r)

	if err != nil {
		return err
	}

	return nil
}

// DeleteDocumentary deletes a documentary
func DeleteDocumentary(imdbID string, r *http.Request) error {
	var updated []models.Documentary
	documentaries, err := LoadDocumentaries(r)

	if err != nil {
		return err
	}

	found := false
	for _, item := range documentaries {
		if item.ImdbID == imdbID {
			found = true
		} else {
			updated = append(updated, item)
		}
	}

	if found == false {
		return errMovieNotFound
	}

	err = StoreDocumentaries(updated, r)

	if err != nil {
		return err
	}

	return nil
}

// DeleteGame deletes a game
func DeleteGame(imdbID string, r *http.Request) error {
	var updated []models.Game
	games, err := LoadGames(r)

	if err != nil {
		return err
	}

	found := false
	for _, item := range games {
		if item.ImdbID == imdbID {
			found = true
		} else {
			updated = append(updated, item)
		}
	}

	if found == false {
		return errGameNotFound
	}

	err = StoreGames(updated, r)

	if err != nil {
		return err
	}

	return nil
}

// DeleteFranchise deletes a franchise
func DeleteFranchise(imdbID string, r *http.Request) error {
	var updated []models.Franchise
	franchises, err := LoadFranchises(r)

	if err != nil {
		return err
	}

	found := false
	for _, item := range franchises {
		if item.ImdbID == imdbID {
			found = true
		} else {
			updated = append(updated, item)
		}
	}

	if found == false {
		return errFranchiseNotFound
	}

	err = StoreFranchises(updated, r)

	if err != nil {
		return err
	}

	return nil
}
