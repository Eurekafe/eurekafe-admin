import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import DateTime from "react-datetime";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export class event extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			modalContent: (<div>empty</div>),
			currentDeleteId: null,
			currentDeleteTitle: "",
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
		this.closeModal = this.closeModal.bind(this);
		this.modalEventInsert = this.modalEventInsert.bind(this);
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
								<h3>{data.title} <a href="" onClick={(e) => this.modalDelete(e,data)}>supprimer</a></h3>
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

	modalEventInsert() {
		let dateString = "" + new Date(this.state.date.format());
		let modalContent = (
			<div>
				<h3>Créer l'evenement {this.state.title} ?</h3>
				<p>description: {this.state.desc}</p>
				<p>date: {dateString}</p>
				<p>lien: {this.state.link}</p>
				<div className="d-flex flex-row justify-content-around">
					<button className="btn btn-success" onClick={(e) => this.submitEvent(e)}>Oui</button>
					<button className="btn btn-danger" onClick={this.closeModal}>Non</button>
				</div>
 			</div>
		);
		this.setState({
			modalContent,
			modalIsOpen: true
		});
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
			this.setState({
				modalIsOpen: false,
				title: "",
				desc: "",
				link: "",
				date: ""
			});
		}.bind(this));	
	}

	modalDelete(e, data) {
		e.preventDefault();
		let modalContent = (
			<div>
				<h3>supprimer {data.title} ?</h3>
				<div className="d-flex flex-row justify-content-around">
					<button className="btn btn-success" onClick={(e) => this.deleteEvent(e,data._id)}>Oui</button>
					<button className="btn btn-danger" onClick={this.closeModal}>Non</button>
				</div>
 			</div>
		);
		this.setState({
			modalContent,
			modalIsOpen: true
		});
	}

	deleteEvent(e, id) {
		console.log(id);
		$.get("/events/del/" + id, function() {
		 	this.getEvents();
		 	this.setState({modalIsOpen: false});
		}.bind(this));
		
	}

	closeModal() {
    	this.setState({modalIsOpen: false});
  	}

	render() {
		return(
			<div>
				<table className="m-5"><tbody>
					<tr>
						<td className="p-2"><label className="mr-2">Titre</label></td>
						<td><input onChange={this.titleChange} type="text" className="form-control" value={this.state.title} /></td>
					</tr>
					<tr>
						<td className="p-2"><label className="mr-2">Description</label></td>
						<td><textarea onChange={this.descChange} cols="100" rows="8" className="form-control" value={this.state.desc}></textarea></td>
					</tr>
					<tr>
						<td className="p-2"><label className="mr-2">Date</label></td>
						<td><DateTime onChange={this.dateChange} /></td>
					</tr>
					<tr>
						<td className="p-2"><label className="mr-2">Lien</label></td>
						<td><input type="text" onChange={this.linkChange} className="form-control" value={this.state.link} /></td>
					</tr>
					<tr>
						<td className="p-2"></td>
						<td><button onClick={this.modalEventInsert} className="btn btn-primary">Ajouter</button></td>
					</tr>
			
				</tbody></table>
				<div>{this.renderList()}</div>
				<Modal
	          		isOpen={this.state.modalIsOpen}
	          		onAfterOpen={this.afterOpenModal}
	          		onRequestClose={this.closeModal}
	          		style={customStyles}
	          		contentLabel="Supprimer evenement"
        		>
 					{this.state.modalContent}
        		</Modal>
			</div>
		);
	}
	
} 
