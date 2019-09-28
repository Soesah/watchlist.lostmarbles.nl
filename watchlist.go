package main

import (
	"net/http"
	"time"

	"github.com/Soesah/watchlist.lostmarbles.nl/server/config"
	"github.com/Soesah/watchlist.lostmarbles.nl/server/handlers"
	"github.com/Soesah/watchlist.lostmarbles.nl/server/middlewares"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"google.golang.org/appengine"
)

func main() {

	config.Init()

	r := chi.NewRouter()

	// middleware
	r.Use(middleware.DefaultCompress)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))
	r.Use(middleware.RedirectSlashes)

	// home
	r.Get("/", handlers.RootHandler)

	r.Route("/api", func(r chi.Router) {

		r.Get("/list", handlers.GetList)
		r.Put("/series/{watched}/{imdbID}", handlers.ToggleSeriesWatched)
		r.Put("/series/{watched}/{imdbID}/season/{seasonNr}", handlers.ToggleSeasonWatched)
		r.Put("/series/{watched}/{imdbID}/season/{seasonNr}/episode/{episodeNr}", handlers.ToggleEpisodeWatched)
		r.Put("/{type}/watched/{imdbID}", handlers.ToggleItemWatched)

		r.Post("/movie", handlers.AddMovie)
		r.Post("/series", handlers.AddSeries)
		r.Post("/documentary", handlers.AddDocumentary)
		r.Post("/game", handlers.AddGame)
		r.Post("/franchise", handlers.AddFranchise)

		r.Get("/movie/{imdbID}", handlers.GetMovie)
		r.Get("/series/{imdbID}", handlers.GetSeries)
		r.Get("/documentary/{imdbID}", handlers.GetDocumentary)
		r.Get("/game/{imdbID}", handlers.GetGame)
		r.Get("/franchise/{imdbID}", handlers.GetFranchise)

		r.Put("/movie/{imdbID}", handlers.UpdateMovie)
		r.Put("/series/{imdbID}", handlers.UpdateSeries)
		r.Put("/documentary/{imdbID}", handlers.UpdateDocumentary)
		r.Put("/game/{imdbID}", handlers.UpdateGame)
		r.Put("/franchise/{imdbID}", handlers.UpdateFranchise)

		r.Delete("/movie/{imdbID}", handlers.DeleteMovie)
		r.Delete("/series/{imdbID}", handlers.DeleteSeries)
		r.Delete("/documentary/{imdbID}", handlers.DeleteDocumentary)
		r.Delete("/game/{imdbID}", handlers.DeleteGame)
		r.Delete("/franchise/{imdbID}", handlers.DeleteFranchise)

		r.Route("/omdb", func(r chi.Router) {
			r.Get("/get/{imdbID}", handlers.OMDBGet)
			r.Get("/seasons/{imdbID}", handlers.OMDBGetSeasons)
			r.Get("/search/{search}", handlers.OMDBSearch)
			r.Get("/search/{search}/{year}", handlers.OMDBSearch)
		})

		r.Route("/system", func(r chi.Router) {
			r.Post("/import", handlers.ImportData)
			r.Get("/import/clear", handlers.RemoveData)
			r.Get("/export", handlers.ExportData)
		})

	})

	// static
	r.Group(func(r chi.Router) {
		r.Use(middlewares.Cache(24 * time.Hour))
		handlers.ServeDir(r, "/js/*", http.Dir("./dist/js"))
		handlers.ServeDir(r, "/css/*", http.Dir("./dist/css"))
		handlers.ServeDir(r, "/fonts/*", http.Dir("./dist/fonts"))
		handlers.ServeFile(r, "/favicon.ico*", "./dist/favicon.ico")
		handlers.ServeFile(r, "/*", "./dist/index.html")
	})

	r.Group(func(r chi.Router) {
		r.Get("/*", handlers.RootHandler)
	})

	http.Handle("/", r)

	//log.Fatal(http.ListenAndServe(":8080", r))
	appengine.Main()
}
