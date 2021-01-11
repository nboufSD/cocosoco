import React from "react";

import { Member } from "../types";

import "./NewcomerItem.css";

interface IProps {
  newcomer: Member;
}

class NewcomerItem extends React.PureComponent<IProps> {
  render() {
    const { newcomer } = this.props;

    return <img className="newcomer-item" src={newcomer.dataURL} />;
  }
}

export default NewcomerItem;
