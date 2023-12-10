import React, { PureComponent } from "react";

import { icons } from "../NodeName";
import { nodeColors } from "../../utils";

// This should be defined elsewhere
const labels = [
	"active",
	"remote",
	"kiosk",
	"omni",
	"hub",
	"supernode",
	"potential",
	"potential-hub",
	"potential-supernode",
	"linkNYC Classic",
	"linkNYC 5G",
	"sector"
];

export default class Filters extends PureComponent {
	componentDidMount() {
		const { toggleFilter } = this.props;
		const params = new URLSearchParams(this.props.location.search);
		if (params.get("potential") === "true") toggleFilter("potential");
	}

	render() {
		const { showFilters } = this.props;
		if (!showFilters) return null;
		return (
			<div className="bg-white f5 shadow-2">
				<div role="group" className="dib pa2">
					<div className="flex flex-column-ns flex-wrap justify-between">
						{labels.map(label => this.renderFilter(label))}
						{this.renderFilter("backbone", true)}
					</div>
				</div>
			</div>
		);
	}

	renderFilter(label, hideCount) {
		const { filters, statusCounts, toggleFilter } = this.props;
		const enabled = filters[label] || filters[label] === undefined;
		const opacity = enabled ? "o-100" : "o-50 strike";

		function getLabel(label) {
			return label.replace("-", " ");
		}

		// Hack to change omni color based on backbone filter
		function getIcon(label) {
			if (label === "omni" && !filters.backbone) return icons.active;
			if (label === "remote" && filters.backbone) return icons.remote;
			return icons[label];
		}

		function getColor(label) {
			if (label === "omni" && !filters.backbone) return nodeColors.active;
			return nodeColors[label];
		}

		return (
			<div
				key={label}
				className={`w-auto-ns w-50 pointer flex items-center justify-between ${opacity}`}
				onClick={() => toggleFilter(label)}
			>
				<label
					htmlFor={label}
					style={{ color: getColor(label) }}
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
						{getIcon(label)}
					</div>

					<span className="ml1">
						{getLabel(label)}{" "}
						{hideCount ? null : `(${statusCounts[label] || 0})`}
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
