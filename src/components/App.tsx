import React from "react";
import { connect } from "react-redux";
import { TStore } from "../store";

import Participation from "./Participation";
import Room from "./Room";

import "./App.css";

interface IProps {
  room_stream: any;
  room_function: any;
}

class App extends React.PureComponent<IProps> {
  render() {
    return (
      <React.Fragment>
        {this.props.room_stream ? <Room /> : <Participation />}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (store: TStore) => {
  return {
    room_stream: store.state.room_stream,
    room_function: store.state.room_function,
  };
};

export default connect(mapStateToProps)(App);
