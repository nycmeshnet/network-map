import React, { PureComponent } from "react";

import { icons } from "../NodeName";
import { nodeColors } from "../../utils";

// This should be defined elsewhere
const labels = [
	"active",
	"vpn",
	"kiosk",
	"omni",
	"hub",
	"supernode",
	"potential",
	"linkNYC"
];
const displayLabels = { active: "node" };

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
					<div className="flex flex-column-ns flex-wrap justify-between">
						{labels.map(label => this.renderFilter(label))}
						{this.renderFilter("sector")}
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
		const sanitizedLabel = label.replace("-", " ");
		const labelName = displayLabels[sanitizedLabel] || sanitizedLabel;

		function renderLabel(label) {
			if (label === "vpn") return "VPN";
			return label;
		}

		return (
			<div
				key={label}
				className={`w-auto-ns w-50 pointer flex items-center justify-between ${opacity}`}
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
						{renderLabel(label)}{" "}
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
