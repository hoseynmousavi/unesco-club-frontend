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
        const {lang} = this.props
        if (this.prevX > 0)
        {
            this.prevX -= this.routeCont.clientWidth / (document.body.clientWidth > 480 ? 4 : 1)
            this.routeCont.style.transform = `translateX(${lang === "fa" ? this.prevX : -this.prevX}px)`
        }
        else
        {
            this.prevX = this.routeCont.scrollWidth - this.routeCont.clientWidth
            this.routeCont.style.transform = `translateX(${lang === "fa" ? this.prevX : -this.prevX}px)`
        }
    }

    goLeft = () =>
    {
        const {lang} = this.props
        if (this.prevX + this.routeCont.clientWidth < this.routeCont.scrollWidth)
        {
            this.prevX += this.routeCont.clientWidth / (document.body.clientWidth > 480 ? 4 : 1)
            this.routeCont.style.transform = `translateX(${lang === "fa" ? this.prevX : -this.prevX}px)`
        }
        else
        {
            this.prevX = 0
            this.routeCont.style.transform = `translateX(${lang === "fa" ? this.prevX : -this.prevX}px)`
        }
    }

    render()
    {
        const {pictures, routes, routesLoading, documents, picturesLoading, documentsLoading, users, usersLoading, aparats, aparatsLoading, showVideoLinkIndex} = this.state
        const {lang} = this.props
        return (
            <div className="home-page-cont">
                {
                    pictures && pictures.length > 0 &&
                    <MySlider key={lang} className={`home-page-slider ${picturesLoading ? "" : "loaded"} dont-gesture`}
                              lang={lang}
                              dots={true}
                              arrows={true}
                              marginArrows="0 50px"
                              nodes={pictures.map(pic =>
                                  <div className="home-page-slider-item-cont">
                                      <img className="home-page-slider-item" src={REST_URL + pic.file} alt={pic.description}/>
                                      {
                                          ((lang === "fa" && pic.description) || (lang === "en" && pic.description_en)) &&
                                          <div className={`home-page-slider-item-desc ${lang}`}>
                                              <div className={`home-page-slider-item-desc-text ${lang}`}>{lang === "fa" ? pic.description : pic.description_en}</div>
                                              <span> </span>
                                          </div>
                                      }
                                  </div>,
                              )}
                    />
                }
                <div className="home-page-cont-child">
                    <div className={`home-page-documents ${documentsLoading ? "" : "loaded"}`}>
                        <div className={`home-page-docs-title ${lang}`}>
                            <Link to="/documents">
                                <DescriptionSvg className="home-page-docs-title-svg"/>
                                <div className={`home-page-docs-title-text ${lang}`}>{lang === "fa" ? "پرونده‌ها" : "documents"}</div>
                            </Link>
                        </div>
                        <div className={`panel-document-cont home ${lang}`}>
                            {documents.map((doc, index) => <Document lang={lang} document={doc} noBorder={index === documents.length - 1} key={doc._id}/>)}
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                        </div>
                    </div>

                    <div className={`home-page-documents ${routesLoading ? "" : "loaded"}`}>
                        <div className={`home-page-docs-title users ${lang}`}>
                            <Link to="/routes">
                                <LocationSvg className="home-page-docs-title-svg"/>
                                <div className={`home-page-docs-title-text ${lang}`}>{lang === "fa" ? "مسیرها" : "routes"}</div>
                            </Link>
                        </div>
                        <div className="home-route-cont">
                            <div ref={e => this.routeCont = e} className="home-route-cont-slide">
                                {routes.map((route) => <RouteItem lang={lang} route={route} key={route._id}/>)}
                            </div>
                            <Material className={`my-slider-arrow route-arrows ${lang === "fa" ? "right" : "left"}`} onClick={this.goRight}>
                                <RightArrow/>
                            </Material>
                            <Material className={`my-slider-arrow route-arrows ${lang !== "fa" ? "right" : "left"}`} onClick={this.goLeft}>
                                <RightArrow/>
                            </Material>
                        </div>
                    </div>

                    {
                        users.length > 0 &&
                        <div className={`home-page-documents ${usersLoading ? "" : "loaded"}`}>
                            <div className={`home-page-docs-title users ${lang}`}>
                                <Link to="/users">
                                    <VerifiedUserSvg className="home-page-docs-title-svg"/>
                                    <div className={`home-page-docs-title-text ${lang}`}>{lang === "fa" ? "فعالین" : "users"}</div>
                                </Link>
                            </div>
                            <div className={`panel-document-cont home ${lang}`}>
                                {users.map(user => <User lang={lang} user={user} key={user._id}/>)}
                            </div>
                        </div>
                    }

                    {
                        aparats.length > 0 &&
                        <div className={`home-page-documents ${aparatsLoading ? "" : "loaded"}`}>
                            <div className={`home-page-docs-title users ${lang}`}>
                                <ShowVideoSvg className="home-page-docs-title-svg"/>
                                <div className={`home-page-docs-title-text ${lang}`}>{lang === "fa" ? "ویدیوها" : "videos"}</div>
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