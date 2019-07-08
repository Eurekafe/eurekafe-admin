

import { Link } from "react-router-dom";

export class dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			frequentation: "...",
			lastNL: {email: "...", count: "..."}
		};
	}

	getFreq() {
		$.get("/freq/get", function(data) {
		    if(data) {
		      this.setState({frequentation: data});
		    }
		    else {
		      this.setState({frequentation: "non défini"});
		    }
		}.bind(this));
	}

	getNewsletter() {
		$.get("/newsletter/getlast", function(data) {
		    if(data) {
		      this.setState({lastNL: data});
		    }
		    else {
		      this.setState({lastNL: {email: "n/a", count: "n/a"}});
		    }
		}.bind(this));
	}

	render() {
		if (this.state.frequentation == "...") {
			this.getFreq()
		}
		if (this.state.lastNL.email == "...") {
			this.getNewsletter()
		}
		return(
			<div>
				<h1 className="text-center">Dashboard</h1>
				<div className="container">
					<div className="row">
						<div className="col bg-light">
							<h2>Newsletter</h2>
							<p>Nombre d'inscrit: {this.state.lastNL.count}</p>
							<p>Dernier inscrit: {this.state.lastNL.email}</p>
							<Link to="/main/newsletter" className="btn btn-primary mx-auto">
								plus
							</Link>
						</div>
						<div className="col bg-light text-center">
							<h2>Fréquentation</h2>
							<form method="post" action="/freq/set">
								<h3 className="py-2 mx-3">{this.state.frequentation}</h3>
								<input type="text" name="freq" />
								<input type="submit" value="Mettre à jour" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
	
} 
