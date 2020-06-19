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
        const {lang} = this.props
        return (
            <div className="document-page-cont">
                {
                    error ?
                        <div className="document-page-err">{lang === "fa" ? "خطایی رخ داد؛ دوباره تلاش کنید!" : "an error occurred; try again!"}</div>
                        :
                        notFound ?
                            <div className="document-page-err">{lang === "fa" ? "پرونده مورد نظر یافت نشد!" : "the file was not found!"}</div>
                            :
                            document ?
                                <React.Fragment>
                                    {document.thumbnail && <ImageShow className="document-page-thumb" src={REST_URL + document.thumbnail} alt={lang === "fa" ? document.title : document.title_en}/>}
                                    <div className={`document-page-field ${lang}`}>
                                        <TitleSvg className={`document-page-field-svg ${lang}`}/>
                                        <div className={`document-page-field-dialog ${lang}`}>{lang === "fa" ? "عنوان" : "title"}</div>
                                        <div className={`document-page-field-text inline ${lang}`}>{lang === "fa" ? document.title : document.title_en}</div>
                                    </div>
                                    {
                                        ((lang === "fa" && document.summary) || (lang === "en" && document.summary_en)) &&
                                        <div className="document-page-field">
                                            <SummarySvg className={`document-page-field-svg ${lang}`}/>
                                            <div className={`document-page-field-dialog ${lang}`}>{lang === "fa" ? "خلاصه" : "summary"}</div>
                                            <div className={`document-page-field-text inline ${lang}`}>{lang === "fa" ? document.summary : document.summary_en}</div>
                                        </div>
                                    }
                                    {
                                        ((lang === "fa" && document.description) || (lang === "en" && document.description_en)) &&
                                        <div className="document-page-field">
                                            <DescriptionSvg className={`document-page-field-svg ${lang}`}/>
                                            <div className={`document-page-field-dialog ${lang}`}>{lang === "fa" ? "توضیحات" : "description"}</div>
                                            <div className={`document-page-field-text inline ${lang} ${document.pictures && document.pictures.length > 0 ? "have-img" : ""}`}>{lang === "fa" ? document.description : document.description_en}</div>
                                            {
                                                document.pictures && document.pictures.length > 0 &&
                                                <ImageShow key={document.pictures[0]._id} className={`document-page-field-img ${lang}`} src={REST_URL + document.pictures[0].file} alt={document.pictures[0].description}/>
                                            }
                                        </div>
                                    }
                                    {
                                        ((lang === "fa" && document.location) || (lang === "en" && document.location_en)) &&
                                        <div className="document-page-field">
                                            <LocationSvg className={`document-page-field-svg ${lang}`}/>
                                            <div className={`document-page-field-dialog ${lang}`}>{lang === "fa" ? "لوکیشن" : "location"}</div>
                                            <div className={`document-page-field-text inline ${lang}`}>{lang === "fa" ? document.location : document.location_en}</div>
                                        </div>
                                    }
                                    {
                                        document.categories && document.categories.length > 0 &&
                                        <div className={`document-page-cats ${lang}`}>
                                            <CategorySvg className={`document-page-field-svg cat ${lang}`}/>
                                            <div className={`document-page-field-dialog ${lang}`}>{lang === "fa" ? "دسته‌بندی" : "category"}</div>
                                            {
                                                document.categories.map(cat =>
                                                    <Material key={cat._id} className="panel-select-show-categories-item">
                                                        {lang === "fa" ? cat.name : cat.name_en}
                                                    </Material>,
                                                )
                                            }
                                        </div>
                                    }
                                    {
                                        document.pictures && document.pictures.length > 1 &&
                                        <div className="document-page-pics">
                                            {
                                                document.pictures.slice(1, document.pictures.length).map(img =>
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