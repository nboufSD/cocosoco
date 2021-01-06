import React from "react";

import { Member } from "../types";

import "./PresenterItem.css";

interface IProps {
  audience: Member;
  isMuted: boolean;
  isSelected: boolean;
  amIPresenter: boolean;
}

class PresenterItem extends React.PureComponent<IProps> {
  // As video.playsInline is not defined in HTMLVideoElement, add "any" as well.
  private _videoRef = React.createRef<HTMLVideoElement | any>();

  _updateVideo() {
    const video = this._videoRef.current;
    if (!video) {
      return;
    }

    const { audience } = this.props;
    video.srcObject = audience.stream;
    video.playsInline = true;
    video.play();
  }

  componentDidMount() {
    this._updateVideo();
  }

  componentDidUpdate() {
    this._updateVideo();
  }

  render() {
    const { isMuted, audience, amIPresenter } = this.props;
    return amIPresenter ? (
      <li className="presenter-item">
        <img src={audience.dataURL} className="presenter-item__icon"></img>
        <video
          className="presenter-item__video"
          muted={isMuted}
          ref={this._videoRef}
        />
      </li>
    ) : (
      <div className="presenter-item--none"></div>
    );
  }
}

export default PresenterItem;
