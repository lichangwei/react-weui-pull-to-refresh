import React, { PropTypes } from 'react';

var isTouchSupported = 'ontouchstart' in document.documentElement;

var utils = {
    events: {
        start: isTouchSupported ? 'touchstart' : 'mousedown',
        move:  isTouchSupported ? 'touchmove'  : 'mousemove',
        end:   isTouchSupported ? 'touchend'   : 'mouseup'
    },

    getTouchPositionY: function(e){
        return e.pageY || e.clientY ||
            (e.touches && e.touches[0] ? e.touches[0].pageY : 0);
    }
};

export default class extends React.Component {

    static propTypes = {
        onRefresh: PropTypes.func.isRequired,
        distance:  PropTypes.number,
        disabled:  PropTypes.bool
    }

    static defaultProps = {
        distance: 50,
        disabled: false
    }

    state = {
        status: '',
        startY: 0,
        diffY: 0,
        style: {}
    }

    onTouchStart = (e)=>{
        if(this.props.disabled) return;
        if(this.state.status === 'loading') return;
        this.startY = utils.getTouchPositionY(e);
        this.diffY = 0;

        document.addEventListener(utils.events.move, this.onTouchMove);
        document.addEventListener(utils.events.end,  this.onTouchEnd);
    }

    onTouchMove = (e)=>{
        if(this.props.disabled) return;
        if(this.state.status === 'loading') return;
        if(!this.startY) return;
        //if(this.container.scrollTop() > 0) return;
        this.diffY = Math.abs(this.startY - utils.getTouchPositionY(e));
        console.log(this.diffY)
        if(this.diffY < 0) return;
        e.preventDefault();
        e.stopPropagation();
        //阻力，
        this.diffY = Math.pow(this.diffY, 0.8);

        this.setState({
            style: {
                'webkitTransform': `translate3d(0, ${this.diffY}px, 0)`,
                      'transform': `translate3d(0, ${this.diffY}px, 0)`,
                'webkitTransitionDuration': '0s',
                      'transitionDuration': '0s'
            },
            status: this.diffY < this.props.distance ? 'pull-down' : 'pull-up'
        });
    }

    onTouchEnd = ()=>{
        document.removeEventListener(utils.events.move, this.onTouchMove);
        document.removeEventListener(utils.events.end,  this.onTouchEnd);
        if(this.props.disabled) return;
        this.startY = 0;
        if(this.diffY <= 0 || this.state.status === 'loading') return;
        var status = null;
        if(this.diffY < this.props.distance){
            status = '';
        }else{
            status = 'loading';
            var callback = ()=>{
                this.setState({status: ''});
            };
            this.props.onRefresh(callback, callback);
        }
        this.setState({
            style: {
                'webkitTransform': '',
                      'transform': '',
                'webkitTransitionDuration': '',
                      'transitionDuration': ''
            },
            status: status
        });
    }

    componentDidMount() {
        this.refs.container.addEventListener(utils.events.start, this.onTouchStart);
    }

    componentWillUnmount() {
        this.refs.container.removeEventListener(utils.events.start, this.onTouchStart);
    }

    render() {
        if(this.props.disabled){
            return <div>{this.props.children}</div>;
        }
        return (
            <div className={`weui-pull-to-refresh ${this.state.status}`} style={this.state.style} ref="container">
                <div className="p2r-layer">
                    <div className="p2r-arrow"></div>
                    <div className="p2r-loading"></div>
                    <div className="p2r-down">下拉刷新</div>
                    <div className="p2r-up">释放刷新</div>
                    <div className="p2r-refresh">正在刷新...</div>
                </div>
                {this.props.children}
            </div>
        );
    }
};