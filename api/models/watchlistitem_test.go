package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

var items = []WatchlistItem{
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 1", // 0
	},
	WatchlistItem{
		Type:   TypeSeries,
		ImdbID: "Item 2", // 1
		Seasons: []Season{
			Season{
				Year: 2017, // 2
				Episodes: []Episode{
					Episode{
						ImdbID: "Episode A", // 3
					},
					Episode{
						ImdbID: "Episode B", // 4
					},
					Episode{
						ImdbID: "Episode C", // 5
					},
				},
			},
			Season{
				Year: 2018, // 6
				Episodes: []Episode{
					Episode{
						ImdbID: "Episode A", // 7
					},
					Episode{
						ImdbID: "Episode B", // 8
					},
				},
			},
		},
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 3", // 9
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 4", // 10
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 5", // 11
	},
	WatchlistItem{
		Type:   TypeSeries,
		ImdbID: "Item 6", // 12
		Seasons: []Season{
			Season{
				Year: 2015, // 13
				Episodes: []Episode{
					Episode{
						ImdbID: "Episode A", // 14
					},
				},
			},
			Season{
				Year: 2016, // 15
				Episodes: []Episode{
					Episode{
						ImdbID: "Episode A", // 16
					},
					Episode{
						ImdbID: "Episode B", // 17
					},
				},
			},
		},
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 7", // 18
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 8", // 19
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 9", // 20
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 10", // 21
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 11", // 22
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 12", // 23
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 13", // 24
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 14", // 25
	},
	WatchlistItem{
		Type:   TypeMovie,
		ImdbID: "Item 15", // 26
	},
}

func TestSize(t *testing.T) {
	assert.Equal(t, items[0].Size(), 1)

	assert.Equal(t, items[1].Size(), 8)

	assert.Equal(t, items[5].Size(), 6)
}

func TestGetBatch(t *testing.T) {
	var set = WatchlistItemSet{
		Items: items,
		Limit: 10,
	}

	batch, index, _ := set.GetBatch(0)

	assert.Equal(t, 2, len(batch))

	batch, index, _ = set.GetBatch(index)
	assert.Equal(t, 4, len(batch))

	batch, index, _ = set.GetBatch(index)
	assert.Equal(t, 9, len(batch))

	batch, index, _ = set.GetBatch(index)
	assert.Equal(t, 0, len(batch))
}
func TestGetBatch2(t *testing.T) {
	var set = WatchlistItemSet{
		Items: items,
		Limit: 16,
	}

	batch, index, _ := set.GetBatch(0)

	assert.Equal(t, 5, len(batch))

	batch, index, _ = set.GetBatch(index)
	assert.Equal(t, 10, len(batch))

	batch, index, _ = set.GetBatch(index)
	assert.Equal(t, 0, len(batch))
}

func TestGetTitle(t *testing.T) {
	var item1 = WatchlistItem{
		Type:   TypeMovie,
		Name:   "Test 1",
		ImdbID: "Item1",
	}
	assert.Equal(t, item1.GetTitle(), "Test 1")
	var item2 = WatchlistItem{
		Type:   TypeMovie,
		Title:  "Test 2",
		ImdbID: "Item2",
	}
	assert.Equal(t, item2.GetTitle(), "Test 2")
}
