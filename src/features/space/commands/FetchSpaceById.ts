import { Dispatch } from 'redux';
import { SpaceActionType } from '../SpaceActionType.enum';
import {
  ErrorFetchingSpaceByIdAction,
  SpaceRetrievedAction,
  FetchingSpaceByIdAction,
  FetchSpaceByIdRequest,
  FetchSpaceByIdError,
  SpaceResponse,
  Space,
  FetchSpaceByIdSuccess,
} from '../SpaceActions';
import { ActionMeta } from '../../../common/ActionMeta';
import { PubNubApiStatus } from '../../../common/PubNubApi';

export const fetchingSpaceById = <MetaType>(
  payload: FetchSpaceByIdRequest,
  meta?: ActionMeta<MetaType>,
): FetchingSpaceByIdAction<MetaType> => ({
  type: SpaceActionType.FETCHING_SPACE_BY_ID,
  payload,
  meta,
});

export const spaceRetrieved = <SpaceType extends Space, CustomType, MetaType>(
  payload: FetchSpaceByIdSuccess<SpaceType, CustomType>,
  meta?: ActionMeta<MetaType>
): SpaceRetrievedAction<SpaceType, CustomType, MetaType> => ({
  type: SpaceActionType.SPACE_RETRIEVED,
  payload,
  meta,
});

export const errorFetchingSpaceById = <MetaType>(
  payload: FetchSpaceByIdError,
  meta?: ActionMeta<MetaType>
): ErrorFetchingSpaceByIdAction<MetaType> => ({
  type: SpaceActionType.ERROR_FETCHING_SPACE_BY_ID,
  payload,
  meta,
  error: true,
});

export const fetchSpaceById = <SpaceType extends Space, CustomType, MetaType>(
  request: FetchSpaceByIdRequest,
  meta?: ActionMeta<MetaType>
) => {
  const thunkFunction = (dispatch: Dispatch, { pubnub }: { pubnub: any }) =>
    new Promise<void>((resolve, reject) => {
      dispatch(fetchingSpaceById<MetaType>({
        ...request,
      }, meta));

      pubnub.getSpace(
        {
          ...request,
        },
        (status: PubNubApiStatus, response: SpaceResponse<SpaceType, CustomType>) => {
          if (status.error) {
            let payload: FetchSpaceByIdError = {
              request,
              status,
            };

            dispatch(errorFetchingSpaceById<MetaType>(payload, meta));
            reject(payload);
          } else {
            let payload: FetchSpaceByIdSuccess<SpaceType, CustomType> = {
              request,
              response,
              status,
            };

            dispatch(spaceRetrieved<SpaceType, CustomType, MetaType>(payload, meta));
            resolve();
          }
        }
      );
    });

  thunkFunction.type = SpaceActionType.FETCH_SPACE_BY_ID_COMMAND;

  return thunkFunction;
};
