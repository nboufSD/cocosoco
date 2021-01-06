import React from "react";
import { connect } from "react-redux";

import { TStore } from "../store";
import { Member } from "../types";

import PresenterItem from "./PresenterItem";

import "./PresenterList.css";

interface IProps {
  audiences: Member[];
  localPeer?: Peer;
  presenter?: Member;
}

class PresenterList extends React.PureComponent<IProps> {
  render() {
    const { audiences, localPeer, presenter } = this.props;

    return (
      <ul className="presenter-list">
        {audiences.map(audience => (
          <PresenterItem
            key={audience.peerId}
            audience={audience}
            isMuted={audience.peerId === localPeer?.id}
            isSelected={audience.peerId === presenter?.peerId}
            amIPresenter={audience?.peerId === presenter?.peerId}
          />
        ))}
      </ul>
    );
  }
}

const mapStateToProps = (store: TStore) => {
  return {
    audiences: store.state.audiences,
    localPeer: store.state.localPeer,
    presenter: store.state.presenter,
  };
};

export default connect(mapStateToProps)(PresenterList);
