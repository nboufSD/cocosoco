import { reducerWithInitialState } from "typescript-fsa-reducers";

import {
  AddPeerAction,
  ParticipateAction,
  RemovePeerAction,
  SwitchCameraAction,
  ToggleAudioMutingAction,
  ToggleCameraMutingAction,
  OnPeerSelectedAction,
  OnPresentationPointedAction,
} from "./actions";
import { Member, Pointing } from "./types";

export interface IState {
  audiences: Member[],
  isAudioEnabled: boolean,
  isCameraEnabled: boolean,
  localPeer?: Peer,
  localStream?: MediaStream,
  room?: SFURoom | MeshRoom,
  pointings: Pointing[],
  presenter?: Member,
  // Don't use this. The reason why we need this variable is because the `peer-selected`
  // event and AddPeerAction timing after joining the room is racing.
  _selectedPeerId?: string,
}

const initialState: IState = {
  audiences: [],
  isAudioEnabled: true,
  isCameraEnabled: true,
  pointings: [],
}

export const reducer = reducerWithInitialState(initialState)
  .case(AddPeerAction, (state, { peerId, stream }) => {
    const audience = { peerId, stream };
    const audiences = [...state.audiences, audience];

    // As the presenter peer joined after firing `peer-selected` event, set as a presenter.
    const presenter = state._selectedPeerId === peerId ? audience : state.presenter;

    return Object.assign({}, state, { audiences, presenter });
  })
  .case(ParticipateAction.done, (state, { result }) => {
    const { localPeer, localStream, room } = result;

    const audience = {
      peerId: localPeer.id,
      stream: localStream,
    };
    const audiences = [audience];

    return Object.assign({}, state, { audiences, localPeer, localStream, room });
  })
  .case(RemovePeerAction, (state, { peerId }) => {
    const audiences = state.audiences.filter(a => a.peerId !== peerId);
    const presenter = state.presenter?.peerId === peerId ? null : state.presenter;

    return Object.assign({}, state, { audiences, presenter });
  })
  .case(SwitchCameraAction.done, (state, { result }) => {
    const { localStream } = result;
    const peerId = state.localPeer?.id;

    const audiences = state.audiences.map(
      a => a.peerId === peerId ? { peerId, stream: localStream } : a
    );

    const presenter = state.presenter?.peerId === peerId
                        ? { peerId, stream: localStream }
                        : state.presenter;

    return Object.assign({}, state, { audiences, localStream, presenter });
  })
  .case(ToggleAudioMutingAction.done, (state, { result }) => {
    const { isEnabled } = result;

    return Object.assign({}, state, { isAudioEnabled: isEnabled });
  })
  .case(ToggleCameraMutingAction.done, (state, { result }) => {
    const { isEnabled } = result;

    return Object.assign({}, state, { isCameraEnabled: isEnabled });
  })
  .case(OnPeerSelectedAction, (state, { peerId }) => {
    const presenter = state.audiences.find(a => a.peerId === peerId);

    return Object.assign({}, state, { presenter, _selectedPeerId: peerId });
  })
  .case(OnPresentationPointedAction, (state, { peerId, x, y }) => {
    const pointings = state.pointings.filter(a => a.peerId !== peerId);

    return Object.assign({}, state, { pointings: [...pointings, { peerId, x, y }] });
  })
