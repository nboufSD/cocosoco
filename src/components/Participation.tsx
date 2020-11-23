import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { TStore } from "../store";
import { participate } from "../actions";
import { InitializeMap } from "../actions";

import "./Participation.css";

interface IProps {
  participate: any;
  InitializeMap: any;
}

interface IState {
  key: string | null;
  key1: string | null;
  mapkey: string | null;
  network: string | null;
  room_stream: string | null;
  room_function: string | null;
  error: string | null;
  isParticipating?: boolean;
}

class Participation extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this._onClick = this._onClick.bind(this);

    const url = new URL(document.URL);
    const key = url.searchParams.get("key");
    const key1 = url.searchParams.get("key1");
    const mapkey = url.searchParams.get("mapkey");
    const network = url.searchParams.get("network");
    const room_stream = url.searchParams.get("room_stream");
    const room_function = url.searchParams.get("room_function");

    let error = null;
    if (!key || !key1 || !network || !room_stream || !room_function) {
      error = "No specific key, network or room";
    } else if (network !== "sfu" && network !== "mesh") {
      error = "Network should be 'sfu' or 'mesh'";
    } else if (!mapkey) {
      error = "No specific GoogleMapAPIkey";
    }

    this.state = {
      key,
      key1,
      mapkey,
      network,
      room_stream,
      room_function,
      error,
    };
  }

  _onClick() {
    const { participate, InitializeMap } = this.props;
    const {
      key,
      key1,
      mapkey,
      network,
      room_stream,
      room_function,
    } = this.state;
    this.setState({ isParticipating: true });
    participate(key, key1, network, room_stream, room_function);
    InitializeMap(mapkey);
  }

  render() {
    const { room_stream, room_function, error, isParticipating } = this.state;

    return (
      <section className="participation">
        {error ? (
          <label className="participation__error">{error}</label>
        ) : (
          <button
            className="participation__button"
            onClick={this._onClick}
            disabled={isParticipating}
          >
            <label>participate to </label>
            <label className="participation__room_stream">{room_stream}</label>
            <label className="participation__room_function">
              {room_function}
            </label>
          </button>
        )}
      </section>
    );
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<TStore, void, AnyAction>
) => ({
  participate: (
    key: string,
    key1: string,
    network: "mesh" | "sfu",
    room_stream: string,
    room_function: string
  ) => {
    dispatch(participate(key, key1, network, room_stream, room_function));
  },
  InitializeMap: (mapkey: string) => {
    dispatch(InitializeMap(mapkey));
  },
});

export default connect(null, mapDispatchToProps)(Participation);
