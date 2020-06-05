import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {Route, Switch} from "react-router-dom"
import {ClipLoader} from "react-spinners"
import ShowDocumentPage from "./ShowDocumentPage"
import DescriptionSvg from "../../Media/Svgs/DescriptionSvg"
import Document from "../Components/Document"

class DocumentsPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            documents: [],
            documentsLoading: true,
        }

        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("documents", `?limit=20&page=1&is_route=false`)
            .then(documents => this.setState({...this.state, documents: documents.reduce((sum, doc) => ({...sum, [doc._id]: doc}), {}), documentsLoading: false}))

        document.addEventListener("scroll", this.onScroll)
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {documents} = this.state
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (Object.values(documents).length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, documentsLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("documents", `?limit=20&page=${this.page}&is_route=false`)
                        .then(data =>
                        {
                            this.page += 1
                            this.setState({...this.state, documentsLoading: false, documents: {...documents, ...data.reduce((sum, doc) => ({...sum, [doc._id]: doc}), {})}})
                        })
                })
            }
        }, 20)
    }

    render()
    {
        const {documentsLoading, documents} = this.state
        return (
            <Switch>
                <Route path="/documents/:id" render={(route) => <ShowDocumentPage id={route.match.params.id}/>}/>

                <React.Fragment>
                    <div className="doc-page-cont">
                        <div className={`home-page-documents ${Object.values(documents).length === 0 ? "" : "loaded"}`}>
                            <div className="home-page-docs-title page">
                                <DescriptionSvg className="home-page-docs-title-svg"/>
                                <div className="home-page-docs-title-text">پرونده‌ها</div>
                            </div>
                            <div className="panel-document-cont home">
                                {Object.values(documents).map(doc => <Document document={doc} key={doc._id}/>)}
                                <div className="home-page-docs-item-hide"/>
                                <div className="home-page-docs-item-hide"/>
                                <div className="home-page-docs-item-hide"/>
                                <div className="home-page-docs-item-hide"/>
                                <div className="home-page-docs-item-hide"/>
                            </div>
                            <div className="loading-section-cont">
                                {
                                    documentsLoading ?
                                        <div className="panel-section-loading-cont"><ClipLoader size={20} color="var(--primary-color)"/></div>
                                        :
                                        Object.values(documents).length === 0 && <div className="panel-section-loading-cont">پرونده ای یافت نشد!</div>
                                }
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            </Switch>
        )
    }
}

export default DocumentsPage