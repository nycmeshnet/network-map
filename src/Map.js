import {createStore} from "redux";
import {Provider} from "react-redux";

import React, {Component} from "react";
import MapView from "./components/MapView";


import rootReducer from "./reducers";

const store = createStore(rootReducer);

class Map extends Component {
    state = {
        match: {params: {nodeId: "238-240"}},
    }

    updateSelected(selectedNodes){
        if (selectedNodes) {
            this.setState({match: {params: {nodeId: selectedNodes}}})
        } else {
            this.setState({match: undefined});
        }
    }

    render() {
        return (
            <Provider store={store}>
                <div className="helvetica">
                    <MapView match={this.state.match} updateSelected={this.updateSelected.bind(this)}/>
                </div>
            </Provider>
        );
    }
}

export default Map;
