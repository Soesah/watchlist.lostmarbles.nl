package server

import (
	"net/http"
	"time"

	"github.com/Soesah/watchlist.lostmarbles.nl/server/handlers"
	"github.com/Soesah/watchlist.lostmarbles.nl/server/middlewares"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

// Router creates a new router with all the routes attached
func Router() *chi.Mux {

	// config.Init()

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

		r.Get("/list", handlers.NotSupportedAPIHandler)

		r.Route("/omdb", func(r chi.Router) {
			r.Get("/get", handlers.NotSupportedAPIHandler)
			r.Get("/search", handlers.NotSupportedAPIHandler)
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
