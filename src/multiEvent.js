import React from "react";
import PropTypes from "prop-types";

import moment from "moment-timezone";

import "./index.css";

import { css } from '@emotion/core';

import Tooltip from "./tooltip";

import { isAllDay } from "./utils/helper";

const TooltipWrapper = React.forwardRef((props, ref) => {
  return (<Tooltip innerRef={ref} {...props} />);
});

export default class MultiEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: moment.parseZone(this.props.startTime),
      endTime: moment.parseZone(this.props.endTime),

      showTooltip: false,
    }

    this.state.allDay = isAllDay(this.state.startTime, this.state.endTime);

    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
  }

  closeTooltip() {
    this.setState({showTooltip: false});
  }

  toggleTooltip() {
    this.setState({showTooltip: !this.state.showTooltip});
  }

  render() {
    const leftArrow = css`
      margin-left: 8px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      &:before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0; 
        width: 0;
        height: 0;
        border-right: 8px solid #4786ff;
        border-top: 13px solid transparent;
        border-bottom: 13px solid transparent;
      }
      &:hover::before {
        cursor: pointer;
        border-right-color: #396DCC;
      }
    `;

    const rightArrow = css`
      margin-right: 8px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      &:after {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0; 
        width: 0;
        height: 0;
        border-left: 8px solid #4786ff;
        border-top: 13px solid transparent;
        border-bottom: 13px solid transparent;
      }
      &:hover::after {
        cursor: pointer;
        border-left-color: #396DCC;
      }
    `;

    return (
      <div 
        className="event"
        tabIndex="0"
        onBlur={this.closeTooltip}
        css={css`
          width: ${'calc(' + this.props.length + '00% + ' + (this.props.length - 1) + 'px)'};
          &:focus {
            outline: none;
          }
          position: relative;
        `}
      >
        <div css={[css`
          width: ${'calc(100% - ' + 8 * (this.props.arrowLeft + this.props.arrowRight) + 'px)'};
          border-radius: 3px;
          background: #4786ff;
          &:hover {
            background: #396DCC;
          }
          ${this.props.arrowLeft && leftArrow}
          ${this.props.arrowRight && rightArrow}
        `, this.props.multiEventStyles]}
        onClick={this.toggleTooltip}
        >
          <div 
            className="event-text" 
            css={{
              padding: '3px 0px',
              color: 'white',
              marginLeft: this.props.arrowLeft ? '2px' : '5px',
              marginRight: this.props.arrowRight ? '0px' : '5px',
              overflowX: 'hidden',
              whiteSpace: 'nowrap',
              position: 'relative',
              textAlign: 'left',
              '&:hover': {
                cursor: 'pointer',
              },
              
            }}
          >
            {
              this.state.allDay ? "" : this.state.startTime.format("h:mma ")
            }
            <span css={{fontWeight: "500"}}>
              {this.props.name}
            </span>
          </div>
        </div>
        <TooltipWrapper 
          ref={this.props.innerRef} 
          name={this.props.name}
          startTime={moment.parseZone(this.props.startTime)}
          endTime={moment.parseZone(this.props.endTime)}
          description={this.props.description}
          location={this.props.location}
          tooltipStyles={this.props.tooltipStyles}
          showTooltip={this.state.showTooltip}
          closeTooltip={this.closeTooltip}
        />
      </div>
    )
  }
}

MultiEvent.propTypes = {
  name: PropTypes.string.isRequired,
  startTime: PropTypes.instanceOf(moment).isRequired,
  endTime: PropTypes.instanceOf(moment).isRequired,
  length: PropTypes.number,
  description: PropTypes.string,
  location: PropTypes.string,

  tooltipStyles: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(css),
  ]),
  multiEventStyles: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(css),
  ]),
  arrowLeft: PropTypes.bool,
  arrowRight: PropTypes.bool,
}

MultiEvent.defaultProps = {
  length: 1,
  arrowLeft: false,
  arrowRight: false,
}