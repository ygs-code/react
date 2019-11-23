// const H = require('./../H.js');
class Clock extends React.Component {
    constructor (props) {
        super(props);
        this.state = { date: new Date(), count: 1 };
    }
    addCount() {
        const { count } = this.state;
        this.setState({
            count: count + 1,
        })
    }
    render() {
        const { date, count } = this.state;
        return (
            <div>
                <h1>Hello, world!</h1>
                {/* <H /> */}
                <h2>现在是 {date.toLocaleTimeString()}.</h2>
                <button onClick={() => this.addCount()}>add1 count</button>
                <button onClick={this.addCount.bind(this)}>add2 count</button>
                <h2>count {count}</h2>
            </div>
        );
    }
}

ReactDOM.render(
    <Clock />,
    document.getElementById('parser')
);








