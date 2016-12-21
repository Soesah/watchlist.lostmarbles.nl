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
- only deploy from and commit versions on master
    - do checks
    - git checkout master
    - merge --squash develop, update version
    - update list
    - commit
    - deploy
    - git push master
    - git checkout develop
- add # episodes to season? or add an actual list... with titles?
- add a check (search by name as you type) to prevent doubles from being added
- can you do something to group movies, or to make movies a _sequel_?
    - would items need an ID in that case?
- add games? (not really _watch_list any more, is it)
- use https://www.npmjs.com/package/imdb-api to quickly find the year
- add filter by year, svg slider?
- <s>add filter by name</s>
- better layout for filters
- see a total number of items, also when filtered
- add loading/saving indicator
- disable form while saving