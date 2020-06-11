import React, {PureComponent} from "react"
import Material from "./Material"
import {Link, NavLink} from "react-router-dom"
import Hamburger from "./Hamburger"
import Logo from "../../Media/Images/Logo.png"

class Header extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            collapseSidebar: true,
        }
        this.deltaX = 0
        this.posX = 0
        this.posY = 0
        this.prevX = null
        this.changing = false
        this.started = false
        this.deltaY = 0
        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
    }

    componentDidMount()
    {
        document.addEventListener("touchstart", this.onTouchStart)
        document.addEventListener("touchmove", this.onTouchMove)
        document.addEventListener("touchend", this.onTouchEnd)
    }

    componentWillUnmount()
    {
        document.removeEventListener("touchstart", this.onTouchStart)
        document.removeEventListener("touchmove", this.onTouchMove)
        document.removeEventListener("touchend", this.onTouchEnd)
    }

    checkParentClass(element, classname)
    {
        if (element.className && element.className.toString().split(" ").indexOf(classname) >= 0) return true
        return element.parentNode && this.checkParentClass(element.parentNode, classname)
    }

    onTouchStart(e)
    {
        if (!this.checkParentClass(e.target, "dont-gesture"))
        {
            this.prevX = !this.state.collapseSidebar ? 0 : this.sidebar ? this.sidebar.clientWidth : 0
            this.posX = e.touches[0].clientX
            this.posY = e.touches[0].clientY
            this.started = true
        }
    }

    onTouchMove(e)
    {
        const {lang} = this.props
        if (lang === "fa")
        {
            this.deltaY = this.posY - e.touches[0].clientY
            this.deltaX = this.posX - e.touches[0].clientX
        }
        else
        {
            this.deltaY = e.touches[0].clientY - this.posY
            this.deltaX = e.touches[0].clientX - this.posX
        }
        if (this.changing || (this.started && this.deltaY < 5 && this.deltaY > -5 && (this.deltaX > 5 || this.deltaX < -5)))
        {
            this.posX = e.touches[0].clientX
            this.prevX = this.prevX - this.deltaX >= 0 ? this.prevX - this.deltaX <= this.sidebar.clientWidth ? this.prevX - this.deltaX : this.sidebar.clientWidth : 0
            this.sidebar.style.transform = `translateX(${lang === "fa" ? this.prevX : -this.prevX}px)`
            this.sidebarBack.style.opacity = `${1 - (this.prevX / this.sidebar.clientWidth)}`
            this.sidebarBack.style.height = `100vh`
            if (this.started)
            {
                document.body.style.overflow = "hidden"
                this.changing = true
            }
            this.started = false
        }
        else this.started = false
    }

    onTouchEnd()
    {
        if (this.changing)
        {
            if (!(this.deltaX > 3) && (this.deltaX < -3 || this.prevX >= this.sidebar.clientWidth / 2))
            {
                this.prevX = this.sidebar.clientWidth
                this.hideSidebar()
            }
            else
            {
                this.prevX = 0
                this.showSidebar()
            }
            this.changing = false
        }
    }

    showSidebar = () =>
    {
        this.setState({...this.state, collapseSidebar: false})
        this.sidebar.style.transition = "transform linear 0.2s"
        this.sidebar.style.transform = `translateX(0px)`
        this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0s"
        this.sidebarBack.style.opacity = `1`
        this.sidebarBack.style.height = `100vh`
        document.body.style.overflow = "hidden"
        setTimeout(() =>
        {
            if (this.sidebar) this.sidebar.style.transition = "initial"
            if (this.sidebarBack) this.sidebarBack.style.transition = "initial"
        }, 250)
    }

    hideSidebar = () =>
    {
        const {lang} = this.props
        this.setState({...this.state, collapseSidebar: true})
        this.sidebar.style.transition = "transform linear 0.1s"
        this.sidebar.style.transform = lang === "fa" ? `translateX(100%)` : `translateX(-100%)`
        this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0.4s"
        this.sidebarBack.style.opacity = `0`
        this.sidebarBack.style.height = `0`
        document.body.style.overflow = "auto"
        setTimeout(() =>
        {
            if (this.sidebar) this.sidebar.style.transition = "initial"
            if (this.sidebarBack) this.sidebarBack.style.transition = "initial"
        }, 250)
    }

    switchLang = () =>
    {
        const {switchLanguage} = this.props
        switchLanguage()
        this.hideSidebar()
    }

    render()
    {
        const {collapseSidebar} = this.state
        const {admin, lang} = this.props
        return (
            <div className="header-cont">

                <Material backgroundColor={!collapseSidebar ? "transparent" : "rgba(0,0,0,0.1)"} className={`header-hamburger-mobile-material ${!collapseSidebar ? "toggle" : ""}`}>
                    <Hamburger className="header-hamburger-mobile" collapse={collapseSidebar} onClick={collapseSidebar ? this.showSidebar : this.hideSidebar}/>
                </Material>

                <Link className="show-mobile" to="/"><h1 className={`header-name ${collapseSidebar ? "" : "on-side"}`}>{lang === "fa" ? "باشگاه گردشگری و محیط زیست یونسکو" : "Tourism and Environment Club"}</h1></Link>

                <div className="header-sidebar-back" style={{opacity: "0", height: "0"}} ref={e => this.sidebarBack = e} onClick={this.hideSidebar}/>
                <div className={`header-sidebar-container ${lang}`} style={{transform: lang === "fa" ? "translateX(100%)" : "translateX(-100%)"}} ref={e => this.sidebar = e}>
                    <Link to="/" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn margin-top">{lang === "fa" ? "خانه" : "home"}</Material></Link>
                    <NavLink to="/sign-up" activeClassName="active" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">{lang === "fa" ? "ثبت نام" : "sign up"}</Material></NavLink>
                    <NavLink to="/documents" activeClassName="active" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">{lang === "fa" ? "پرونده‌ها" : "documents"}</Material></NavLink>
                    <NavLink to="/routes" activeClassName="active" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">{lang === "fa" ? "مسیرها" : "routes"}</Material></NavLink>
                    <NavLink to="/users" activeClassName="active" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">{lang === "fa" ? "فعالین" : "users"}</Material></NavLink>
                    <NavLink to="/about-us" activeClassName="active" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">{lang === "fa" ? "درباره ما" : "about us"}</Material></NavLink>
                    <Material className="header-sidebar-switch" onClick={this.switchLang}>{lang === "fa" ? "تغییر زبان به انگلیسی" : "switch to persian"}</Material>
                    {admin && <NavLink to="/panel" activeClassName="active" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">{lang === "fa" ? "پنل اعضا" : "panel"}</Material></NavLink>}
                </div>

                <div className="header-section show-desktop">
                    <Link to="/"><h1 className="header-name">{lang === "fa" ? "باشگاه گردشگری و محیط زیست یونسکو" : "Tourism and Environment Club"}</h1></Link>
                    <NavLink activeClassName="header-right-section-link-active" to="/sign-up"><Material className="header-right-section-link">{lang === "fa" ? "ثبت نام" : "sign up"}</Material></NavLink>
                    <NavLink activeClassName="header-right-section-link-active" to="/documents"><Material className="header-right-section-link">{lang === "fa" ? "پرونده‌ها" : "documents"}</Material></NavLink>
                    <NavLink activeClassName="header-right-section-link-active" to="/routes"><Material className="header-right-section-link">{lang === "fa" ? "مسیرها" : "routes"}</Material></NavLink>
                    <NavLink activeClassName="header-right-section-link-active" to="/users"><Material className="header-right-section-link">{lang === "fa" ? "فعالین" : "users"}</Material></NavLink>
                    <NavLink activeClassName="header-right-section-link-active" to="/about-us"><Material className="header-right-section-link">{lang === "fa" ? "درباره ما" : "about us"}</Material></NavLink>
                </div>
                <div className="header-section">
                    {admin && <NavLink activeClassName="header-right-section-link-active" className="show-desktop" to="/panel"><Material className="header-right-section-link">{lang === "fa" ? "پنل اعضا" : "panel"}</Material></NavLink>}
                    <Material className="header-sidebar-switch-desk" onClick={this.switchLang}>{lang === "fa" ? "تغییر زبان به انگلیسی" : "switch to persian"}</Material>
                    <Link to="/">
                        <img src={Logo} alt="Tourism and Environment club" className="header-logo"/>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Header