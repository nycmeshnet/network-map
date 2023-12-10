import React, { PureComponent } from "react";
import { Marker, InfoWindow } from "react-google-maps";

export default class KioskMarker extends PureComponent {

	constructor(props) {
		super(props);
		
		this.state = {
		showInfo: false,
		};
	}

	handleClick = () => {
		this.setState(() => ({
			showInfo: true,
		}));
	};

	closeClick = () => {
		this.setState(() => ({
			showInfo: false,
		}));
	};

	render() {
		const { kiosk, isClassic } = this.props;
		const [lng, lat] = kiosk.coordinates;

		const icon = {
			url: isClassic ? "/img/map/kiosk.svg": "/img/map/kiosk-5g.svg",
			anchor: { x: 5, y: 5 }
		};
		return <Marker defaultPosition={{ lat, lng }} icon={icon} zIndex={1} onClick={this.handleClick}>
          {this.state.showInfo && (
            <InfoWindow onCloseClick={this.handleClick}>
              <div>
			  	<span><b>ID:</b> {kiosk.id}</span><br/>
			  	<span><b>Address:</b> {kiosk.street_address}</span><br/>
			  	<span><b>Type:</b> {kiosk.type}</span><br/>
				<span><b>Status:</b> {kiosk.status}</span></div>
            </InfoWindow>
          )}
		</Marker>;
	}
}
