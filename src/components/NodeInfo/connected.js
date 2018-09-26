import { connect } from "react-redux";
import PureNodeInfo from "./component";

import { selectNode } from "../../actions";

const mapStateToProps = (state, ownProps) => ({
	nodes: state.nodes,
	links: state.links
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	selectNode: node => selectNode(node, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PureNodeInfo);
