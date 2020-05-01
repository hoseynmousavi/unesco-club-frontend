import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import MySlider from "../Components/MySlider"
import {Link} from "react-router-dom"
import Material from "../Components/Material"
import PdfSvg from "../../Media/Svgs/PdfSvg"
import Profile from "../../Media/Svgs/Profile"
import DescriptionSvg from "../../Media/Svgs/DescriptionSvg"
import VerifiedUserSvg from "../../Media/Svgs/VerifiedUserSvg"

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
                          marginArrows="0 -10px"
                          nodes={pictures.map(pic =>
                              <div className="home-page-slider-item-cont">
                                  <img className="home-page-slider-item" src={REST_URL + pic.file} alt={pic.description}/>
                                  <div className="home-page-slider-item-desc">{pic.description || " "}</div>
                              </div>,
                          )}
                />

                <div className={`home-page-documents ${documentsLoading ? "" : "loaded"}`}>
                    <div className="home-page-docs-title">
                        <Link to="/documents">
                            <DescriptionSvg className="home-page-docs-title-svg"/>
                            <div className="home-page-docs-title-text">پرونده‌ها</div>
                        </Link>
                    </div>
                    <div className="panel-document-cont home">
                        {
                            documents.map(doc =>
                                <Link key={doc._id} className="home-page-docs-item" to={`/documents/${doc._id}`}>
                                    <Material className="panel-document-item">
                                        {
                                            doc.thumbnail ?
                                                <img className="panel-document-thumb" src={REST_URL + doc.thumbnail} alt={doc.title}/>
                                                :
                                                <PdfSvg className="panel-document-thumb-default"/>
                                        }
                                        <div className="panel-document-item-title">{doc.title}</div>
                                        {doc.summary && <div className="panel-document-item-summary">{doc.summary}</div>}
                                    </Material>
                                </Link>,
                            )
                        }
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
                        {
                            users.map(user =>
                                <Link key={user._id} className="home-page-docs-item" to={`/users/${user._id}`}>
                                    <Material className="panel-document-item">
                                        {
                                            user.avatar ?
                                                <img className="home-avatar-user" src={REST_URL + user.avatar} alt={user.name}/>
                                                :
                                                <Profile className="home-avatar-user"/>
                                        }
                                        <div className="panel-document-item-title">{user.name}</div>
                                        {user.description && <div className="panel-document-item-summary">{user.description}</div>}
                                    </Material>
                                </Link>,
                            )
                        }
                        <div className="home-page-docs-item-hide"/>
                        <div className="home-page-docs-item-hide"/>
                        <div className="home-page-docs-item-hide"/>
                        <div className="home-page-docs-item-hide"/>
                        <div className="home-page-docs-item-hide"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default HomePage