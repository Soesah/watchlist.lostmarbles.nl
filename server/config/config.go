package config

import (
	"log"

	"github.com/caarlos0/env"
)

// Config provides some config options
type Config struct {
	ENVIRONMENT string `env:"ENVIRONMENT"`
	DistFolder  string `env:"DIST_FOLDER"`
	OMDBApiKey  string `env:"OMDB_KEY"`
}

var conf = Config{}

// Init reads the configuration and sets the keys to the values in app.yaml
func Init() {
	err := env.Parse(&conf)
	if err != nil {
		log.Fatal(err)
	}
}

// Get provides access
func Get() Config {
	return conf
}
