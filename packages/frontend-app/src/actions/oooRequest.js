import { OOORequestAction } from 'constants/action';
import { put, get, post } from 'utils/request';

export const getMyOOORequests = () => ({
  type: OOORequestAction.GET_MY_OOO_REQUESTS,
  promise: get('/users/me/ooo-requests'),
});
export const getMenteesOOORequests = () => ({
  type: OOORequestAction.GET_MENTEES_REQUEST,
  promise: get('/users/me/mentees/ooo-requests'),
});

export const cancelMyOOORequest = (requestId) => ({
  type: OOORequestAction.CANCEL_MY_OOO_REQUEST,
  promise: put(`/users/me/ooo-requests/${requestId}`, {
    status: 'cancelled',
  }),
});

export const approveMenteeOOORequest = (requestId) => ({
  type: OOORequestAction.APPROVE_MENTEE_OOO_REQUEST,
  promise: put(`/users/me/mentees/ooo-requests/${requestId}`, {
    status: 'approved',
  }),
});
export const rejectMenteeOOORequest = (requestId, rejectReasonInput) => ({
  type: OOORequestAction.REJECT_MENTEE_OOO_REQUEST,
  promise: put(`/users/me/mentees/ooo-requests/${requestId}`, {
    status: 'rejected',
    rejectReason: rejectReasonInput,
  }),
});


export const submitMyOOORequests = ({
  purpose,
  picId,
  startDate,
  endDate,
  contactMethods,
}) => ({
  type: OOORequestAction.SUBMIT_MY_OOO_REQUEST,
  promise: post('/ooo-requests', {
    purpose,
    picId,
    startDate,
    endDate,
    contactMethods,
  }),
});
export const submitRejectReason = (requestId, rejectReasonInput) => ({
  type: OOORequestAction.SUBMIT_REJECT_REASON,
  promise: put(`/users/me/mentees/ooo-requests/${requestId}`, {
    rejectReason: rejectReasonInput,
  }),
});

export const getAdminOOORequests = () => ({
  type: OOORequestAction.GET_ADMIN_OOO_REQUEST,
  promise: get('/ooo-requests'),
});
