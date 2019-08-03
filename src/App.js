import { createStore } from "redux";
import { Provider } from "react-redux";
import DocumentTitle from "react-document-title";
import { BrowserRouter as Router, Route } from "react-router-dom";

import React, { Component } from "react";
import SearchBar from "./components/SearchBar";
import MapView from "./components/MapView";
import Filters from "./components/Filters";
import Stats from "./components/Stats";
import Log from "./components/Log";

import rootReducer from "./reducers";

const store = createStore(rootReducer);

class App extends Component {
	render() {
		return (
			<DocumentTitle title="Map - NYC Mesh">
				<Provider store={store}>
					<Router basename="/map">
						<div className="helvetica">
							<div
								id="map-stats-container"
								className="h-100 w-100 flex flex-column"
							>
								<div className="h-100 w-100 relative flex flex-column">
									<div className="absolute pa2 z-999 search-bar">
										<SearchBar />
									</div>
									<Route
										path="/nodes/:nodeId"
										children={({ match }) => (
											<MapView match={match} />
										)}
									/>
									<div className="absolute bottom-0 left-0 ma2">
										<Route component={Filters} />
									</div>
								</div>
								<Route path="/" component={Stats} />
							</div>
							<Route path="/" component={Log} />
						</div>
					</Router>
				</Provider>
			</DocumentTitle>
		);
	}

	handleNodeClick(node) {}
}

export default App;
