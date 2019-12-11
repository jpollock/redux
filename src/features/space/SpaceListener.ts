import { Dispatch } from 'redux';
import {
  SpaceUpdatedEventAction,
  SpaceDeletedEventAction,
  SpaceEventMessage,
  SpaceListenerActions,
  Space,
} from './SpaceActions';
import { SpaceActionType } from './SpaceActionType.enum';
import { ObjectsCustom } from '../../foundations/ObjectsCustom';

// tag::RDX-type-event-space-updated[]
export const spaceUpdated = <ReceivedSpace extends Space<ObjectsCustom>>(
  payload: SpaceEventMessage<ReceivedSpace>
): SpaceUpdatedEventAction<ReceivedSpace> => ({
  type: SpaceActionType.SPACE_UPDATED_EVENT,
  payload,
});
// end::RDX-type-event-space-updated[]

// tag::RDX-type-event-space-deleted[]
export const spaceDeleted = <ReceivedSpace extends Space<ObjectsCustom>>(
  payload: SpaceEventMessage<ReceivedSpace>
): SpaceDeletedEventAction<ReceivedSpace> => ({
  type: SpaceActionType.SPACE_DELETED_EVENT,
  payload,
});
// end::RDX-type-event-space-deleted[]

// tag::RDX-method-listener-space[]
export const createSpaceListener = <ReceivedSpace extends Space<ObjectsCustom>>(
  dispatch: Dispatch<SpaceListenerActions<ReceivedSpace>>
) => ({
  space: (payload: SpaceEventMessage<ReceivedSpace>) => {
    switch (payload.event) {
      case 'update':
        dispatch(spaceUpdated<ReceivedSpace>(payload));
        break;
      case 'delete':
        dispatch(spaceDeleted<ReceivedSpace>(payload));
        break;
      default:
        break;
    }
  },
});
// end::RDX-method-listener-space[]
