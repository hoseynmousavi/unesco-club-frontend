import React, {PureComponent} from "react"
import {NavLink} from "react-router-dom"
import Material from "../Components/Material"

class PanelSidebar extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.posY = 0
        this.prevY = 0
        this.deltaY = 0
        this.windowHeight = -419
        this.showingSidebar = false
    }

    onTouchStart = (e) =>
    {
        this.posY = e.touches[0].clientY
        document.body.style.overflow = "hidden"
    }

    onTouchMove = (e) =>
    {
        this.deltaY = this.posY - e.touches[0].clientY
        this.posY = e.touches[0].clientY
        this.prevY = this.prevY - this.deltaY <= 0 ? this.prevY - this.deltaY >= this.windowHeight ? this.prevY - this.deltaY : this.windowHeight : 0
        this.sidebar.style.transform = `translateY(${this.prevY}px)`
        this.sidebarBack.style.opacity = `${(this.prevY / this.windowHeight)}`
        this.sidebarBack.style.height = `100vh`
    }

    onTouchEnd = () =>
    {
        if (this.deltaY > 3) this.showSidebar()
        else if (this.deltaY < -3) this.hideSidebar()
        else if (this.prevY > this.windowHeight / 2) this.hideSidebar()
        else this.showSidebar()
    }

    showSidebar = () =>
    {
        this.prevY = this.windowHeight
        this.sidebar.style.transition = "transform linear 0.2s"
        this.sidebar.style.transform = `translateY(${this.prevY}px)`
        this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0s"
        this.sidebarBack.style.opacity = `1`
        this.sidebarBack.style.height = `100vh`
        setTimeout(() =>
        {
            this.showingSidebar = true
            if (this.sidebar) this.sidebar.style.transition = "initial"
            if (this.sidebarBack) this.sidebarBack.style.transition = "initial"
            document.body.style.overflow = "auto"
        }, 250)
    }

    hideSidebar = () =>
    {
        this.prevY = 0
        this.sidebar.style.transition = "transform linear 0.2s"
        this.sidebar.style.transform = `translateY(${this.prevY}px)`
        this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0.4s"
        this.sidebarBack.style.opacity = `0`
        this.sidebarBack.style.height = `0`
        setTimeout(() =>
        {
            this.showingSidebar = false
            if (this.sidebar) this.sidebar.style.transition = "initial"
            if (this.sidebarBack) this.sidebarBack.style.transition = "initial"
            document.body.style.overflow = "auto"
        }, 250)
    }

    switchSide = () => this.showingSidebar ? this.hideSidebar() : this.showSidebar()

    render()
    {
        const {route} = this.props
        const {url} = route.match
        return (
            <React.Fragment>
                <div className="panel-side-bar" ref={e => this.sidebar = e} onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove} onTouchEnd={this.onTouchEnd}>
                    <Material className="panel-side-bar-mobile-line" onClick={this.switchSide}>
                        <div className="panel-side-bar-line"/>
                    </Material>
                    <NavLink onClick={this.hideSidebar} className="panel-side-bar-item-link" activeClassName="selected" to={`${url}/panel/users`}><Material backgroundColor="rgba(0,0,0,0.5)" className="panel-side-bar-item">فعالین</Material></NavLink>
                    <NavLink onClick={this.hideSidebar} className="panel-side-bar-item-link" activeClassName="selected" to={`${url}/panel/documents`}><Material backgroundColor="rgba(0,0,0,0.5)" className="panel-side-bar-item">پرونده‌ها</Material></NavLink>
                    <NavLink onClick={this.hideSidebar} className="panel-side-bar-item-link" activeClassName="selected" to={`${url}/panel/categories`}><Material backgroundColor="rgba(0,0,0,0.5)" className="panel-side-bar-item">دسته‌بندی‌ها</Material></NavLink>
                </div>
                <div className="panel-sidebar-back" style={{opacity: "0", height: "0"}} ref={e => this.sidebarBack = e} onClick={this.hideSidebar}/>
            </React.Fragment>
        )
    }
}

export default PanelSidebar