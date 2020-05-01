import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import ImageShow from "../Components/ImageShow"
import SummarySvg from "../../Media/Svgs/SummarySvg"
import TitleSvg from "../../Media/Svgs/TitleSvg"
import DescriptionSvg from "../../Media/Svgs/DescriptionSvg"
import LocationSvg from "../../Media/Svgs/LocationSvg"
import CategorySvg from "../../Media/Svgs/CategorySvg"

class ShowDocumentPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isLoading: true,
            document: null,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {id} = this.props
        api.get("document", id)
            .then(document => this.setState({...this.state, document, isLoading: false}))
            .catch(err =>
            {
                if (err?.response?.status === 404) this.setState({...this.state, notFound: true})
                else this.setState({...this.state, error: true})
            })
    }

    render()
    {
        const {notFound, error, document, isLoading} = this.state
        return (
            <div className="document-page-cont">
                {
                    error ?
                        <div className="document-page-err">خطایی رخ داد؛ دوباره تلاش کنید!</div>
                        :
                        notFound ?
                            <div className="document-page-err">پرونده مورد نظر یافت نشد!</div>
                            :
                            document ?
                                <React.Fragment>
                                    {document.thumbnail && <ImageShow className="document-page-thumb" src={REST_URL + document.thumbnail} alt={document.title}/>}
                                    <div className="document-page-field">
                                        <TitleSvg className="document-page-field-svg"/>
                                        <div className="document-page-field-text">{document.title}</div>
                                    </div>
                                    {
                                        document.summary &&
                                        <div className="document-page-field">
                                            <SummarySvg className="document-page-field-svg"/>
                                            <div className="document-page-field-text">{document.summary}</div>
                                        </div>
                                    }
                                    {
                                        document.description &&
                                        <div className="document-page-field">
                                            <DescriptionSvg className="document-page-field-svg"/>
                                            <div className="document-page-field-text">{document.description}</div>
                                        </div>
                                    }
                                    {
                                        document.location &&
                                        <div className="document-page-field">
                                            <LocationSvg className="document-page-field-svg"/>
                                            <div className="document-page-field-text">{document.location}</div>
                                        </div>
                                    }
                                    {
                                        document.categories && document.categories.length > 0 &&
                                        <div className="document-page-cats">
                                            <CategorySvg className="document-page-field-svg cat"/>
                                            {
                                                document.categories.map(cat =>
                                                    <Material key={cat._id} className="panel-select-show-categories-item">
                                                        {cat.name}
                                                    </Material>,
                                                )
                                            }
                                        </div>
                                    }
                                    {
                                        document.pictures && document.pictures.length > 0 &&
                                        <div className="document-page-pics">
                                            {
                                                document.pictures.map(img =>
                                                    <ImageShow key={img._id} className="document-page-pics-item" src={REST_URL + img.file} alt={img.description}/>,
                                                )
                                            }
                                        </div>
                                    }
                                    {
                                        document.films && document.films.length > 0 &&
                                        <div className="document-page-pics">
                                            {
                                                document.films.map(video =>
                                                    <video key={video._id} className="document-page-pics-item" controls controlsList="nodownload">
                                                        <source src={REST_URL + video.file}/>
                                                    </video>,
                                                )
                                            }
                                        </div>
                                    }
                                </React.Fragment>
                                :
                                isLoading && <div className="panel-section-loading-cont"><ClipLoader size={20} color="var(--primary-color)"/></div>
                }
            </div>
        )
    }
}

export default ShowDocumentPage