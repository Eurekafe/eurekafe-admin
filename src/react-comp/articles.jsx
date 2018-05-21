
import { Link } from "react-router-dom";

class articles extends React.Component {

	constructor(props) {
		super(props);
		this.state={
			list: []
		};
	}

	componentDidMount() {
		this.getList();
	}

	getList() {
		$.get("/articles/getNewsNames", (data) => {
			console.log(data);
			this.setState({list: data});
		});
	}


	render() {
		return(
			<div>
				<h1>articles</h1>
				{this.state.list.map( (val, i) => {
					return (<div key={i}><Link to={"/main/articles/"+val._id}>{val.title}</Link></div>);
				})}
			</div>
		);
	}
	
} 

module.exports = articles;