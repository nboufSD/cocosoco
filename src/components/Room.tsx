import React from "react";
import { connect } from "react-redux";

import { TStore } from "../store";
import { Member } from "../types";

import PresenterSelecting from "./PresenterSelecting";
import PresenterList from "./PresenterList";
import AudienceList from "./AudienceList";
import MapPanel from "./MapPanel";
import Presenter from "./Presenter";
import ToolList from "./ToolList";

import "./Room.css";

interface IProps {
  presenter?: Member;
}

class Room extends React.PureComponent<IProps> {
  render() {
    const { presenter } = this.props;

    return presenter ? (
      <section className="room">
        <ToolList />
        <Presenter />
        <MapPanel />
        <AudienceList />
        <PresenterList />
        <PresenterSelecting />
      </section>
    ) : (
      <section className="room">
        <ToolList />
        <Presenter />
        <MapPanel />
        <AudienceList />
        <PresenterSelecting />
      </section>
    );
  }
}

const mapStateToProps = (store: TStore) => {
  return {
    presenter: store.state.presenter,
  };
};

export default connect(mapStateToProps)(Room);
