import { connect } from "react-redux";
import PureSearchBar from "./component";
import { toggleFilters } from "../../actions";

const mapStateToProps = (state, ownProps) => ({
	nodes: state.nodes,
	tickets: state.tickets
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	toggleFilters: () => toggleFilters(dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PureSearchBar);
