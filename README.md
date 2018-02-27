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
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

import { asyncAction, fetchJSON, asyncReducer } from 'async-redux';

const albumAction = asyncAction('FETCH_ALBUM', 'http://localhost:5000/albums', fetchJSON.get);
const albumReducer = asyncReducer('FETCH_ALBUM');

const store = createStore(
  albumReducer,
  compose(
    applyMiddleware(thunk)
  )
);

loadAlbumAction({ id: 5 });
// while loading
// store.loading = true
// store.fetchAlbumLoading = true

// after loading
// store.loading = false
// store.fetchAlbumLoading = false
// album with id of 5 will appear in the store

// error occurs
// store.loading = false
// store.fetchAlbumLoading = false
// store.fetchAlbumError = Error Object
```
