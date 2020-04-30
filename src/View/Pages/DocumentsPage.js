import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {Link, Route, Switch} from "react-router-dom"
import Material from "../Components/Material"
import PdfSvg from "../../Media/Svgs/PdfSvg"
import {ClipLoader} from "react-spinners"
import ShowDocumentPage from "./ShowDocumentPage"

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

        api.get("documents", `?limit=20&page=1`)
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
                    api.get("documents", `?limit=20&page=${this.page}`)
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
                    <div className="home-page-cont">
                        <div className={`home-page-documents ${Object.values(documents).length === 0 ? "" : "loaded"}`}>
                            <div className="home-page-docs-title">پرونده‌ها</div>
                            <div className="panel-document-cont home">
                                {
                                    Object.values(documents).map(doc =>
                                        <Link key={doc._id} className="home-page-docs-item" to={`/documents/${doc._id}`}>
                                            <Material className="panel-document-item">
                                                {
                                                    doc.thumbnail ?
                                                        <img className="panel-document-thumb" src={REST_URL + doc.thumbnail} alt=""/>
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
                            {
                                documentsLoading ?
                                    <div className="panel-section-loading-cont"><ClipLoader size={20} color="var(--primary-color)"/></div>
                                    :
                                    Object.values(documents).length === 0 && <div className="panel-section-loading-cont">پرونده ای یافت نشد!</div>
                            }
                        </div>
                    </div>
                </React.Fragment>
            </Switch>
        )
    }
}

export default DocumentsPage