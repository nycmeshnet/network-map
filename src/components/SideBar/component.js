import React, { PureComponent } from "react";
import { List, AutoSizer } from "react-virtualized";

import NodeRow from "./NodeRow";
import Filters from "../Filters";

export default class SideBar extends PureComponent {
	state = {
		filteredNodes: [],
		search: ""
	};

	componentDidMount() {
		this.setState({ filteredNodes: this.props.nodes });
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
			<div className="h-100 flex flex-column overflow-hidden">
				<div className="bg-white ph0 w-100 bb b--light-gray ">
					<div className="flex items-center">
						{this.renderSearchIcon()}
						{this.renderSearchBar()}
						{this.renderClearButton()}
					</div>
					<Filters />
				</div>
				{this.renderList()}
			</div>
		);
	}

	rowRenderer({ index, isScrolling, isVisible, key, parent, style }) {
		const { search } = this.state;
		const node = this.state.filteredNodes[index];
		return (
			<div key={key} style={style}>
				<NodeRow
					key={node.id}
					node={node}
					search={search}
					iconColor={this.colorForNode(node)}
				/>
			</div>
		);
	}

	renderSearchBar() {
		return (
			<input
				className="pl2 pv3 pr3 input-reset f5 fw4 bw0 w-100 on"
				value={this.state.search}
				placeholder="Search nodes"
				spellCheck={false}
				autoCorrect="false"
				onChange={event =>
					this.setState({
						search: event.target.value,
						filteredNodes: this.filterSearch(event.target.value)
					})
				}
			/>
		);
	}

	renderList() {
		return (
			<div className="flex h-100">
				{this.state.filteredNodes.length ? (
					<AutoSizer>
						{({ height, width }) => (
							<List
								className="on"
								width={width}
								height={height}
								rowCount={this.state.filteredNodes.length}
								rowHeight={49}
								rowRenderer={options =>
									this.rowRenderer(options)
								}
							/>
						)}
					</AutoSizer>
				) : (
					this.renderEmpty()
				)}
			</div>
		);
	}

	colorForNode(node) {
		const { status, tickets } = node;
		return status === "Installed"
			? "rgb(255,59,48)"
			: tickets && tickets.length > 2
				? "rgb(255,204,0)"
				: "gray";
	}

	renderEmpty() {
		const { search } = this.state;
		return (
			<div className="flex items-center justify-center h-100 w-100">
				<p className="gray">{`No results for "${search}"`}</p>
			</div>
		);
	}

	renderSearchIcon() {
		return (
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
		);
	}

	renderClearButton() {
		const { search } = this.state;

		if (!search || !search.length) {
			return null;
		}

		return (
			<button
				onClick={() =>
					this.setState({
						search: "",
						filteredNodes: this.props.nodes
					})
				}
				className="on btn bn pa0 bg-white pointer mr3"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
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
			return nodes;
		}
		return [
			...nodes.filter(node => node.id === parseInt(search, 10)),
			...nodes
				.filter(
					node =>
						[
							node.name,
							node.location,
							node.notes,
							node.status,
							node.email
						]
							.join(" ")
							.toLowerCase()
							.indexOf(search.toLowerCase()) > -1
				)
				.sort((a, b) => {
					if (a.status !== b.status) {
						if (a.status === "Installed") return -1;
						return 1;
					}
					return 0;
				})
		];
	}
}
