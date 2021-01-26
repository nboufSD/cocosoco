import React from "react";
import { connect } from "react-redux";

import { TStore } from "../store";
import { Member } from "../types";

import AudienceItem from "./AudienceItem";

import "./AudienceList.css";

interface IProps {
  audiences: Member[];
  localPeer?: Peer;
  presenter?: Member;
  isIconClicked: boolean;
}

class AudienceList extends React.PureComponent<IProps> {
  private _uListRef = React.createRef<HTMLUListElement | any>();

  render() {
    const { audiences, localPeer, presenter, isIconClicked } = this.props;

    const className =
      "audience-list " + (isIconClicked ? "audience-list--animation" : "");
    let height;
    if (this._uListRef.current) {
      height = this._uListRef.current.clientHeight;
      if (isIconClicked) {
        const icon_height = height / audiences.length;
        this._uListRef.current.style.setProperty("--height", `${height}px`);
        this._uListRef.current.style.setProperty(
          "--icon_height",
          `${icon_height}px`
        );
        this._uListRef.current.style.setProperty(
          "--speed",
          `${1 / (audiences.length / 2)}s`
        );
      }
    }

    const styles = {
      bottom: `${height ? height : 0}`,
    };

    return (
      <ul className={className} ref={this._uListRef} style={styles}>
        {audiences.map(audience => (
          <AudienceItem
            key={audience.peerId}
            audience={audience}
            isMuted={audience.peerId === localPeer?.id}
            isSelected={audience.peerId === presenter?.peerId}
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
    isIconClicked: store.state.isIconClicked,
  };
};

export default connect(mapStateToProps)(AudienceList);
