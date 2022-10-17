import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

type ParamValue = string | string[] | null | undefined;

const useQueryParam = (key: string): {
  value: ParamValue,
  updateParam: (value: ParamValue) => void,
  removeParam: () => void,
} => {
  const history = useHistory();
  const location = useLocation();

  const { search } = location;
  const params = queryString.parse(search);

  const updateHistoryQueryString = useCallback((params) => {
    const newQueryString = queryString.stringify(params);

    const newLocation = `${location.pathname}${newQueryString && '?'}${newQueryString}`;
    history.push(newLocation);
  }, [history, location.pathname]);

  const updateParam = useCallback((value) => {
    const params = queryString.parse(search);
    updateHistoryQueryString({ ...params, [key]: value });
  }, [key, updateHistoryQueryString, search]);

  const removeParam = useCallback(() => {
    const params = queryString.parse(search);
    updateHistoryQueryString({ ...params, [key]: undefined });
  }, [key, updateHistoryQueryString, search]);

  return { value: params[key], updateParam, removeParam };
};

export default useQueryParam;
