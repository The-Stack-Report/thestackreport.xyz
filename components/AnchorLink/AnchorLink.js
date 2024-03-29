import _ from 'lodash'
import React, {Component} from 'react'

class AnchorLink extends Component {
  constructor(props) {
    super(props)
    this.smoothScroll = this.smoothScroll.bind(this)
  }
  componentDidMount() {
    require('./smoothscroll').polyfill()
  }
  smoothScroll(e) {
    if(_.has(this.props, "onSelectCallback")) {
      this.props.onSelectCallback()
    }
    e.preventDefault()
    let offset = () => 0
    if (typeof this.props.offset !== 'undefined') {
      if (!!(this.props.offset && this.props.offset.constructor && this.props.offset.apply)) {
        offset = this.props.offset
      } else {
        offset = () => parseInt(this.props.offset)
      }
    }
    const id = e.currentTarget.getAttribute('href').slice(1)
    const $anchor = document.getElementById(id);
    const offsetTop = $anchor.getBoundingClientRect().top + window.pageYOffset;
    window.scroll({
      top: offsetTop - offset(),
      behavior: 'smooth'
    })
    if (this.props.onClick) {this.props.onClick(e)}
  }
  render() {
    const { offset, onSelectCallback, ...rest } = this.props;
    return (
      <a {...rest} onClick={this.smoothScroll} />
    )
  }
}

export default AnchorLink