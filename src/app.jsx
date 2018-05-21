
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

var dash = require("./react-comp/dashboard.jsx");
var event = require("./react-comp/event.jsx");
var articles = require("./react-comp/articles.jsx");
var freq = require("./react-comp/freq.jsx");
var newsletter = require("./react-comp/newsletter.jsx");
var network = require("./react-comp/network.jsx");

class App extends React.Component {
	render() {
		return (
			<Router>
				<div>
					<nav className="navbar navbar-expang-lg nav-light bg-light">
						<div >
	  						<Link to="/main/dashboard">dashboard</Link>
	  					</div>
	  					<div>
	  						<Link to="/main/events">événement</Link>
	  					</div>
	  					{/*<div>
	  						<Link to="/main/articles">articles</Link>
	  					</div>*/}
	  					{/*<div>
	  					 	<Link to="/main/freq">fréquentation</Link>
	  					</div>*/}
	  					<div>
	  						<Link to="/main/newsletter">newsletter</Link>
	  					</div>
	  					{/*<div>
	  						<Link to="/main/network">Réseaux sociaux</Link>
	  					</div>*/}
	  					<div>
	  						<button className="btn btn-danger" onClick={() => {window.location='/logout';}}>logout</button>
	  					</div>
	  				</nav>
	  				<Route path="/main/dashboard" component={dash} />
  					<Route path="/main/events" component={event} />
  					<Route path="/main/articles" component={articles} />
  					<Route path="/main/freq" component={freq} />
  					<Route path="/main/newsletter" component={newsletter} />
  					<Route path="/main/network" component={network} />
  				</div>
  			</Router>
		);
	}
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);