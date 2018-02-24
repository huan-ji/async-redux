import camelCase from 'lodash.camelcase';

exports.asyncAction = (actionName, url, asyncFunction) => ({ id, params }) => {
  return (dispatch) => {
    let transformedUrl = url;
    if (id) {
      transformedUrl = `${url}/${id}`;
    }

    dispatch({ type: `${actionName}_REQUESTED`, id, params });
    return asyncFunction(transformedUrl, params)
      .then(result => dispatch({ type: `${actionName}_RECEIVED`, id, result }))
      .catch(errors => Promise.reject(dispatch({ type: `${actionName}_FAILED`, id, errors })));
  };
};

exports.asyncReducer = actionName => (state, action) => {
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

      if (action.result instanceof Array) {
        action.result.forEach(item => (newState.data[item.id] = item));
      } else {
        newState.data[action.id] = action.result;
      }
      newState[errorStateName] = { errors: '' };

      return Object.assign({}, state, newState);
    }

    case `${actionName}_FAILED`: {
      newState[loadingStateName] = false;
      newState.loading = false;
      newState[errorStateName] = action.errors;

      return Object.assign({}, state, newState);
    }

    default:
      return newState;
  }
};
