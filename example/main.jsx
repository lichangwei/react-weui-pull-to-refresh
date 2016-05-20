import React from 'react';
import ReactDOM from 'react-dom';

import PullToRefresh from '../src/PullToRefresh.jsx';

import '../src/pull-to-refresh.css!';

class Example extends React.Component{
	
	state = {
		disabled: false,
		distance: 50
	}

	onRefresh = (onSuccess, onFail)=>{
		setTimeout(onSuccess, 3000);
	}

	change = (e)=>{
		let elem = e.target;
		let key = elem.getAttribute('name');
		let val = elem.getAttribute('value');
		if(key === 'disabled'){
			val = (val === 'true');
		}else{
			val = parseInt(val);
		}
		this.setState({
			[key]: val
		});
	}

	render(){
		return (
			<PullToRefresh onRefresh={this.onRefresh} {...this.state}>
				<div>
					<div>
						<p>Change disabled:</p>
						<label>
							<input type="radio" name="disabled" value="false" checked={!this.state.disabled} onChange={this.change} />Enabled
						</label>
						<label>
							<input type="radio" name="disabled" value="true" checked={this.state.disabled} onChange={this.change} />Disabled
						</label>
					</div>
					<div>
						<p>Change distance:</p>
						<label>
							<input type="radio" name="distance" value="50" checked={this.state.distance === 50} onChange={this.change} />50
						</label>
						<label>
							<input type="radio" name="distance" value="100" checked={this.state.distance === 100} onChange={this.change} />100
						</label>
					</div>
				</div>
			</PullToRefresh>
		);
	}
};

ReactDOM.render(
	<Example />,
	document.body.appendChild(document.createElement('div'))
)