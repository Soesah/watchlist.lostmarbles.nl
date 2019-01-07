// +build appengine

package main

import (
	"net/http"

	"github.com/Soesah/watchlist.lostmarbles.nl/server"
	"google.golang.org/appengine"
)

func init() {
	r := server.Router()

	http.Handle("/", r)

	appengine.Main()
}
