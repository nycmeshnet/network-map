import { connect } from "react-redux";
import PureMapView from "./component";

const mapStateToProps = (state, ownProps) => ({
	nodes: state.nodes,
	links: state.links,
	sectors: state.sectors,
	kiosks: state.kiosks,
	filters: state.filters
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PureMapView);
