#Watchlist App

Just another movie/series watch list app.

Just for fun, written in es6, using Angular and a little php to maintain a movie/documentary/series watchlist.

##To do

- <s>add a favicon</s>
- <s>autofocus add form</s>
- restyle add button
- <s>mark items as watched</s>
- be able to score items
    - You could use 1-5 stars, but always get a bit confused on what they mean.
        - this always kinda puts you in mind to score one movie against another, wanting to give a star more because it was slightly better. This makes little sense as a scale.
    - Perhaps saying something like "Likeable, Good, Awesome, Forgettable" would be more meaningful. Showing this label with 0 - 3 stars, blocks, or a color coded scale, would be nice.
- <s>edit item (fix titles, add season)</s>
- <s>remove item (doubles)</s>
- Make editing/deleting work with imdbId?
    - give items without imdbId a tempId, which is recognizable as a temporary id (typename + nr)
- <s>scroll to/near item after edit/delete</s>
- <s>fix year being integer</s>
- <s>fix actors being array</s>
- 'fix' display of actors in edit
- <s>add a check (search by name as you type) to prevent doubles from being added</s>
- <s>implement 'view' view</s>
    - <s>series have seasons, episodes</s>
    - movies have sequels, prequels?
    - documentaries have nothing? urls?
    - games have publishers, genre
    - omdb is oddly not complete on episodes, so you'll need to manual editing there.
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
- can you do something to group movies, or to make movies a _sequel_?
    - would items need an ID in that case?
    - would make it easier to order them by date
    - if you use a new class Sequel, would you also need to use Prequel? (typename can still be movie)
    - implement drag for ordering movies in their sequence (use order prop)
    - filter on movies when searching for sequels, filter out _this_ movie, and already related movies
    - implement yielding more results?
    - Would it be easier to determine a franchise, this would allow you to add any kind of items to the list. It would be a list of ids and its order. You would have to re-classify the items. That code is complicated and not very helpful
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
    ```function *tens() {
         let list = [1,2,3,4,5,6,7,8,9,10],
             index = 0;
         while (list.slice(index, index + 2).length) {
           yield list.slice(index, index + 2).toString();
           index = index + 2;
         }
        }```
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
-<s>add admin panel, to bulk update items (length, director, plot)</s>
-Show failures in request (search, get info, update?)