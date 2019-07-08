import React, { PureComponent } from "react";

import { icons } from "../NodeName";
import { nodeColors } from "../../utils";

// This should be defined elsewhere
const labels = ["active", "supernode", "hub", "potential", "linkNYC"];
const displayLabels = { active: "Total Active" };

export default class Filters extends PureComponent {
	componentDidMount() {
		const { toggleFilter } = this.props;
		const params = new URLSearchParams(this.props.location.search);
		if (params.get("potential") === "true") toggleFilter("potential");
		if (params.get("linknyc") === "true") toggleFilter("linkNYC");
	}

	render() {
		const { showFilters } = this.props;
		if (!showFilters) return null;
		return (
			<div className="bg-white f5 shadow-2">
				<div role="group" className="dib pa2">
					<div>{labels.map(label => this.renderFilter(label))}</div>
				</div>
			</div>
		);
	}

	renderFilter(label) {
		const { filters, statusCounts, toggleFilter } = this.props;
		const enabled = filters[label] || filters[label] === undefined;
		const opacity = enabled ? "o-100" : "o-50 strike";
		const labelDisplay = displayLabels[label] || label;
		return (
			<div
				key={label}
				className={`pointer flex items-center justify-between ${opacity}`}
				onClick={() => toggleFilter(label)}
			>
				<label
					htmlFor={label}
					style={{ color: nodeColors[label] }}
					className="ttc pointer flex items-center nowrap"
				>
					<div
						style={{
							marginLeft: "-0.5rem",
							marginRight: "-0.25rem",
							marginTop: "-0.125rem",
							marginBottom: "-0.125rem"
						}}
						className="h2 w2 flex items-center justify-center"
					>
						{icons[label]}
					</div>
					<span className="ml1">
						{labelDisplay} ({statusCounts[label] || 0})
					</span>
				</label>
				<input
					type="checkbox"
					name={label}
					defaultChecked={enabled}
					className="ma0 ml2 dn"
				/>
			</div>
		);
	}
}
