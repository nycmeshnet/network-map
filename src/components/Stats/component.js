import React, { PureComponent } from "react";

export default class Stats extends PureComponent {
	render() {
		const { statusCounts, filters } = this.props;
		if (!statusCounts) return null;
		
		const {
			active = 0,
			hub = 0,
			supernode = 0,
			omni = 0,
			remote = 0,
			kiosk = 0,
			ap = 0,
			apFudge = 42
		} = statusCounts;
		const totalCount = filters.backbone
			? active + hub + supernode + omni
			: active + hub + supernode + omni + remote + kiosk + ap + apFudge;
		const nodeCount = filters.backbone
			? active
			: active + omni + remote + kiosk;
		const hubCount = filters.backbone ? hub + omni : hub;
		const apCount = ap + apFudge - 3 //faking this until all APs are in spreadsheet
		return (
			<div className="ph3 bg-white">
				<div className="measure-wide center pt4-ns pb3-ns pt3">
					<div className="flex flex-wrap justify-between f3 fw6">
						<span className="mr3 mb3">
							{totalCount}{" "}
							<span className="mid-gray db f4 fw5">Total</span>
						</span>
						<span className="mr3 mb3 orange">
							{apCount}{" "}
							<span className="mid-gray db f4 fw5">AP</span>
						</span>
						<span className="mr3 mb3 pink">
							{nodeCount}{" "}
							<span className="mid-gray db f4 fw5">Non-hub</span>
						</span>
						<span className="mr3 mb3 light-blue">
							{hubCount}{" "}
							<span className="mid-gray db f4 fw5">Hub</span>
						</span>
						<span className="mr3 mb3 blue">
							{supernode}{" "}
							<span className="mid-gray db f4 fw5">
								SN
							</span>
						</span>
					</div>
				</div>
			</div>
		);
	}
}
