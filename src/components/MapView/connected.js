import { connect } from "react-redux";
import PureMapView from "./component";
import {fetchLinks, fetchNodes, fetchSectors} from "../../actions";

const mapStateToProps = (state, ownProps) => ({
	nodes: state.nodes,
	links: state.links,
	sectors: state.sectors,
	kiosksClassic: state.kiosksClassic,
	kiosks5g: state.kiosks5g,
	filters: state.filters
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	fetchNodes: () => fetchNodes(dispatch),
	fetchLinks: () => fetchLinks(dispatch),
	fetchSectors: () => fetchSectors(dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PureMapView);
