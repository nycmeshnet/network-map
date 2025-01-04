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
        window.addEventListener("message", ({ data, source }) => {
                console.log(JSON.stringify(data));
                // Looking for selectedNodes
                this.updateSelected.bind(this)(data.selectedNodes, false);
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
            console.log("Selected node on map");
            const selectedEvent = new Event("nodeSelectedOnMap");//, {detail: {selectedNodes: selectedNodes}});
            selectedEvent.selectedNodes = selectedNodes;
            window.dispatchEvent(selectedEvent);
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
