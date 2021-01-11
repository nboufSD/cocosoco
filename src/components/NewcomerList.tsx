import React from "react";
import { connect } from "react-redux";

import { TStore } from "../store";
import { Member } from "../types";

import NewcomerItem from "./NewcomerItem";

import "./NewcomerList.css";

interface IProps {
  audiences: Member[];
  localPeer?: Peer;
}

class NewcomerList extends React.PureComponent<IProps> {
  render() {
    const { audiences, localPeer } = this.props;
    const newcomers = audiences.filter(
      audience => audience.isNewcomer && audience.peerId !== localPeer?.id
    );

    return (
      <section className="newcomer-list">
        {newcomers.map(newcomer => (
          <NewcomerItem key={newcomer.peerId} newcomer={newcomer} />
        ))}
      </section>
    );
  }
}

const mapStateToProps = (store: TStore) => {
  return {
    audiences: store.state.audiences,
    localPeer: store.state.localPeer,
  };
};

export default connect(mapStateToProps)(NewcomerList);
