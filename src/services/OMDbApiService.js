import OMDbObject from 'models/OMDbObjectModel';
import OMDbResults from 'models/OMDbResultsModel';

class OMDbApiService {
  constructor() {
    this.url = 'http://www.omdbapi.com/';
    this.apiKey = '3e5351f0'; // this isn't very nice, might be nicer to do these request on the server to protect the api key.
  }

  request(url, Model) {
    return $q(function(resolve, reject) {
      $http.get(url).then(function(response) {
        let data = response.data;
        if (data.Response === 'True') {
          resolve(new Model(data));
        } else {
          reject(data);
        }
      }, function(response) {
         reject(response);
      });
    });
  }
  search(name, year) {
    return this.request(this.url + '?s=' + name + (year ? '&y=' + year : '') + '&apikey=' + this.apiKey, OMDbResults);
  }

  lucky(name) {
    return this.request(this.url + '?t=' + name + '&y=&plot=short&r=json&apikey=' + this.apiKey, OMDbObject);
  }

  get(id) {
    return this.request(this.url + '?i=' + id + '&r=json&apikey=' + this.apiKey, OMDbObject);
  }

  getSeason(id, nr) {
    return this.request(this.url + '?i=' + id + '&Season=' + nr + '&r=json&apikey=' + this.apiKey, OMDbObject);
  }

  updateMovie(item, props) {
    return this.get(item.imdbId).then(function(obj){
      props.forEach(function(prop) {
        item[prop.to] = obj[prop.from];
      });
    });
  }

  isUpdatedMovie(item, props) {
    let updated = true;
    props.forEach(function(prop) {
      updated = item[prop.to] !== null && updated;
    });
    return updated;
  }

  updateSeries(item) {
    let _this = this;
    return $q(function(resolve, reject) {
      _this.get(item.imdbId).then(function(obj){
        if (obj.imdbId) {
          item.imdbId = obj.imdbId
          item.name = obj.title
          item.plot = obj.plot
          item.actors = obj.actors.split(', ');
          resolve({
            series: item,
            seasons: obj.seasons
          });
        } else {
          reject();
        }
      });
    });
  }

  updateSeason(series, nr) {
    let _this = this,
        season = series.getSeason(nr);

    if (!season) {
      season = series.addSeason();
    }
    season.nr = nr;

    return $q(function(resolve, reject) {
      _this.getSeason(series.imdbId, nr).then(function(obj){
        if (obj.title) {
          // update existing episodes, or create new ones

          season.episodes = _.map(obj.episodes, function(ep, index) {
            let episode = season.getEpisode(ep.imdbId);

            // update season year
            if (index === 0) {
              season.year = parseInt(ep.Released);
            }

            // update the episode
            if (episode) {
              episode.imdbId = ep.imdbID;
              episode.nr = parseInt(ep.Episode);
              episode.title = ep.Title;
            } else {
              // or create a new one
              episode = season.createEpisode(ep.imdbID, parseInt(ep.Episode), ep.Title);
            }
            return episode;
          });
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  getInternalType(type) {
    switch(type) {
      case 'movie':
        return 0;
      case 'series':
        return 1;
      case 'game':
        return 3;
    }
  }
}