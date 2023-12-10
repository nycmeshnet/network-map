import { connect } from "react-redux";
import PureMapView from "./component";

const mapStateToProps = (state, ownProps) => ({
	nodes: state.nodes,
	links: state.links,
	sectors: state.sectors,
	kiosksClassic: state.kiosksClassic,
	kiosks5g: state.kiosks5g,
	filters: state.filters
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PureMapView);
