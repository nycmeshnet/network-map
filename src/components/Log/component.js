import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { icons } from "../NodeName";

export default class Log extends PureComponent {
	state = {
		limit: 3
	};

	render() {
		const { links, filters, toggleFilter } = this.props;
		const { limit } = this.state;
		// if (!filters.changelog)
		// 	return (
		// 		<div className="ph3 bg-white">
		// 			<div className="measure-wide center pt3 flex justify-center">
		// 				<button
		// 					className="bg-transparent bn pa0 gray mb4 pointer"
		// 					onClick={() => toggleFilter("changelog", true)}
		// 				>
		// 					Show changelog
		// 				</button>
		// 			</div>
		// 		</div>
		// 	);

		const sortedLinks = links
			.filter(link => link.status === "active" && link.installDate)
			.sort((a, b) => new Date(b.installDate) - new Date(a.installDate));

		links.forEach(link => {
			if (link.status === "active" && (!link.fromNode || !link.toNode)) {
				return;
			}
		});

		function renderHorizontalLink(link) {
			return (
				<div className="flex items-center">
					<div className="ml2 mr3 w2 flex flex-column items-center justify-center">
						<span className="flex items-center justify-center">
							{icons[link.fromNode.type]}
						</span>
						<div
							className="bg-blue h1"
							style={{
								width: "0.2rem"
								// marginTop: "-0.25rem"
							}}
						/>
						<span className="flex items-center justify-center">
							{icons[link.toNode.type]}
						</span>
					</div>
					<div className="">
						<time className="f6 fw5 mid-gray mb1 db">
							{format(link.installDate, "ddd, MMM D")}
						</time>
						<div>
							<span>
								<span className="fw6">
									{link.fromNode.name || `Node ${link.from}`}
								</span>
								<span className="mid-gray"> connected to </span>
								<span className="fw6">
									{link.toNode.name || `Node ${link.to}`}
								</span>
							</span>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="ph3 pb3 bg-white">
				<div className="measure-wide center">
					{sortedLinks.slice(0, limit).map(link => {
						return (
							<Link
								key={`${link.from} ${link.to}`}
								to={`/nodes/${link.from}-${link.to}`}
								onClick={event => {
									window.scroll(0, 0);
								}}
								className="db pv3 bb b--light-gray no-underline black hover-bg-near-white"
							>
								{renderHorizontalLink(link)}
							</Link>
						);
					})}
					{limit < sortedLinks.length ? (
						<button
							className="mv4 center bg-transparent bn pa0 blue pointer"
							onClick={() => this.setState({ limit: limit * 2 })}
						>
							Show more
						</button>
					) : null}
				</div>
			</div>
		);
	}
}
