import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { TStore } from "../store";
import { selectPeer, AudienceListIsClick } from "../actions";
import { Member } from "../types";

import AudienceNumbers from "./AudienceNumbers";

import "./PresenterIcon.css";

interface IProps {
  selectPeer: any;
  AudienceListIsClick: any;
  localPeer?: Peer;
  audiences: Member[];
  presenter?: Member;
}

class PresenterIcon extends React.PureComponent<IProps> {
  private _buttonRef = React.createRef<HTMLSpanElement | any>();

  private _pointingTimer = 0;
  private _isClickAction = false;
  private _isMultiTouchAction = false;

  constructor(props: IProps) {
    super(props);

    this._onPointingDown = this._onPointingDown.bind(this);
    this._onPointingUp = this._onPointingUp.bind(this);
  }

  _onSelectPeerAction(actionFunction: Function) {
    const { localPeer } = this.props;
    if (!localPeer) {
      return;
    }
    actionFunction(localPeer.id);
  }

  _onClickAction(actionFunction: Function) {
    actionFunction();
  }

  _onPointingDown(e: any) {
    window.clearTimeout(this._pointingTimer);

    if (e.targetTouches?.length > 1) {
      // Ignore multi touch action.
      this._isMultiTouchAction = true;
      return;
    }

    this._pointingTimer = window.setTimeout(() => {
      this._isClickAction = true;
      if (e.type === "mousedown" || e.type === "touchstart") {
        const { localPeer } = this.props;
        if (!localPeer) {
          return;
        }
        this._onSelectPeerAction(this.props.selectPeer);
      }
    }, 500);
  }

  _onPointingUp(e: any) {
    window.clearTimeout(this._pointingTimer);

    if (e.targetTouches?.length > 0) {
      // Still touching by some fingers.
      return;
    }

    if (this._isMultiTouchAction) {
      // Ignore multi touch action.
    } else if (!this._isClickAction) {
      this._onClickAction(this.props.AudienceListIsClick);
    }
    this._isClickAction = false;
    this._isMultiTouchAction = false;
  }

  componentDidMount() {
    const button = this._buttonRef.current;
    button.addEventListener("mousedown", this._onPointingDown);
    button.addEventListener("mouseup", this._onPointingUp);
    button.addEventListener("touchstart", this._onPointingDown);
    button.addEventListener("touchend", this._onPointingUp);
  }

  render() {
    const { audiences, presenter } = this.props;
    const index = audiences.findIndex(a => a.peerId === presenter?.peerId);
    const className =
      "presenter-item " + (presenter ? "" : "presenter-item--no-presenter");
    return (
      <>
        <span ref={this._buttonRef} className={className}>
          {presenter ? (
            <img
              src={audiences[index].dataURL}
              className="presenter-item__icon"
            ></img>
          ) : null}
        </span>
        <AudienceNumbers />
      </>
    );
  }
}

const mapStateToProps = (store: TStore) => {
  return {
    localPeer: store.state.localPeer,
    audiences: store.state.audiences,
    presenter: store.state.presenter,
  };
};
const mapDispatchToProps = (
  dispatch: ThunkDispatch<TStore, void, AnyAction>
) => ({
  selectPeer: (peerId: string) => {
    dispatch(selectPeer(peerId));
  },
  AudienceListIsClick: () => {
    dispatch(AudienceListIsClick());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PresenterIcon);
