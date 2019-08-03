import { connect } from "react-redux";
import PureComponent from "./component";

const mapStateToProps = (state, ownProps) => ({
	nodes: state.nodes,
	links: state.links,
	sectors: state.sectors,
	nodesById: state.nodesById,
	statusCounts: state.statusCounts,
	filters: state.filters
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PureComponent);
