#Watchlist App

Just another movie/series watch list app.

Just for fun, written in es6, using Angular and a little php to maintain a movie/documentary/series watchlist.

##To do

- add a favicon
- <s>autofocus add form</s>
- restyle add button
- mark items as watched
- be able to score items
- edit item (fix titles, add season)
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
- add # episodes to season? or add an actual list... with titles?
- add a check (search by name as you type) to prevent doubles from being added
- can you do something to group movies, or to make movies a _sequel_?
    - would items need an ID in that case?
- use https://www.omdbapi.com/ to quickly find the year
    - can be used to retrieve episode names for series
    - provide imdbId, a nice addition and useful for tracking sequels/groups of movies
    - since you want to save imdbId, you _have to do the request_, either before saving if not all data is present, or when search is pressed with the title. 
    - can be used, via search to add multiple movies at once, this should be another option, and show suggestions, after which more data will need to be fetched
    - one: when a title has been entered, and add is pressed, perform a search to complete the data, if it is not complete. (show that a request is being made, show data being completed, and correct: you need to confirm this)
    - two: enter a (half) title and do a search, show request, choose from a list, complete data with imdbId request, and press add
    - three enter all data on your own, show request, no data found.
- add filter by year, svg slider?
- <s>add filter by name</s>
    - add base class to provide name without strange characters, or provide simplified names in some cases?
- better layout for filters
    - remove all, and make multiple items active at once, turning them off and on
- see a total number of items, also when filtered
- add loading/saving indicator
- show total count on search results, can you use `yield` to fetch more (next())
- disable form while saving
- button focus style