import { alertTypes, BASE_URL } from '../constants/applicationConstants';
import dispatchAlert from './actionHelpers';
import { DELETE_REGISTRATION } from '../constants/action-types';
import { getCurrentUser } from './UserActions';

export const register = ({
  tournament,
  userId,
  role,
  comment,
  independent,
  funding,
  partner1,
  partner2,
  teamName,
}) => (dispatch) => {
  fetch(`${BASE_URL}/registration`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Method': 'POST',
    },
    body: JSON.stringify({
      tournament_id: tournament.id,
      user_id: userId,
      role,
      comment,
      is_independent: independent,
      funding,
      partner1,
      partner2,
      teamname: teamName,
    }),
  }).then((response) => {
    response.json().then((body) => {
      if (response.status === 200) {
        dispatchAlert(dispatch, body.message, alertTypes.SUCCESS);
        dispatch(getCurrentUser());
      } else dispatchAlert(dispatch, body.message, alertTypes.WARNING);
    });
  });
};

export const deleteRegistration = registrationId => dispatch => fetch(`${BASE_URL}/registration/${registrationId}`, {
  method: 'DELETE',
  credentials: 'include',
}).then((response) => {
  response.json().then((body) => {
    if (response.status === 200) {
      dispatchAlert(dispatch, body.message, alertTypes.SUCCESS);
      dispatch({
        type: DELETE_REGISTRATION,
        payload: {
          registrationId,
        },
      });
    } else dispatchAlert(dispatch, body.message, alertTypes.WARNING);
  });
});
