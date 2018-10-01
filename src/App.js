import { createStore } from "redux";
import { Provider } from "react-redux";
import DocumentTitle from "react-document-title";
import { BrowserRouter as Router, Route } from "react-router-dom";

import React, { Component } from "react";
import SearchBar from "./components/SearchBar";
import MapView from "./components/MapView";
import Filters from "./components/Filters";
import Gallery from "./components/Gallery";

import rootReducer from "./reducers";

const store = createStore(rootReducer);

class App extends Component {
	render() {
		return (
			<DocumentTitle title="Network Map - NYC Mesh">
				<Provider store={store}>
					<Router basename={"/map"}>
						<div className="vh-75 sans-serif">
							<div className="h-100 w-100 relative">
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
									<Filters />
								</div>
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
