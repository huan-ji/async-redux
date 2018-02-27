import 'whatwg-fetch';
import queryString from 'query-string';

const request = (type, url, data, options) => {
  let defaultOptions = {};
  if (type !== 'GET') {
    defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      method: type,
      body: JSON.stringify(data)
    };
  }

  return fetch(url, Object.assign({}, defaultOptions, options))
    .then((response) => {
      return response.json().then((payload) => {
        if (response.ok) {
          return Promise.resolve(payload);
        } else {
          return Promise.reject(Object.assign({}, { status: response.status }, payload));
        }
      });
    });
};

const get = (url, data = {}, options = {}) => {
  const transformedUrl = `${url}?${queryString.stringify(data)}`;
  return request('GET', transformedUrl, data, options);
};

const post = (url, data = {}, options = {}) => {
  return request('POST', url, data, options);
};

const put = (url, data = {}, options = {}) => {
  return request('PUT', url, data, options);
};

const patch = (url, data = {}, options = {}) => {
  return request('PATCH', url, data, options);
};

const destroy = (url, data = {}, options = {}) => {
  return request('DELETE', url, data, options);
};

export default {
  get,
  post,
  put,
  patch,
  delete: destroy
};
