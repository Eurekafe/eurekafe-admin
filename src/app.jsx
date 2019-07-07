
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import {dashboard} from "./react-comp/dashboard.jsx";
import {event} from "./react-comp/event.jsx";
import {articles} from "./react-comp/articles.jsx";
import {freq} from "./react-comp/freq.jsx";
import {newsletter} from "./react-comp/newsletter.jsx";
import {network} from "./react-comp/network.jsx";
 
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
	  				<Route path="/main/dashboard" component={dashboard} />
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