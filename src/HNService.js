import api from './network/api';
import {AMOUNT_TO_ADD} from './utils/Constants';

export function fetchStoriesUsingTopStoryIDs(topStoryIDs, startIndex, amountToAdd) {
    const rowsData = [];
    let before = Date.now();
    console.log('startIndex:' + startIndex);
    const array = topStoryIDs.slice(startIndex, startIndex + amountToAdd);
    if (array.length > 0) {
      return Promise.all(array.map(id => 
        fetch(api.HN_ITEM_ENDPOINT + id + '.json')
        .then(res => res.json())
        .then(topStory => {
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

export function fetchFromURL(apiQuery, page, startIndex, callback) {
  return fetch(apiQuery)
    .then(res => res.json())
    .then(topStoryIDs => fetchStoriesUsingTopStoryIDs(topStoryIDs, startIndex, AMOUNT_TO_ADD))
    .then(rowsData => {
      callback(rowsData);
    });
}