import React, {PureComponent} from "react"
import Material from "../Components/Material"
import api, {REST_URL} from "../../Functions/api"
import {NotificationManager} from "react-notifications"
import CreateDocument from "./CreateDocument"
import {ClipLoader} from "react-spinners"
import PdfSvg from "../../Media/Svgs/PdfSvg"
import {Switch, Route, Link} from "react-router-dom"
import PanelShowDocument from "./PanelShowDocument"

class Documents extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            getLoading: true,
            documents: {},
            isModalOpen: false,
            categories: {},
        }

        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("document", `?limit=20&page=1`)
            .then(data => this.setState({...this.state, getLoading: false, documents: data.reduce((sum, doc) => ({...sum, [doc._id]: doc}), {})}))

        api.get("document/category", `?limit=1000&page=1`)
            .then(data => this.setState({...this.state, categories: data.reduce((sum, cat) => ({...sum, [cat._id]: cat}), {})}))

        document.addEventListener("scroll", this.onScroll)
        window.addEventListener("popstate", this.onPop)
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
        window.removeEventListener("popstate", this.onPop)
    }

    onPop = () =>
    {
        if (this.state.isModalOpen)
        {
            document.body.style.overflow = "auto"
            this.setState({...this.state, isModalOpen: false})
        }
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
                this.setState({...this.state, getLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("document", `?limit=20&page=${this.page}`)
                        .then(data =>
                        {
                            this.page += 1
                            this.setState({...this.state, getLoading: false, documents: {...documents, ...data.reduce((sum, doc) => ({...sum, [doc._id]: doc}), {})}})
                        })
                })
            }
        }, 20)
    }

    toggleModal = () =>
    {
        const isModalOpen = !this.state.isModalOpen
        if (isModalOpen)
        {
            document.body.style.overflow = "hidden"
            window.history.pushState("", "", "/panel/documents/add")
            this.setState({...this.state, isModalOpen})
        }
        else window.history.back()
    }

    removeItem = (document_id, callback) =>
    {
        let result = window.confirm("از حذف مطمئنید؟")
        if (result)
        {
            api.del("document", {document_id})
                .then(() =>
                {
                    const documents = {...this.state.documents}
                    delete documents[document_id]
                    this.setState({...this.state, documents}, () =>
                    {
                        NotificationManager.success("حذف شد")
                        callback()
                    })
                })
                .catch((e) => NotificationManager.error(e.message))
        }
    }

    addDocument = doc => this.setState({...this.state, documents: {[doc._id]: {...doc}, ...this.state.documents}})

    setDocument = document => this.setState({...this.state, documents: {...this.state.documents, [document._id]: {...document}}})

    render()
    {
        const {isModalOpen, categories, documents, getLoading} = this.state
        return (
            <Switch>
                <Route path="/panel/documents/:id" render={(route) =>
                    <PanelShowDocument id={route.match.params.id}
                                       categories={categories}
                                       document={documents[route.match.params.id]}
                                       setDocument={this.setDocument}
                                       removeItem={this.removeItem}
                    />}
                />

                <React.Fragment>
                    <div className="panel-section-big">
                        <div className="panel-document-cont">
                            {
                                Object.values(documents).map(doc =>
                                    <Link key={doc._id} className="panel-document-item-link" to={`/panel/documents/${doc._id}`}>
                                        <Material className="panel-document-item panel">
                                            {
                                                doc.thumbnail ?
                                                    <img className="panel-document-thumb" src={REST_URL + doc.thumbnail} alt=""/>
                                                    :
                                                    <PdfSvg className="panel-document-thumb-default"/>
                                            }
                                            <div className="panel-document-item-title">{doc.title}</div>
                                            {doc.summary && <div className="panel-document-item-summary">{doc.summary}</div>}
                                            {doc.is_route && <div className="panel-doc-route-label">مسیر</div>}
                                        </Material>
                                    </Link>,
                                )
                            }
                            <div className="panel-document-item-hide"/>
                            <div className="panel-document-item-hide"/>
                            <div className="panel-document-item-hide"/>
                            <div className="panel-document-item-hide"/>
                        </div>
                        {
                            getLoading ?
                                <div className="panel-section-loading-cont"><ClipLoader size={20} color="var(--primary-color)"/></div>
                                :
                                Object.values(documents).length === 0 && <div className="panel-section-loading-cont">پرونده ای یافت نشد!</div>
                        }

                        <Material className="panel-add-item-btn" onClick={this.toggleModal}>+</Material>
                        {isModalOpen && <CreateDocument toggleModal={this.toggleModal} categories={categories} addDocument={this.addDocument}/>}
                    </div>
                </React.Fragment>
            </Switch>
        )
    }
}

export default Documents