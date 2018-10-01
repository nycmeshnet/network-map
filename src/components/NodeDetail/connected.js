import { connect } from "react-redux";
import PureComponent from "./component";

import { toggleFilter } from "../../actions";

const mapStateToProps = (state, ownProps) => ({
	nodes: state.nodes
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PureComponent);
