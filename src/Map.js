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

    constructor(props) {
        super(props);
        window.addEventListener("setMapNode", (e) => {
                this.updateSelected.bind(this)(e.selectedNodes, false)
            }
        )
    }

    updateSelected(selectedNodes, triggerEvent = true){
        if (selectedNodes) {
            this.setState({match: {params: {nodeId: selectedNodes}}})
        } else {
            this.setState({match: undefined});
        }
        if (triggerEvent) {
            const selectedEvent = new Event("nodeSelectedOnMap");//, {detail: {selectedNodes: selectedNodes}});
            selectedEvent.selectedNodes = selectedNodes;
            window.dispatchEvent(selectedEvent);
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
