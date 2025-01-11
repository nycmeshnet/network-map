import {createStore} from "redux";
import {Provider} from "react-redux";

import React, {Component} from "react";
import MapView from "./components/MapView";

import rootReducer from "./reducers";
import { MESHDB_URL } from "./actions";

const store = createStore(rootReducer);

class Map extends Component {
    state = {
        match: {params: {nodeId: ""}},
    }

    constructor(props) {
        super(props);
        window.addEventListener("message", ({ data, source }) => {
            // Looking for selectedNodes
            this.updateSelected.bind(this)(data.selectedNodes, false);

            console.log(`Got message from Admin Panel: ${JSON.stringify(this.state)}`);
        });
    }

    updateSelected(selectedNodes, triggerEvent = true){
        console.log(`updating admin panel location: ${selectedNodes}`);
        if (selectedNodes) {
            this.setState({match: {params: {nodeId: selectedNodes}}})
        } else {
            this.setState({match: undefined});
        }
        if (triggerEvent) {
            window.parent.postMessage({selectedNodes: selectedNodes}, MESHDB_URL);
        }
    }

    render() {
        return (
            <Provider store={store}>
                <div className="helvetica" style={{width: "100%"}}>
                    <MapView match={this.state.match} updateSelected={this.updateSelected.bind(this)}/>
                </div>
            </Provider>
        );
    }
}

export default Map;
