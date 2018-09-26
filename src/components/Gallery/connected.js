import { connect } from "react-redux";
import PureGallery from "./component";

const mapStateToProps = (state, ownProps) => ({
	nodes: state.nodes
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PureGallery);
