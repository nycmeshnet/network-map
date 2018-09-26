import React, { PureComponent } from "react";

import { icons } from "../NodeName";
import { nodeColors } from "../../utils";

// This should be defined elsewhere
const labels = ["active", "potential", "supernode", "hub", "linkNYC", "dead"];

export default class Filters extends PureComponent {
	render() {
		return (
			<div className="bt b--light-gray overflow-x-scroll">
				<div role="group" className="dib ph3 pv2 mhn1">
					<div className="flex items-center">
						{labels.map(label => this.renderFilter(label))}
					</div>
				</div>
			</div>
		);
	}

	renderFilter(label) {
		const { filters, toggleFilter } = this.props;
		const opacity =
			filters[label] || filters[label] === undefined
				? "o-100"
				: "o-50 strike";
		return (
			<div key={label} className={`pointer mh2 ${opacity}`}>
				<input
					className="ma0 mr1 dn"
					type="checkbox"
					id={label}
					name="feature"
					value={label}
					checked
				/>
				<label
					for={label}
					style={{ color: nodeColors[label] }}
					className="ttc pointer flex items-center nowrap"
					onClick={() => toggleFilter(label)}
				>
					{icons[label]}
					<span className="ml1">{label.replace("-", " ")}</span>
				</label>
			</div>
		);
	}
}
