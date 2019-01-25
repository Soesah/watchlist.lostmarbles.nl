package httpext

import (
	"encoding/json"
	"net/http"
)

// JSON encodes json and writes it to the writer
func JSON(w http.ResponseWriter, body interface{}) {
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(body)
}

// Response is a data type
type Response struct {
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

// SuccessDataAPI returns a json response with a message and data
func SuccessDataAPI(w http.ResponseWriter, message string, data interface{}) {
	response := Response{
		Message: message,
		Data:    data,
	}

	JSON(w, response)
}

// SuccessAPI returns a json response, with a message
func SuccessAPI(w http.ResponseWriter, message string) {
	response := Response{
		Message: message,
	}

	JSON(w, response)
}

// AbortAPI returns a json response, with an error and a message
func AbortAPI(w http.ResponseWriter, message string, status int) {
	response := Response{
		Message: message,
	}

	w.Header().Add("Content-Type", "application/json")
	// need to set status after content type
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(response)
}
