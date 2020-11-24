import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { TStore } from "../store";
import { Member, Pointing, Transform } from "../types";
import { setPointing, setTransform } from "../actions";
import PointingComponent from "./Pointing";

import "./Presenter.css";

interface IProps {
  localPeer?: Peer;
  // localPeer1?: Peer;
  pointings: Pointing[];
  presenter?: Member;
  transform: Transform;
  setPointing: any;
  setTransform: any;
}

class Presenter extends React.PureComponent<IProps> {
  // As video.playsInline is not defined in HTMLVideoElement, add "any" as well.
  private _videoRef = React.createRef<HTMLVideoElement | any>();

  private _panStopTimer = 0;

  constructor(props: IProps) {
    super(props);

    this._onClick = this._onClick.bind(this);
    this._onPanningStop = this._onPanningStop.bind(this);
    this._onZoomChange = this._onZoomChange.bind(this);
  }

  _amIPresenter() {
    const { localPeer, presenter } = this.props;

    if (!localPeer || !presenter) {
      return false;
    }

    return localPeer.id === presenter.peerId;
  }

  _getVideoArea() {
    const video = this._videoRef.current;
    return video?.closest(".react-transform-component");
  }

  _isMobile() {
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      navigator.userAgent.toLowerCase()
    );
  }

  _onClick(e: any) {
    const { target, layerX, layerY } = e;
    const { clientWidth, clientHeight } = target;
    const x = layerX / clientWidth;
    const y = layerY / clientHeight;
    this.props.setPointing(x, y);
  }

  /**
   * NOTE: This function is for following issue.
   * After fixing following issue, need to address for it.
   * https://github.com/prc5/react-zoom-pan-pinch/issues/89
   */
  _onPanningStop() {
    this._panStopTimer = window.setTimeout(() => {
      const video = this._videoRef.current;
      if (!video) {
        return;
      }

      const transformElement = video.closest(".react-transform-element");
      const transform = transformElement.style.transform.match(
        /translate\((.*)\) scale\((.*)\)/
      );
      const translate = transform[1];
      const translateMatch = translate.match(/(.*), (.*)/);
      const positionX = parseFloat(
        translateMatch ? translateMatch[1] : translate
      );
      const positionY = parseFloat(
        translateMatch && translateMatch.length === 3 ? translateMatch[2] : 0
      );
      const scale = parseFloat(transform[2]);
      this._onZoomChange({ positionX, positionY, scale });
    }, 500);
  }

  _onZoomChange(e: any) {
    window.clearTimeout(this._panStopTimer);

    const area = this._getVideoArea();
    const { positionX, positionY, scale } = e;
    const { clientWidth, clientHeight } = area;
    const x = positionX / clientWidth;
    const y = positionY / clientHeight;
    this.props.setTransform(x, y, scale);
  }

  _renderPointings() {
    const area = this._getVideoArea();
    if (!area) {
      return null;
    }

    const { pointings } = this.props;
    return pointings.map(p => {
      const audience = p.audience;
      const x = area.offsetLeft + area.clientWidth * p.x;
      const y = area.offsetTop + area.clientHeight * p.y;
      const radian = Math.atan2(p.x - 0.5, -(p.y - 0.5));

      return (
        <PointingComponent
          key={audience.peerId}
          audience={audience}
          x={x}
          y={y}
          radian={radian}
        />
      );
    });
  }

  componentDidMount() {
    const area = this._getVideoArea();
    if (!area) {
      return null;
    }

    // We can't get layerX/layerY from React mouse event.
    area.addEventListener("click", this._onClick);
  }

  componentDidUpdate(prevProps: IProps) {
    const video = this._videoRef.current;
    if (!video) {
      return;
    }

    const { presenter } = this.props;
    if (prevProps.presenter === presenter) {
      return;
    }

    if (presenter) {
      video.muted = this._amIPresenter();
      video.srcObject = presenter.stream;
      video.playsInline = true;
      video.play();
    } else {
      video.srcObject = null;
    }
  }

  render() {
    const area = this._getVideoArea();

    const settings =
      this._amIPresenter() && this._isMobile()
        ? {
            onPanningStop: this._onPanningStop,
            onZoomChange: this._onZoomChange,
            pan: {
              disabled: false,
            },
          }
        : {
            positionX: area?.clientWidth * this.props.transform.x,
            positionY: area?.clientHeight * this.props.transform.y,
            scale: this.props.transform.scale,
            pan: {
              disabled: true,
            },
          };

    return (
      <section className="presenter">
        <TransformWrapper
          onPanning={settings.onZoomChange}
          onPanningStop={settings.onPanningStop}
          onZoomChange={settings.onZoomChange}
          positionX={settings.positionX}
          positionY={settings.positionY}
          scale={settings.scale}
          pan={settings.pan}
          doubleClick={{ disabled: true }}
        >
          <TransformComponent>
            <video className="presenter__video" ref={this._videoRef}></video>
          </TransformComponent>
        </TransformWrapper>
        {this._renderPointings()}
      </section>
    );
  }
}

const mapStateToProps = (store: TStore) => {
  return {
    localPeer: store.state.localPeer1,
    pointings: store.state.pointings,
    presenter: store.state.presenter,
    transform: store.state.transform,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<TStore, void, AnyAction>
) => ({
  setPointing: (x: number, y: number) => {
    dispatch(setPointing(x, y));
  },
  setTransform: (x: number, y: number, scale: number) => {
    dispatch(setTransform(x, y, scale));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Presenter);
