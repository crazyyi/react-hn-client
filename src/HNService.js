import api from './network/api';

export function fetchStoriesUsingTopStoryIDs(topStoryIDs, startIndex, amountToAdd) {
    const rowsData = [];
    // const endIndex = (startIndex + amountToAdd) < topStoryIDs.length ? (startIndex + amountToAdd) : topStoryIDs.length;

    let before = Date.now();
    console.log('startIndex:' + startIndex);
    const array = topStoryIDs.slice(startIndex, startIndex + amountToAdd);
    if (array.length > 0) {
      return Promise.all(array.map(id => 
        fetch(api.HN_ITEM_ENDPOINT + id + '.json')
        .then(res => res.json())
        .then(topStory => {
          // topStory.count = startIndex + 1;
          rowsData.push(topStory);
          startIndex++;
          const elapsed = (Date.now() - before);
          console.log('time elasped: ' + elapsed + 'ms');
          before = Date.now();
          return topStory;
        })
      )).then(values => {
        return values; // return an array of items
      })
    } else {
      return;
    }
    
}

export function fetchItemDetail(id, cb) {
  return fetch(api.HN_ITEM_ENDPOINT + id + '.json')
  .then(res => res.json())
  .then(response => {
    cb(response);
    if (response.hasOwnProperty('kids')) {
      return fetchStoriesUsingTopStoryIDs(response.kids, 0, response.kids.length);
    } 
    return [];
  })
}

export function getUserProfile(id) {
  return fetch(api.HN_USER_ENDPOINT + id + '.json')
  .then(res => res.json())
  .then(response => {
    return response;
  });
}