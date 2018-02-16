import WatchItemFactory from 'services/WatchItemFactory';

let WatchListItem = Vue.component('watch-list-item', {
  functional: true,
  render: function (createElement, context) {
    const item = context.props.item;

    return createElement('li', {
      class: [
        'item movie',
        {'movie-watched': item.watched}
      ]
    }, [
      createElement('router-link', {
        props: {
          to: '/view/' + item.path
        }
      }, [
        createElement('h6', item.name),
        createElement('span', {
          class: 'bracketed',
          domProps: {
            innerHTML: item.year
          }
        }),
        createElement('i',{
          class: 'icon icon-' + WatchItemFactory.getTypeName(item).toLowerCase(),
          on: {
            click: (evt) => {
              context.parent.$store.dispatch('toggleWatched', item);
              evt.preventDefault();
              evt.stopPropagation();
            }
          }
        })
      ])
    ]);
  }
});