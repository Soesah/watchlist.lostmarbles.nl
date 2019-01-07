package httpext

import (
	"encoding/json"
	"net/http"
)

func JSON(w http.ResponseWriter, body interface{}) {
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(body)
}

type Response struct {
	Error   string `json:"error,omitempty"`
	Message string `json:"message,omitempty"`
}

func SuccessAPI(w http.ResponseWriter, message string) {
	response := Response{
		Message: message,
	}

	JSON(w, response)
}

func AbortAPI(w http.ResponseWriter, message string, status int) {
	response := Response{
		Message: message,
	}

	w.Header().Add("Content-Type", "application/json")
	// need to set status after content type
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(response)
}
