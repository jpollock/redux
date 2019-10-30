import { Dispatch } from 'redux';
import { ObjectsResponsePayload } from 'api/Objects';
import {
  ErrorRemovingMembersAction,
  MembersRemovedAction,
  RemovingMembersAction,
  ErrorAddingMembersAction,
  MembersAddedAction,
  AddingMembersAction,
  FetchingMembersAction,
  MembersRetrievedAction,
  ErrorFetchingMembersAction,
  UpdatingMembersAction,
  ErrorUpdatingMembersAction,
  MembersUpdatedAction,
} from 'actions/Actions';
import { ActionType } from 'actions/ActionType.enum';
import {
  PubNubObjectApiError,
  PubNubApiStatus,
  PubNubObjectApiSuccess,
} from 'api/PubNubApi';
import {
  MembersList,
  MembersResult,
  Members,
  MembersOptions,
} from 'api/Member';

export const fetchingMembers = (payload: string): FetchingMembersAction => ({
  type: ActionType.FETCHING_MEMBERS,
  payload,
});

const membersRetrieved = (
  payload: PubNubObjectApiSuccess<MembersResult>
): MembersRetrievedAction => ({
  type: ActionType.MEMBERS_RETRIEVED,
  payload,
});

const errorFetchingMembers = <T>(
  payload: PubNubObjectApiError<T>
): ErrorFetchingMembersAction<T> => ({
  type: ActionType.ERROR_FETCHING_MEMBERS,
  payload,
});

export const updatingMembers = (payload: string): UpdatingMembersAction => ({
  type: ActionType.UPDATING_MEMBERS,
  payload,
});

export const membersUpdated = <T>(
  payload: PubNubObjectApiSuccess<T>
): MembersUpdatedAction<T> => ({
  type: ActionType.MEMBERS_UPDATED,
  payload,
});

export const errorUpdatingMembers = <T>(
  payload: PubNubObjectApiError<T>
): ErrorUpdatingMembersAction<T> => ({
  type: ActionType.ERROR_UPDATING_MEMBERS,
  payload,
});

export const addingMembers = <T>(payload: T): AddingMembersAction<T> => ({
  type: ActionType.ADDING_MEMBERS,
  payload,
});

export const membersAdded = <T>(
  payload: PubNubObjectApiSuccess<T>
): MembersAddedAction<T> => ({
  type: ActionType.MEMBERS_ADDED,
  payload,
});

export const errorAddingMembers = <T>(
  payload: PubNubObjectApiError<T>
): ErrorAddingMembersAction<T> => ({
  type: ActionType.ERROR_ADDING_MEMBERS,
  payload,
});

export const removingMembers = <T>(payload: T): RemovingMembersAction<T> => ({
  type: ActionType.REMOVING_MEMBERS,
  payload,
});

export const membersRemoved = <T>(
  payload: PubNubObjectApiSuccess<T>
): MembersRemovedAction<T> => ({
  type: ActionType.MEMBERS_REMOVED,
  payload,
});

export const errorRemovingMembers = <T>(
  payload: PubNubObjectApiError<T>
): ErrorRemovingMembersAction<T> => ({
  type: ActionType.ERROR_REMOVING_MEMBERS,
  payload,
});

export const fetchMembers = (
  pubnub: any,
  spaceId: string,
  options: MembersOptions = {}
) => (dispatch: Dispatch) => {
  dispatch(fetchingMembers(spaceId));

  pubnub.getMembers(
    {
      spaceId,
      ...options,
    },
    (status: PubNubApiStatus, response: { data: MembersList }) => {
      if (status.error) {
        let errorData = { id: spaceId };

        dispatch(
          errorFetchingMembers({
            code: status.category,
            message: status.errorData,
            data: errorData,
          })
        );
      } else {
        let result = {
          id: spaceId,
          users: response.data,
        };
        dispatch(membersRetrieved({ data: result }));
      }
    }
  );
};

export const updateMembers = (pubnub: any, members: Members) => (
  dispatch: Dispatch
) => {
  dispatch(updatingMembers(members.spaceId));

  pubnub.updateMembers(
    {
      ...members,
    },
    (status: PubNubApiStatus, response: ObjectsResponsePayload) => {
      if (status.error) {
        let errorData = { id: members.spaceId, value: { ...members } };

        dispatch(
          errorUpdatingMembers({
            code: status.category,
            message: status.errorData,
            data: errorData,
          })
        );
      } else {
        dispatch(
          membersUpdated({
            data: response.data,
          })
        );
      }
    }
  );
};

export const addMembers = (pubnub: any, members: Members) => (
  dispatch: Dispatch
) => {
  dispatch(addingMembers(members));

  pubnub.addMembers(
    {
      ...members,
    },
    (status: PubNubApiStatus, response: ObjectsResponsePayload) => {
      if (status.error) {
        let errorData = { id: members.spaceId, value: { ...members } };

        dispatch(
          errorAddingMembers({
            code: status.category,
            message: status.errorData,
            data: errorData,
          })
        );
      } else {
        dispatch(
          membersAdded({
            data: response.data,
          })
        );
      }
    }
  );
};

export const removeMembers = (pubnub: any, members: Members) => (
  dispatch: Dispatch
) => {
  dispatch(removingMembers(members));

  pubnub.removeMembers(
    {
      spaceId: members.spaceId,
      users: members.users.map((user) => user.id),
    },
    (status: PubNubApiStatus, response: ObjectsResponsePayload) => {
      if (status.error) {
        let errorData = { id: members.spaceId, value: { ...members } };

        dispatch(
          errorRemovingMembers({
            code: status.category,
            message: status.errorData,
            data: errorData,
          })
        );
      } else {
        dispatch(
          membersRemoved({
            data: response.data,
          })
        );
      }
    }
  );
};
