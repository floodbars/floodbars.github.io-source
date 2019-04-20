import React from "react";
import ReactDOM from "react-dom";
import BookHint from "./BookHint.jsx";

class Page extends React.Component {
  render() {
    if (this.props.page.isUnlocked) {
      return (
        <div className={"card mb-3 "}>
          {this.props.page.description &&
            <div className="card-header p-2">{this.props.page.description}</div>
          }
          <div className="preview card-body p-2 p-sm-3">
            {this.props.page.text.split("\n").map((paragraph, index) => (
              <p key={"p-" + index}>{paragraph}</p>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="bd-callout bd-callout-warning text-secondary p-2 p-sm-3">
          <span className="badge badge-warning mr-2">
            Missing
          </span>
          {this.props.page.description &&
            this.props.page.description
          }
          {this.props.page.achievement && !this.props.hideHint &&
            <BookHint value={this.props.page.achievement.name} />
          }
        </div>
      );
    }
  }
}

export default Page;