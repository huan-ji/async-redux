async-redux-generators
=============

Generators for async [RSA](https://github.com/kolodny/redux-standard-action)-compliant actions, and corresponding reducers. Generates three actions and three reducers for REQUESTED, RECEIVED, and FAILED state. Generators assume RESTful API and generates with certain conventions.

Reducer will activate loading and error states under camelCase names such as fetchAlbumLoading and fetchAlbumError. The entire store will also have loading state activated, see below for example.


## Install

```js
npm install --save async-redux-generators
```

## Usage

```js
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// fetchJSON is a wrapper around standard fetch that formats response and header/body to JSON
// Contains actions get, post, put, patch, and delete
import { asyncAction, fetchJSON, asyncReducer, asyncGenerators } from 'async-redux-generators';

// asyncAction(actionName, url, fetchFunction)
const fetchAlbumAction = asyncAction('FETCH_ALBUM', 'http://localhost:5000/albums', fetchJSON.get);
// asyncReducer(actionName)
const albumReducer = asyncReducer('FETCH_ALBUM');
// OR
// asyncGenerators(actionName, url, fetchFunction)
const { fetchAlbumAction, albumReducer } = asyncGenerators(
  'FETCH_ALBUM',
  'http://localhost:5000/albums',
  fetchJSON.get
)

const store = createStore(
  albumReducer,
  compose(
    applyMiddleware(thunk)
  )
);

// generatedAsyncAction(metaData)
fetchAlbumAction({ id: 5 });// If id is provided in metaData, it will be appended to the url (url/id)

// Dispatch FETCH_ALBUM_REQUESTED
// Runs async function to fetch album
// store.loading = true
// store.fetchAlbumLoading = true

// Done fetching
// Dispatch FETCH_ALBUM_RECEIVED
// store.loading = false
// store.fetchAlbumLoading = false
// album with id of 5 will appear in the store

// Error Occurs
// Dispatch FETCH_ALBUM_FAILED
// store.loading = false
// store.fetchAlbumLoading = false
// store.fetchAlbumError = Error Object
```
