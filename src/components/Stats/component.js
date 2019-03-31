import React, { PureComponent } from "react";

export default class Stats extends PureComponent {
	render() {
		const { statusCounts } = this.props;
		if (!statusCounts) return null;
		const { active, hub, supernode } = statusCounts;
		const total = active + hub + supernode;
		return (
			<div className="ph3">
				<div className="measure-wide center pv4-ns pv3">
					<div className="flex justify-between f3 fw6">
						<span className="mr3">
							{total}{" "}
							<span className="mid-gray db f4">Nodes</span>
						</span>
						<span className="mr3 pink">
							{active}{" "}
							<span className="mid-gray db f4">Active</span>
						</span>
						<span className="mr3 light-blue">
							{hub} <span className="mid-gray db f4">Hubs</span>
						</span>
						<span className="mr3 blue">
							{supernode}{" "}
							<span className="mid-gray db f4">Supernodes</span>
						</span>
					</div>
				</div>
			</div>
		);
	}
}
