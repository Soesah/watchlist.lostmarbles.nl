#Watchlist App

Just another movie/series watch list app.

Just for fun, written in es6, using Angular and a little php to maintain a movie/documentary/series watchlist.

##To do

- <s>add a favicon</s>
- <s>autofocus add form</s>
- restyle add button
- <s>mark items as watched</s>
- be able to score items
- <s>edit item (fix titles, add season)</s>
- <s>remove item (doubles)</s>
- Make editing/deleting work with imdbId?
- <s>scroll to/near item after edit/delete</s>
- <s>fix year being integer</s>
- <s>fix actors being array</s>
- 'fix' display of actors in edit
- <s>add a check (search by name as you type) to prevent doubles from being added</s>
- <s>implement 'view' view</s>
    - movies have sequels, prequels?
    - series have seasons, episodes
    - documentaries have nothing? urls?
    - games have publishers, genre
- make more sense of seasons watched on the main overview
    - perhaps by showing something like 2/3 with the year, or greyed out the years you have watched
- <s>only deploy from and commit versions on master
    - do checks
    - git checkout master
    - merge --squash develop, update version
    - update list
    - commit
    - deploy
    - git push master
    - git checkout develop</s>
    - sed  '1,10 w commit_message2' commit_message  (move lines from one file to the next)
- add # episodes to season? or add an actual list... with titles?
- can you do something to group movies, or to make movies a _sequel_?
    - would items need an ID in that case?
    - would make it easier to order them by date
    - if you use a new class Sequel, would you also need to use Prequel? (typename can still be movie)
    - implement drag for ordering movies in their sequence
- <s>use https://www.omdbapi.com/ to quickly find the year
    - can be used to retrieve episode names for series
    - provide imdbId, a nice addition and useful for tracking sequels/groups of movies
    - since you want to save imdbId, you _have to do the request_, either before saving if not all data is present, or when search is pressed with the title. 
    - can be used, via search to add multiple movies at once, this should be another option, and show suggestions, after which more data will need to be fetched
    - one: when a title has been entered, and add is pressed, perform a search to complete the data, if it is not complete. (show that a request is being made, show data being completed, and correct: you need to confirm this)
    - two: enter a (half) title and do a search, show request, choose from a list, complete data with imdbId request, and press add
    - three enter all data on your own, show request, no data found.</s>
- automatically choose a single result when searching
- add filter by year, svg slider?
- <s>add filter by name</s>
    - add base class to provide name without strange characters, or provide simplified names in some cases?
- better layout for filters
    - remove all, and make multiple items active at once, turning them off and on
- <s>see a total number of items, also when filtered</s>
- add <s>loading</s>/saving indicator
- <s>show total count on search results</s>, can you use `yield` to fetch more (next())
- disable form while saving
- button focus style
- add a date-added property, so you can see recently added movies?
- <s>also filter on actors when searching?</s> Not until you can see the name
- add a filter highlighter? It slows things down, considerably
- use checkbox icons on hover over item type icon
- you should load all seasons for a series (again, use yield to load season by season)
- show a nicer (message) progress indicator when searching, finding, getting...
    - searching omdb
    - completing data
    - fetching season 1 episodes
- loading spinner doesn't always show... (is this because things are still loading, or because the list is rendering?)
- filter multiple types
- <s>add 'view' view</s>
    - <s>add link to imdb somewhere (to verify)</s>