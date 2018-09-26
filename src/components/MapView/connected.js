import { connect } from "react-redux";
import PureMapView from "./component";

import { selectNode } from "../../actions";

const mapStateToProps = (state, ownProps) => ({
	nodes: state.filteredNodes,
	links: state.links,
	kiosks: state.kiosks,
	tickets: state.tickets
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	selectNode: node => selectNode(node, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PureMapView);
