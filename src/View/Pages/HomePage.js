import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import MySlider from "../Components/MySlider"
import {Link} from "react-router-dom"
import DescriptionSvg from "../../Media/Svgs/DescriptionSvg"
import VerifiedUserSvg from "../../Media/Svgs/VerifiedUserSvg"
import User from "../Components/User"
import Document from "../Components/Document"

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
            users: [],
            usersLoading: true,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("document-picture")
            .then(pictures => this.setState({...this.state, pictures, picturesLoading: false}))

        api.get("documents", `?limit=15&page=1`)
            .then(documents => this.setState({...this.state, documents, documentsLoading: false}))

        api.get("users", `?limit=15&page=1`)
            .then(users => this.setState({...this.state, users, usersLoading: false}))
    }

    render()
    {
        const {pictures, documents, picturesLoading, documentsLoading, users, usersLoading} = this.state
        return (
            <div className="home-page-cont">
                <MySlider className={`home-page-slider ${picturesLoading ? "" : "loaded"} dont-gesture`}
                          dots={true}
                          arrows={true}
                          marginArrows="0 50px"
                          nodes={pictures.map(pic =>
                              <div className="home-page-slider-item-cont">
                                  <img className="home-page-slider-item" src={REST_URL + pic.file} alt={pic.description}/>
                                  {pic.description && <div className="home-page-slider-item-desc">{pic.description}</div>}
                              </div>,
                          )}
                />
                <div className="home-page-cont-child">
                    <div className={`home-page-documents ${documentsLoading ? "" : "loaded"}`}>
                        <div className="home-page-docs-title">
                            <Link to="/documents">
                                <DescriptionSvg className="home-page-docs-title-svg"/>
                                <div className="home-page-docs-title-text">پرونده‌ها</div>
                            </Link>
                        </div>
                        <div className="panel-document-cont home">
                            {documents.map(doc => <Document document={doc} key={doc._id}/>)}
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                            <div className="home-page-docs-item-hide"/>
                        </div>
                    </div>

                    <div className={`home-page-documents ${usersLoading ? "" : "loaded"}`}>
                        <div className="home-page-docs-title">
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