import React, { PureComponent } from "react";

import { icons } from "../NodeName";
import { nodeColors } from "../../utils";

// This should be defined elsewhere
const labels = ["active", "supernode", "hub", "potential", "linkNYC"];

export default class Filters extends PureComponent {
	render() {
		return (
			<div className="bg-white shadow-2">
				<div role="group" className="dib pa2">
					<div>{labels.map(label => this.renderFilter(label))}</div>
				</div>
			</div>
		);
	}

	renderFilter(label) {
		const { filters, statusCounts, toggleFilter } = this.props;
		const opacity =
			filters[label] || filters[label] === undefined
				? "o-100"
				: "o-50 strike";
		return (
			<div key={label} className={`pointer ${opacity}`}>
				<input
					className="ma0 mr1 dn"
					type="checkbox"
					id={label}
					name="feature"
					value={label}
					defaultChecked={true}
				/>
				<label
					htmlFor={label}
					style={{ color: nodeColors[label] }}
					className="ttc pointer flex items-center nowrap"
					onClick={() => toggleFilter(label)}
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
						{label.replace("-", " ")} ({statusCounts[label] || 0})
					</span>
				</label>
			</div>
		);
	}
}
