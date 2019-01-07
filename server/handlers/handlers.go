package handlers

import (
	"encoding/json"
	"html/template"
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/server/config"
	"github.com/Soesah/watchlist.lostmarbles.nl/server/httpext"
)

//RootHandler serves the index.html file
func RootHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	t, err := template.ParseFiles(config.Get().DistFolder + "/index.html")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tmpl := template.Must(t, err)

	tmpl.Execute(w, "")
}

//NotSupportedAPIHandler can be used a placehold when implementing apis
func NotSupportedAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	response := httpext.Response{
		Message: "API Not Supported",
	}

	data, err := json.Marshal(response)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNotFound)
	w.Write(data)
}
