package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

var items = []WatchlistItem{
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 1",
	},
	WatchlistItem{
		Type:   TypeSeries,
		ImdbID: "Item 2",
		Seasons: []Season{
			Season{
				Year: 2017,
				Episodes: []Episode{
					Episode{
						ImdbID: "Episode A",
					},
					Episode{
						ImdbID: "Episode B",
					},
					Episode{
						ImdbID: "Episode C",
					},
				},
			},
			Season{
				Year: 2018,
				Episodes: []Episode{
					Episode{
						ImdbID: "Episode A",
					},
					Episode{
						ImdbID: "Episode B",
					},
				},
			},
		},
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 3",
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 4",
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 5",
	},
	WatchlistItem{
		Type:   TypeSeries,
		ImdbID: "Item 6",
		Seasons: []Season{
			Season{
				Year: 2015,
				Episodes: []Episode{
					Episode{
						ImdbID: "Episode A",
					},
				},
			},
			Season{
				Year: 2016,
				Episodes: []Episode{
					Episode{
						ImdbID: "Episode A",
					},
					Episode{
						ImdbID: "Episode B",
					},
				},
			},
		},
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 7",
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 8",
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 9",
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 10",
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 11",
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 12",
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 13",
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 14",
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 15",
	},
}

var set = WatchlistItemSet{
	Items: items,
	Limit: 10,
}

func TestGetBatch(t *testing.T) {
	batch, index, _ := set.GetBatch(0)

	assert.Equal(t, 2, len(batch))

	batch, index, _ = set.GetBatch(index)
	assert.Equal(t, 4, len(batch))

	batch, index, _ = set.GetBatch(index)
	assert.Equal(t, 9, len(batch))

	batch, index, _ = set.GetBatch(index)
	assert.Equal(t, 0, len(batch))
}
