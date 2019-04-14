import React from "react";
import ReactDOM from "react-dom";

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.value;
    this.onClick = props.onClick;
  }

  render() {
    var context = "light";
    switch (this.state.status) {
    case "partial":
      context = "secondary";
      break;
    case "complete":
      context = "primary";
      break;
    }

    // TODO set active highlight somehow?
    return (
    <a href="#" className={"list-group-item-" + context + " list-group-item " + (this.props.filters[this.state.status] ? "d-flex" : "d-none") + " justify-content-between align-items-center"}
      onClick={this.onClick}>
      {this.state.name}
      {(this.state.status == "partial") &&
      <span className="badge badge-warning badge-pill">
        {this.state.text.filter(x => !x.isUnlocked).length}
      </span>
      }
    </a>
    );
  }
}

export default Book;