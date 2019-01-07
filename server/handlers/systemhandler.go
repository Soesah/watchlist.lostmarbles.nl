package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/api/models"
	"github.com/Soesah/watchlist.lostmarbles.nl/api/system"
	"github.com/Soesah/watchlist.lostmarbles.nl/server/httpext"
)

// ImportData is used to import hours
func ImportData(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var data []models.WatchlistItem
	err := decoder.Decode(&data)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusBadRequest)
		return
	}

	data, err = system.ImportData(data, r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpext.JSON(w, data)
}

// RemoveData is used to import hours
func RemoveData(w http.ResponseWriter, r *http.Request) {
	err := system.ClearAllItems(r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpext.SuccessAPI(w, "Items removed")
}

// ExportData is used to import hours
func ExportData(w http.ResponseWriter, r *http.Request) {
	data, err := system.ExportData(r)

	if err != nil {
		httpext.AbortAPI(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpext.JSON(w, data)
}