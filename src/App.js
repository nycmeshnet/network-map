import { createStore } from "redux";
import { Provider } from "react-redux";
import DocumentTitle from "react-document-title";
import { BrowserRouter as Router, Route } from "react-router-dom";

import React, { Component } from "react";
import SideBar from "./components/SideBar";
import MapView from "./components/MapView";
import NodeInfo from "./components/NodeInfo";
import Gallery from "./components/Gallery";

import rootReducer from "./reducers";

const store = createStore(rootReducer);

class App extends Component {
	render() {
		return (
			<DocumentTitle title="Network Map - NYC Mesh">
				<Provider store={store}>
					<Router basename={"/map"}>
						<div className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden sans-serif">
							<div className="h-100 w-100">
								<SideBar />
								<Route
									path="/nodes/:nodeId"
									component={NodeInfo}
								/>
								<Route
									path="/nodes/:nodeId"
									children={({ match }) => (
										<MapView match={match} />
									)}
								/>
							</div>
							<Route
								path="/nodes/:nodeId/panoramas/:panoId"
								component={Gallery}
							/>
						</div>
					</Router>
				</Provider>
			</DocumentTitle>
		);
	}

	handleNodeClick(node) {}
}

export default App;
