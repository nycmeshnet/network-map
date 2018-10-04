import { connect } from "react-redux";
import PureFilters from "./component";

import { toggleFilter } from "../../actions";

const mapStateToProps = (state, ownProps) => ({
	filters: state.filters,
	statusCounts: state.statusCounts
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	toggleFilter: label => toggleFilter(label, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PureFilters);
