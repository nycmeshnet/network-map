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
					<Router>
						<div className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-row-ns flex-column-reverse justify-between sans-serif">
							<div className="h-100-ns h-50 w-100 sidebar-width br-ns bb b--light-gray relative">
								<Route path="/" component={SideBar} />
								<Route
									path="/nodes/:nodeId"
									component={NodeInfo}
								/>
							</div>
							<div className="h-100-ns h-50 w-100">
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
