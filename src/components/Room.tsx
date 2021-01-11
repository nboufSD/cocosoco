import React from "react";

import PresenterSelecting from "./PresenterSelecting";
import MyIcon from "./MyIcon";
import NewcomerList from "./NewcomerList";
import AudienceList from "./AudienceList";
import MapPanel from "./MapPanel";
import Presenter from "./Presenter";
import ToolList from "./ToolList";

import "./Room.css";

class Room extends React.PureComponent {
  render() {
    return (
      <section className="room">
        <ToolList />
        <Presenter />
        <MapPanel />
        <div className="room__viewtoollist">
          <MyIcon />
          <PresenterSelecting />
        </div>
        <AudienceList />
        <NewcomerList />
      </section>
    );
  }
}

export default Room;
