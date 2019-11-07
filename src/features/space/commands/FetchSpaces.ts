import {
  ErrorFetchingSpacesAction,
  SpacesRetrievedAction,
  FetchingSpacesAction,
  FetchSpacesRequest,
  FetchSpacesResponse,
  FetchSpacesError,
  Space,
  FetchSpacesSuccess,
} from '../SpaceActions';
import { SpaceActionType } from '../SpaceActionType.enum';
import { PubNubApiStatus } from '../../../foundations/PubNubApi';
import { Dispatch, PubnubThunkContext } from '../../../foundations/ThunkTypes';

export const fetchingSpaces = <MetaType>(
  payload: FetchSpacesRequest,
  meta?: MetaType,
): FetchingSpacesAction<MetaType> => ({
  type: SpaceActionType.FETCHING_SPACES,
  payload,
  meta,
});

export const spacesRetrieved = <SpaceType extends Space, CustomType, MetaType>(
  payload: FetchSpacesSuccess<SpaceType, CustomType>,
  meta?: MetaType
): SpacesRetrievedAction<SpaceType, CustomType, MetaType> => ({
  type: SpaceActionType.SPACES_RETRIEVED,
  payload,
  meta,
});

export const errorFetchingSpaces = <MetaType>(
  payload: FetchSpacesError,
  meta?: MetaType
): ErrorFetchingSpacesAction<MetaType> => ({
  type: SpaceActionType.ERROR_FETCHING_SPACES,
  payload,
  meta,
  error: true,
});

export const fetchSpaces = <SpaceType extends Space, CustomType, MetaType>(
  request: FetchSpacesRequest = {},
  meta?: MetaType
) => {
  const thunkFunction = (dispatch: Dispatch, _getState: any, { pubnub }: PubnubThunkContext) =>
    new Promise<void>((resolve, reject) => {
      dispatch(fetchingSpaces<MetaType>(request, meta));

      pubnub.api.getSpaces(
        { ...request },
        (status: PubNubApiStatus, response: FetchSpacesResponse<SpaceType, CustomType>) => {
          if (status.error) {
            let payload: FetchSpacesError = {
              request,
              status,
            };

            dispatch(errorFetchingSpaces<MetaType>(payload, meta));
            reject(payload);
          } else {
            let payload: FetchSpacesSuccess<SpaceType, CustomType> = {
              request,
              response,
              status,
            };

            dispatch(spacesRetrieved<SpaceType, CustomType, MetaType>(payload, meta));
            resolve();
          }
        }
      );
    });

  thunkFunction.type = SpaceActionType.FETCH_SPACES_COMMAND;

  return thunkFunction;
};
