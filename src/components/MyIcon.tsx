import React from "react";

import { connect } from "react-redux";

import { TStore } from "../store";
import { Member } from "../types";

import AudienceNumbers from "./AudienceNumbers";

import "./MyIcon.css";

interface IProps {
  audiences: Member[];
  presenter?: Member;
  localPeer?: Peer;
}

class MyIcon extends React.PureComponent<IProps> {
  render() {
    const { audiences, presenter, localPeer } = this.props;
    const index = audiences.findIndex(a => a.peerId === localPeer?.id);
    const className =
      "myicon-item " +
      (presenter?.peerId === localPeer?.id ? "myicon-item--presenter" : "");
    return (
      <>
        <span className={className}>
          <img
            src={audiences[index].dataURL}
            className="myicon-item__icon"
          ></img>
        </span>
        <AudienceNumbers />
      </>
    );
  }
}

const mapStateToProps = (store: TStore) => {
  return {
    audiences: store.state.audiences,
    presenter: store.state.presenter,
    localPeer: store.state.localPeer,
  };
};

export default connect(mapStateToProps)(MyIcon);
