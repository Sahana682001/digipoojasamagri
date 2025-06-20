// src/redux/actions/categoryActions.js
import { Api } from '../../utils/Api';
import { 
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL
} from '../constants/categoryConstants';

export const listCategories = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST });

    const { data } = await Api.getRequest('/api/categories');
    
    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};