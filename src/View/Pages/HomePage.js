import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import MySlider from "../Components/MySlider"
import {Link} from "react-router-dom"
import DescriptionSvg from "../../Media/Svgs/DescriptionSvg"
import VerifiedUserSvg from "../../Media/Svgs/VerifiedUserSvg"
import User from "../Components/User"
import Document from "../Components/Document"
import LocationSvg from "../../Media/Svgs/LocationSvg"
import RouteItem from "../Components/RouteItem"
import Material from "../Components/Material"
import RightArrow from "../../Media/Svgs/SmoothArrowSvg"
import ShowVideoSvg from "../../Media/Svgs/ShowVideoSvg"

class HomePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            pictures: [],
            picturesLoading: true,
            documents: [],
            documentsLoading: true,
            routes: [],
            routesLoading: true,
            users: [],
            usersLoading: true,
            aparats: [],
            aparatsLoading: true,
            showVideoLinkIndex: 0,
        }
        this.prevX = 0
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("document-picture")
            .then(pictures => this.setState({...this.state, pictures, picturesLoading: false}))

        api.get("documents", `?limit=15&page=1&is_route=false`)
            .then(documents => this.setState({...this.state, documents, documentsLoading: false}))

        api.get("documents", `?limit=15&page=1&is_route=true`)
            .then(routes => this.setState({...this.state, routes, routesLoading: false}))

        api.get("users", `?limit=15&page=1`)
            .then(users => this.setState({...this.state, users, usersLoading: false}))

        api.get("document-aparat")
            .then(aparats => this.setState({...this.state, aparats, aparatsLoading: false}))
    }

    selectAparat(index)
    {
        this.setState({...this.state, showVideoLinkIndex: index})
    }

    goRight = () =>
    {
        if (this.prevX > 0)
        {
            this.prevX -= this.routeCont.clientWidth / (document.body.clientWidth > 480 ? 4 : 1)
            this.routeCont.style.transform = `translateX(${this.prevX}px)`
        }
        else
        {
            this.prevX = this.routeCont.scrollWidth - this.routeCont.clientWidth
            this.routeCont.style.transform = `translateX(${this.prevX}px)`
        }
    }

    goLeft = () =>
    {
        if (this.prevX + this.routeCont.clientWidth < this.routeCont.scrollWidth)
        {
            this.prevX += this.routeCont.clientWidth / (document.body.clientWidth > 480 ? 4 : 1)
            this.routeCont.style.transform = `translateX(${this.prevX}px)`
        }
        else
        {
            this.prevX = 0
            this.routeCont.style.transform = `translateX(${this.prevX}px)`
        }
    }

    render()
    {
        const {pictures, routes, routesLoading, documents, picturesLoading, documentsLoading, users, usersLoading, aparats, aparatsLoading, showVideoLinkIndex} = this.state
        return (
            <div className="home-page-cont">
                {
                    pictures && pictures.length > 0 &&
                    <MySlider className={`home-page-slider ${picturesLoading ? "" : "loaded"} dont-gesture`}
                              dots={true}
                              arrows={true}
                              marginArrows="0 50px"
                              nodes={pictures.map(pic =>
                                  <div className="home-page-slider-item-cont">
                                      <img className="home-page-slider-item" src={REST_URL + pic.file} alt={pic.description}/>
                                      {
                                          pic.description &&
                                          <div className="home-page-slider-item-desc">
                                              <div className="home-page-slider-item-desc-text">{pic.description}</div>
                                          </div>
                                      }
                                  </div>,
                              )}
                    />
                }
                <div className="home-page-cont-child">
                    <div className={`home-page-documents ${documentsLoading ? "" : "loaded"}`}>
                        <div className="home-page-docs-title">
                            <Link to="/documents">
                                <DescriptionSvg className="home-page-docs-title-svg"/>
                                <div className="home-page-docs-title-text">پرونده‌ها</div>
                            </Link>
                        </div>
                        <div className="panel-document-cont home">
                            {documents.map((doc, index) => <Document document={doc} noBorder={index === documents.length - 1} key={doc._id}/>)}
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                        </div>
                    </div>

                    <div className={`home-page-documents ${routesLoading ? "" : "loaded"}`}>
                        <div className="home-page-docs-title users">
                            <Link to="/routes">
                                <LocationSvg className="home-page-docs-title-svg"/>
                                <div className="home-page-docs-title-text">مسیرها</div>
                            </Link>
                        </div>
                        <div className="home-route-cont">
                            <div ref={e => this.routeCont = e} className="home-route-cont-slide">
                                {routes.map((route) => <RouteItem route={route} key={route._id}/>)}
                            </div>
                            <Material className="my-slider-arrow right route-arrows" onClick={this.goRight}>
                                <RightArrow/>
                            </Material>
                            <Material className="my-slider-arrow left route-arrows" onClick={this.goLeft}>
                                <RightArrow/>
                            </Material>
                        </div>
                    </div>

                    {
                        users.length > 0 &&
                        <div className={`home-page-documents ${usersLoading ? "" : "loaded"}`}>
                            <div className="home-page-docs-title users">
                                <Link to="/users">
                                    <VerifiedUserSvg className="home-page-docs-title-svg"/>
                                    <div className="home-page-docs-title-text">فعالین</div>
                                </Link>
                            </div>
                            <div className="panel-document-cont home">
                                {users.map(user => <User user={user} key={user._id}/>)}
                            </div>
                        </div>
                    }

                    {
                        aparats.length > 0 &&
                        <div className={`home-page-documents ${aparatsLoading ? "" : "loaded"}`}>
                            <div className="home-page-docs-title users">
                                <ShowVideoSvg className="home-page-docs-title-svg"/>
                                <div className="home-page-docs-title-text">ویدیوها</div>
                            </div>
                            <div className="home-page-videos">
                                <div className={`home-page-video-show ${aparats.length === 1 ? "full" : ""}`}>
                                    <div className="h_iframe-aparat_embed_frame">
                                        <span style={{display: "block", paddingTop: "57%"}}/>
                                        <iframe title={aparats[showVideoLinkIndex].description || aparats[showVideoLinkIndex].link} src={`https://www.aparat.com/video/video/embed/videohash/${aparats[showVideoLinkIndex].link}/vt/frame`} allowFullScreen={true}/>
                                    </div>
                                </div>
                                <div className="home-page-video-side">
                                    {
                                        [...aparats].map((item, index) =>
                                            index !== showVideoLinkIndex &&
                                            <Material backgroundColor="rgba(255,255,255,0.3)" className="home-page-video-side-item" key={item._id} onClick={() => this.selectAparat(index)}>
                                                <div className="h_iframe-aparat_embed_frame">
                                                    <span style={{display: "block", paddingTop: "57%"}}/>
                                                    <iframe title={item.description || item.link} src={`https://www.aparat.com/video/video/embed/videohash/${item.link}/vt/frame`} allowFullScreen={true}/>
                                                </div>
                                            </Material>,
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    }

                </div>
            </div>
        )
    }
}

export default HomePage