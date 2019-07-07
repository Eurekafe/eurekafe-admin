import DateTime from "react-datetime";

export class event extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			title: "",
			desc: "",
			link: "",
			date: "",
			eventList: []
		};
		this.titleChange = this.titleChange.bind(this);
		this.descChange = this.descChange.bind(this);
		this.dateChange = this.dateChange.bind(this);
		this.linkChange = this.linkChange.bind(this);
		this.submitEvent = this.submitEvent.bind(this);
	}

	componentDidMount() {
		this.getEvents();
	}

	getEvents() {
		$.get("/events/all", function(data) {
			if(data) {
				console.log(data);
				this.setState({eventList: data});
			} else {
				this.setState({eventList: ["An error occured"]})
			}
		}.bind(this));
	};

	renderList() {
		return (
			<ul>
				{this.state.eventList.map( (data, i) => {
						return (
							<li key={ i }>
								<h3>{data.title} <a href="" onClick={(e) => this.deleteId(e,data._id)}>supprimer</a></h3>
								<p>{data.desc}</p>
								<p>{data.date}</p>
								<p><a href={"https://www.facebook.com/events/" + data.link} target="_blank" rel="noopener">{data.link}</a></p>
							</li>
						);
					})
				}
			</ul>
		);
	}

	titleChange(title) {
		this.setState({title: title.target.value})
	}

	descChange(desc) {
		this.setState({desc: desc.target.value})
	}

	dateChange(date) {
		this.setState({date});
		console.log(new Date(date.format()));
	}

	linkChange(link) {
		this.setState({link: link.target.value})
	}

	submitEvent() {
		var data = {
			title: this.state.title,
			desc: this.state.desc,
			date: new Date(this.state.date.format()),
			link: this.state.link
		}
		$.post("/events/create", data, function(response) {
			console.log(response);
			this.getEvents();
		}.bind(this));	
	}

	deleteId(e, id) {
		e.preventDefault();
		$.get("/events/del/" + id, function() {
			this.getEvents();
		}.bind(this));
	}

	render() {
		return(
			<div>
				<table className="m-5"><tbody>
					<tr>
						<td className="p-2"><label className="mr-2">Titre</label></td>
						<td><input onChange={this.titleChange} type="text" className="form-control" /></td>
					</tr>
					<tr>
						<td className="p-2"><label className="mr-2">Description</label></td>
						<td><textarea onChange={this.descChange} cols="100" rows="8" className="form-control"></textarea></td>
					</tr>
					<tr>
						<td className="p-2"><label className="mr-2">Date</label></td>
						<td><DateTime onChange={this.dateChange} /></td>
					</tr>
					<tr>
						<td className="p-2"><label className="mr-2">Lien</label></td>
						<td><input type="text" onChange={this.linkChange} className="form-control" /></td>
					</tr>
					<tr>
						<td className="p-2"></td>
						<td><button onClick={this.submitEvent} className="btn btn-primary">Ajouter</button></td>
					</tr>
			
				</tbody></table>
				<div>{this.renderList()}</div>
			</div>
		);
	}
	
} 
