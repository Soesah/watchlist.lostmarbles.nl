package server

import (
	"net/http"
	"time"

	"github.com/Soesah/watchlist.lostmarbles.nl/server/config"
	"github.com/Soesah/watchlist.lostmarbles.nl/server/handlers"
	"github.com/Soesah/watchlist.lostmarbles.nl/server/middlewares"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

// Router creates a new router with all the routes attached
func Router() *chi.Mux {

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

	// static
	r.Group(func(r chi.Router) {
		r.Use(middlewares.Cache(24 * time.Hour))
		handlers.ServeDir(r, "/static/*", http.Dir("./dist/static"))
	})

	r.Route("/api", func(r chi.Router) {

		r.Get("/list", handlers.GetList)
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

	r.Group(func(r chi.Router) {
		r.Get("/*", handlers.NotSupportedAPIHandler)
	})
	return r
}
