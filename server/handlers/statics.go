package handlers

import (
	"net/http"
	"strings"

	"github.com/go-chi/chi"
)

func ServeDir(r chi.Router, path string, root http.Dir) {
	filePath := path
	if strings.HasSuffix(filePath, "*") {
		filePath = filePath[:len(filePath)-1]
	}
	fs := http.StripPrefix(filePath, http.FileServer(root))

	r.Get(path, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fs.ServeHTTP(w, r)
	}))
}

func ServeFile(r chi.Router, path string, filePath string) {
	r.Get(path, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filePath)
	}))
}
