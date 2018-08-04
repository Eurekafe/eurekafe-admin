
class newsletter extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			ajout: "",
			list: [
			{
				id: 1,
				mail: "mail"
			},
			{
				id: 2,
				mail: "oui"
			}
			]
		}

		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.getList();
	}

	getList() {
		$.get("/newsletter/getall", function(data) {
			if(data) {
				this.setState({list: data});
			}
			else {
				this.setState({list: ["an error occured"]});
			}
		}.bind(this));
	}

	deleteId(e, id) {
		e.preventDefault();
		console.log(id);
		$.get("/newsletter/del/" + id, function() {
			this.getList();
		}.bind(this));
	}

	insertEmail(event, email) {
		event.preventDefault();
		console.log(email);
		$.post("/newsletter/create", {email}, function(response) {
			console.log(response)
		 	this.getList();
		}.bind(this));
	}

	renderList() {
		return (
			<ul className="col-6">
				{this.state.list.map( (data, i) => {
						return (
							<li key={ i }> 
								<p>
									{data.email}&nbsp;
									<a href="" onClick={(e)=> this.deleteId(e, data._id)}>supprimer</a>
								</p>
							</li>
						);
					})
				}
			</ul>
		);
	}

	handleChange(event) {
		console.log(event.target.value);
		this.setState({ajout: event.target.value});
	}

	render() {
		return(
			<div className="container">
				<div className="row text-center">
					<h1 className="col">Newsletter</h1>
				</div>
				<div className="row">
					{this.renderList()}
					<div className="col-6">
						<h2>Ajout manuel:</h2>
						<p>
							<input type="text" value={this.state.ajout} placeholder="email" onChange={this.handleChange} className="mr-2"/>
							<a href="" onClick={(e) => this.insertEmail(e, this.state.ajout)}>Ajouter</a>
						</p>
						<h2>
							<a href="/newsletter/newsletter-csv">Extract csv</a>
						</h2>
						<h2> Recherche </h2>
						<p> À venir </p>
					</div>
				</div>
			</div>
		);
	}
	
} 

module.exports = newsletter;