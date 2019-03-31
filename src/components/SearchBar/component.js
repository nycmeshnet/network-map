import React, { PureComponent } from "react";
import { withRouter } from "react-router";

import NodeRow from "./NodeRow";

class SearchBar extends PureComponent {
	state = {
		filteredNodes: [],
		search: "",
		showDropdown: false,
		focused: false
	};

	componentDidMount() {
		this.keyDownHandler = this.handleKeyDown.bind(this);
		window.addEventListener("keydown", this.keyDownHandler, false);
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.keyDownHandler, false);
	}

	handleKeyDown(event) {
		const { history } = this.props;
		const { focused, filteredNodes } = this.state;
		const { keyCode } = event;
		if (keyCode === 13 && focused && filteredNodes.length) {
			history.push(`/nodes/${filteredNodes[0].id}`);
			this.setState({ showDropdown: false });
			this.refs.search.blur();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Super hacky, do this better
		if (
			prevState.search === this.state.search &&
			prevProps.nodes !== this.props.nodes
		) {
			this.setState({
				filteredNodes: this.filterSearch(this.state.search)
			});
		}
	}

	render() {
		return (
			<div className="w-100 shadow-2">
				{this.renderSearchBar()}
				{this.renderList()}
			</div>
		);
	}

	renderSearchBar() {
		const { toggleFilters } = this.props;
		return (
			<div
				className="flex items-center bg-white overflow-hidden"
				onClick={() => {
					this.refs.search.focus();
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#aaa"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="ml3 db"
					style={{ minWidth: 20 }}
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<input
					ref="search"
					className="sans-serif overflow-hidden pl2 pr3 pv3 input-reset f5 fw4 bw0 w-100 on"
					value={this.state.search}
					placeholder="Search nodes"
					spellCheck={false}
					autoCorrect="false"
					onFocus={() =>
						this.setState({ showDropdown: true, focused: true })
					}
					onBlur={() => this.setState({ focused: false })}
					onChange={event =>
						this.setState({
							search: event.target.value,
							filteredNodes: this.filterSearch(event.target.value)
						})
					}
				/>
				{this.renderClearButton()}
				<button
					className="h2 w2 bn bg-transparent mr2 pointer"
					onClick={() => toggleFilters()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="4" y1="21" x2="4" y2="14" />
						<line x1="4" y1="10" x2="4" y2="3" />
						<line x1="12" y1="21" x2="12" y2="12" />
						<line x1="12" y1="8" x2="12" y2="3" />
						<line x1="20" y1="21" x2="20" y2="16" />
						<line x1="20" y1="12" x2="20" y2="3" />
						<line x1="1" y1="14" x2="7" y2="14" />
						<line x1="9" y1="8" x2="15" y2="8" />
						<line x1="17" y1="16" x2="23" y2="16" />
					</svg>
				</button>
			</div>
		);
	}

	renderList() {
		if (!this.state.filteredNodes.length || !this.state.showDropdown) {
			return null;
		}

		const { search } = this.state;
		return (
			<div className="bg-white bt b--light-gray max-h-5-rows overflow-y-scroll">
				{this.state.filteredNodes.map(node => (
					<NodeRow
						key={node.id}
						node={node}
						search={search}
						onClick={() => this.setState({ showDropdown: false })}
					/>
				))}
			</div>
		);
	}

	renderClearButton() {
		const { search } = this.state;

		if (!search || !search.length) {
			return (
				<div
					className="mr3"
					style={{
						width: 20,
						height: 20
					}}
				/>
			);
		}

		return (
			<button
				onClick={() => {
					this.setState({
						search: "",
						filteredNodes: []
					});
				}}
				className="on btn bn pa0 bg-white pointer mr3 silver"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="db"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		);
	}

	filterSearch(search) {
		const { nodes } = this.props;
		if (!search) {
			return [];
		}

		const lowerSearch = search.toLowerCase();

		return [
			...nodes.filter(
				node =>
					node.id === parseInt(search, 10) ||
					lowerSearch === `node ${node.id}`
			),
			...nodes
				.filter(node => {
					const notesMatch =
						node.notes &&
						node.notes.toLowerCase().indexOf(lowerSearch) > -1;
					const nameMatches =
						node.name &&
						node.name.toLowerCase().indexOf(lowerSearch) > -1;
					return notesMatch || nameMatches;
				})
				.sort((a, b) => {
					if (a.status !== b.status) {
						if (a.status === "active") return -1;
						return 1;
					}
					return a.id - b.id;
				})
		];
	}
}

export default withRouter(SearchBar);
