import React from "react";
import ReactDOM from "react-dom";
import FilterSelection from "./FilterSelection.jsx";

class Filter extends React.Component {
  setValue(name, value) {
    this.props.onSelectionChange(name, value);
  }

  render() {
    var filterStates = this.props.filters;
    // how do we fix this to the top?
    console.log(filterStates.products);
    return (
      <div className="input-group mb-2">
        <label className="my-1 mr-2">Show only</label>
        <div className="btn-group-toggle mr-1">
          {Object.keys(filterStates).map((name) => (
            <FilterSelection key={name}
              name={name}
              isChecked={filterStates[name]}
              onChange={(value) => this.setValue(name, value)} />
          ))}
        </div>
      </div>
    );
  }
}

export default Filter;