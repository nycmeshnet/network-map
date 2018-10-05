import { connect } from "react-redux";
import PureMapView from "./component";

const mapStateToProps = (state, ownProps) => ({
	nodes: state.filteredNodes,
	links: state.filteredLinks,
	sectors: state.sectors,
	kiosks: state.kiosks,
	tickets: state.tickets
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PureMapView);
