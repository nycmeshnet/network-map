import { connect } from "react-redux";
import PureComponent from "./component";

import { toggleFilter } from "../../actions";

const mapStateToProps = (state, ownProps) => ({
	nodes: state.nodes,
	links: state.links,
	sectors: state.sectors,
	nodesById: state.nodesById,
	statusCounts: state.statusCounts,
	filters: state.filters
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	toggleFilter: label => toggleFilter(label, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PureComponent);
