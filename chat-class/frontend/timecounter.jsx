var React = require('react')
var ReactDOM = require('react-dom')

var TimeCounter = React.createClass({
	getInitialState: function(){
		 return {
		 	time: new Date(),
      counter: 0
		 };
	},
	componentDidMount: function(){
		var self = this;
		setInterval(function(){
			self.setState({
				time: new Date()
			})
		}, 1000)
	},
  componentWillUnmount: function(){
  },
  clickHandler: function(){
    this.setState({
      counter: this.state.counter + 1
    })
  },
  resetHandler: function(){
    this.setState({
      counter: 0
    })
  },
	render: function(){
		var date = this.state.time.toString()

		return (<div>
			<p>{date}</p>
      <p>{this.state.counter}</p>
      <p><button onClick={this.clickHandler}>ClickMe</button></p>
      <p><button onClick={this.resetHandler}>Reset</button></p>
		</div>)
	}
})

var HelloWorld = React.createClass({
	render: function(){
		return (<h1>Hello World</h1>)
	}
})

ReactDOM.render(
	<TimeCounter/>,
	document.getElementById('time-counter')
)
