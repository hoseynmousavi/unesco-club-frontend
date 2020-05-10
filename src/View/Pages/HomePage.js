import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import MySlider from "../Components/MySlider"
import {Link} from "react-router-dom"
import DescriptionSvg from "../../Media/Svgs/DescriptionSvg"
import VerifiedUserSvg from "../../Media/Svgs/VerifiedUserSvg"
import User from "../Components/User"
import Document from "../Components/Document"
import LocationSvg from "../../Media/Svgs/LocationSvg"

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
        }
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
    }

    render()
    {
        const {pictures, routes, routesLoading, documents, picturesLoading, documentsLoading, users, usersLoading} = this.state
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
                        <div className="panel-document-cont home">
                            {routes.map((doc, index) => <Document document={doc} noBorder={index === routes.length - 1} key={doc._id}/>)}
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                        </div>
                    </div>

                    <div className={`home-page-documents ${usersLoading ? "" : "loaded"}`}>
                        <div className="home-page-docs-title users">
                            <Link to="/users">
                                <VerifiedUserSvg className="home-page-docs-title-svg"/>
                                <div className="home-page-docs-title-text">فعالین</div>
                            </Link>
                        </div>
                        <div className="panel-document-cont home">
                            {users.map(user => <User user={user} key={user._id}/>)}
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default HomePage