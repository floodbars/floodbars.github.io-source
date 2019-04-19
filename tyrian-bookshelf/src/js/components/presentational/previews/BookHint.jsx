import React from "react";
import ReactDOM from "react-dom";

class BookHint extends React.Component {

  render() {
    const name = this.props.value;
    var article = encodeURIComponent(name);

    return (
      <div className="card text-dark bg-light mb-2 mt-2">
        <div className="preview card-body">
            <span class="badge badge-warning rounded-circle p-2 mr-3">💡</span>
            <b>Hint</b>: <a href={"https://wiki.guildwars2.com/wiki/" + article} target="_new" className="text-info">{name}</a>
        </div>
      </div>
    );
  }
}

export default BookHint;