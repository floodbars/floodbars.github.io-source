import React from "react";
import ReactDOM from "react-dom";

class Page extends React.Component {
  render() {
    var text = "Page Missing";
    var style = "warning";
    if (this.props.page.isUnlocked) {
      text = this.props.page.text;
      style = "primary";
    }
    return (
      <div className={"card mb-3 border-" + style}>
        {this.props.page.description &&
          <div className="card-header">{this.props.page.description}</div>
        }
        <div className="preview card-body">
          {text.split("\n").map((paragraph, index) => (
            <p key={"p-" + index}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  }
}

export default Page;