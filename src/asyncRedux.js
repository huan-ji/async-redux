import camelCase from 'lodash.camelcase';

const asyncAction = (actionName, url, asyncFunction) => (meta) => {
  return (dispatch) => {
    let transformedUrl = url;

    // This assumes RESTful API
    if (meta.id) {
      transformedUrl = `${url}/${meta.id}`;
    }

    dispatch({ type: `${actionName}_REQUESTED`, meta });

    return asyncFunction(transformedUrl, meta)
      .then(payload => dispatch({
        type: `${actionName}_RECEIVED`,
        meta,
        payload
      }))
      .catch(payload => Promise.reject(dispatch({
        type: `${actionName}_FAILED`,
        meta,
        payload,
        error: true
      })));
  };
};

const asyncReducer = actionName => (state, action) => {
  const camelCaseActionName = camelCase(actionName);
  const loadingStateName = `${camelCaseActionName}Loading`;
  const errorStateName = `${camelCaseActionName}Error`;

  const defaultState = {};
  defaultState[loadingStateName] = false;
  defaultState[errorStateName] = { errors: '' };
  defaultState.data = {};

  const newState = Object.assign({}, defaultState, state);

  switch (action.type) {
    case `${actionName}_REQUESTED`: {
      newState[loadingStateName] = true;
      newState.loading = true;

      return Object.assign({}, state, newState);
    }

    case `${actionName}_RECEIVED`: {
      newState[loadingStateName] = false;
      newState.loading = false;

      if (action.payload instanceof Array) {
        action.payload.forEach(item => (newState.data[item.id] = item));
      } else {
        newState.data[action.meta.id] = action.payload;
      }
      newState[errorStateName] = { errors: '' };

      return Object.assign({}, state, newState);
    }

    case `${actionName}_FAILED`: {
      newState[loadingStateName] = false;
      newState.loading = false;
      newState[errorStateName] = action.payload;

      return Object.assign({}, state, newState);
    }

    default:
      return newState;
  }
};

const asyncGenerators = (actionName, url, asyncFunction) => {
  return {
    asyncAction: asyncAction(actionName, url, asyncFunction),
    asyncReducer: asyncReducer(actionName)
  };
};

export {
  asyncAction,
  asyncReducer,
  asyncGenerators
}
