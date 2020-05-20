import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import MaterialInput from "../Components/MaterialInput"
import TickSvg from "../../Media/Svgs/TickSvg"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import CameraSvg from "../../Media/Svgs/Camera"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import ImageSvg from "../../Media/Svgs/ImageSvg"
import compressImage from "../../Helpers/compressImage"
import VideoSvg from "../../Media/Svgs/VideoSvg"
import GarbageSvg from "../../Media/Svgs/GarbageSvg"
import {Redirect} from "react-router-dom"
import AparatSvg from "../../Media/Svgs/AparatSvg"

class PanelShowDocument extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            getLoading: true,
            categoryModal: false,
            loadingPercent: 0,
            sendLoading: false,
            imageModal: false,
            videoModal: false,
            error: false,
            redirect: false,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {document, id} = this.props
        if (document)
        {
            this.setState({
                ...this.state,
                document,
                title: document.title,
                summary: document.summary,
                description: document.description,
                location: document.location,
                getLoading: false,
            })
        }
        else
        {
            api.get(`document/${id}`)
                .then(document =>
                {
                    this.setState({
                        ...this.state,
                        document,
                        title: document.title,
                        summary: document.summary,
                        description: document.description,
                        location: document.location,
                        getLoading: false,
                    })
                })
                .catch(() => this.setState({...this.state, error: true, getLoading: false}))
        }
    }

    setValue = (e) =>
    {
        const {name, value} = e.target
        this.setState({...this.state, [name]: value})
    }

    setTempValue = (e) =>
    {
        const {name, value} = e.target
        this[name] = value
    }

    removeCategory = (category_id, index) =>
    {
        const {id, setDocument} = this.props
        api.del("document-category", {category_id, document_id: id})
            .then(() =>
            {
                let document = {...this.state.document}
                document.categories.splice(index, 1)
                this.setState({...this.state, document}, () =>
                {
                    setDocument(document)
                    NotificationManager.success("با موفقیت حذف شد!")
                })
            })
            .catch(() => NotificationManager.error("خطایی پیش آمد! اینترنت خود را بررسی کنید!"))
    }

    addCategory = (category) =>
    {
        const {id, setDocument} = this.props
        api.post("document-category", {category_id: category._id, document_id: id})
            .then(() =>
            {
                let document = {...this.state.document}
                if (document.categories) document.categories.push(category)
                else document.categories = [category]
                this.setState({...this.state, document}, () =>
                {
                    setDocument(document)
                    NotificationManager.success("با موفقیت اضافه شد!")
                })
            })
            .catch((e) =>
            {
                console.log(e.message)
                NotificationManager.error("خطایی پیش آمد! اینترنت خود را بررسی کنید!")
            })
    }

    toggleCategories = () => this.setState({...this.state, categoryModal: !this.state.categoryModal})

    selectThumbnail = (e) =>
    {
        const img = e.target.files[0]
        e.target.value = ""
        this.setState({...this.state, loadingPercent: 0, sendLoading: true}, () =>
        {
            compressImage(img).then(thumbnail =>
            {
                const {id, setDocument} = this.props
                let form = new FormData()
                form.append("thumbnail", thumbnail)
                form.append("document_id", id)
                api.patch("document", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                    .then((updatedDocument) =>
                    {
                        const document = {...this.state.document, thumbnail: updatedDocument.thumbnail}
                        this.setState({...this.state, sendLoading: false, document}, () =>
                        {
                            setDocument(document)
                            NotificationManager.success("با موفقیت بروز شد!")
                        })
                    })
                    .catch(() => this.setState({...this.state, sendLoading: false}, () => NotificationManager.error("مشکلی پیش آمد! اینترنت خود را بررسی کنید!")))
            })
        })
    }

    toggleImageModal = () =>
    {
        this.setState({...this.state, imageModal: !this.state.imageModal, tempImagePreview: undefined, previewSlider: undefined}, () =>
        {
            this.tempDesc = undefined
            this.tempImg = undefined
        })
    }

    selectImage = (e) =>
    {
        const img = e.target.files[0]
        this.tempImg = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, tempImagePreview: reader.result})
        e.target.value = ""
    }

    submitSelectImage = () =>
    {
        this.setState({...this.state, loadingPercent: 0, sendLoading: true}, () =>
        {
            compressImage(this.tempImg).then(file =>
            {
                const {id, setDocument} = this.props
                const {previewSlider} = this.state
                let form = new FormData()
                form.append("document_id", id)
                form.append("file", file)
                previewSlider && form.append("slider", previewSlider)
                this.tempDesc && form.append("description", this.tempDesc)
                api.post("document-picture", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                    .then((created) =>
                    {
                        const document = {...this.state.document, pictures: [...this.state.document.pictures || [], created]}
                        this.setState({...this.state, sendLoading: false, document}, () =>
                        {
                            setDocument(document)
                            this.toggleImageModal()
                            NotificationManager.success("با اضافه بروز شد!")
                        })
                    })
                    .catch(() => this.setState({...this.state, sendLoading: false}, () => NotificationManager.error("مشکلی پیش آمد! اینترنت خود را بررسی کنید!")))
            })
        })
    }

    removePicture(picture_id, index)
    {
        let result = window.confirm("از حذف مطمئنید؟")
        if (result)
        {
            api.del("document-picture", {picture_id})
                .then(() =>
                {
                    const {setDocument} = this.props
                    let document = {...this.state.document}
                    document.pictures.splice(index, 1)
                    this.setState({...this.state, document}, () =>
                    {
                        setDocument(document)
                        NotificationManager.success("با موفقیت حذف شد!")
                    })
                })
                .catch(() => NotificationManager.error("خطایی پیش آمد! اینترنت خود را بررسی کنید!"))
        }
    }

    updatePicSlider(picture_id, index, slider)
    {
        api.patch("document-picture", {picture_id, slider})
            .then(() =>
            {
                const {setDocument} = this.props
                let document = {...this.state.document}
                document.pictures[index].slider = slider
                this.setState({...this.state, document}, () =>
                {
                    setDocument(document)
                    NotificationManager.success("با موفقیت انجام شد!")
                })
            })
            .catch(() => NotificationManager.error("خطایی پیش آمد! اینترنت خود را بررسی کنید!"))
    }

    toggleVideoModal = () =>
    {
        this.setState({...this.state, videoModal: !this.state.videoModal, tempImagePreview: undefined}, () =>
        {
            this.tempDesc = undefined
            this.tempImg = undefined
        })
    }

    toggleVideoAparatModal = () =>
    {
        this.setState({...this.state, videoAparatModal: !this.state.videoAparatModal}, () =>
        {
            this.tempDesc = undefined
            this.tempAparat = undefined
        })
    }

    submitSelectAparatVideo = () =>
    {
        this.setState({...this.state, loadingPercent: 0, sendLoading: true}, () =>
        {
            const {id, setDocument} = this.props
            let form = new FormData()
            form.append("document_id", id)
            form.append("link", this.tempAparat)
            this.tempDesc && form.append("description", this.tempDesc)
            api.post("document-aparat", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                .then((created) =>
                {
                    const document = {...this.state.document, aparats: [...this.state.document.aparats || [], created]}
                    this.setState({...this.state, sendLoading: false, document}, () =>
                    {
                        setDocument(document)
                        this.toggleVideoAparatModal()
                        NotificationManager.success("با اضافه بروز شد!")
                    })
                })
                .catch(() => this.setState({...this.state, sendLoading: false}, () => NotificationManager.error("مشکلی پیش آمد! اینترنت خود را بررسی کنید!")))
        })
    }

    submitSelectVideo = () =>
    {
        this.setState({...this.state, loadingPercent: 0, sendLoading: true}, () =>
        {
            const {id, setDocument} = this.props
            let form = new FormData()
            form.append("document_id", id)
            form.append("file", this.tempImg)
            this.tempDesc && form.append("description", this.tempDesc)
            api.post("document-film", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                .then((created) =>
                {
                    const document = {...this.state.document, films: [...this.state.document.films || [], created]}
                    this.setState({...this.state, sendLoading: false, document}, () =>
                    {
                        setDocument(document)
                        this.toggleVideoModal()
                        NotificationManager.success("با اضافه بروز شد!")
                    })
                })
                .catch(() => this.setState({...this.state, sendLoading: false}, () => NotificationManager.error("مشکلی پیش آمد! اینترنت خود را بررسی کنید!")))
        })
    }

    removeVideo(film_id, index)
    {
        let result = window.confirm("از حذف مطمئنید؟")
        if (result)
        {
            api.del("document-film", {film_id})
                .then(() =>
                {
                    const {setDocument} = this.props
                    let document = {...this.state.document}
                    document.films.splice(index, 1)
                    this.setState({...this.state, document}, () =>
                    {
                        setDocument(document)
                        NotificationManager.success("با موفقیت حذف شد!")
                    })
                })
                .catch(() => NotificationManager.error("خطایی پیش آمد! اینترنت خود را بررسی کنید!"))
        }
    }

    removeAparatVideo(aparat_id, index)
    {
        let result = window.confirm("از حذف مطمئنید؟")
        if (result)
        {
            api.del("document-aparat", {aparat_id})
                .then(() =>
                {
                    const {setDocument} = this.props
                    let document = {...this.state.document}
                    document.aparats.splice(index, 1)
                    this.setState({...this.state, document}, () =>
                    {
                        setDocument(document)
                        NotificationManager.success("با موفقیت حذف شد!")
                    })
                })
                .catch(() => NotificationManager.error("خطایی پیش آمد! اینترنت خود را بررسی کنید!"))
        }
    }

    updateField(field)
    {
        this.setState({...this.state, sendLoading: true}, () =>
        {
            const {id, setDocument} = this.props
            api.patch("document", {document_id: id, [field]: this.state[field]})
                .then((updated) =>
                {
                    const document = {...this.state.document, [field]: updated[field]}
                    this.setState({...this.state, sendLoading: false, document}, () =>
                    {
                        setDocument(document)
                        NotificationManager.success("با موفقیت بروز شد!")
                    })
                })
                .catch(() => this.setState({...this.state, sendLoading: false}, () => NotificationManager.error("مشکلی پیش آمد! اینترنت خود را بررسی کنید!")))
        })
    }

    setPreviewSlider = () => this.setState({...this.state, previewSlider: !this.state.previewSlider})

    toggleRoute = () =>
    {
        this.setState({...this.state, sendLoading: true}, () =>
        {
            const {id, setDocument} = this.props
            api.patch("document", {document_id: id, is_route: !this.state.document.is_route})
                .then(() =>
                {
                    const document = {...this.state.document, is_route: !this.state.document.is_route}
                    this.setState({...this.state, sendLoading: false, document}, () =>
                    {
                        setDocument(document)
                        NotificationManager.success("با موفقیت بروز شد!")
                    })
                })
                .catch(() => this.setState({...this.state, sendLoading: false}, () => NotificationManager.error("مشکلی پیش آمد! اینترنت خود را بررسی کنید!")))
        })
    }

    render()
    {
        const {error, redirect, getLoading, document, title, summary, description, location, categoryModal, videoAparatModal, sendLoading, loadingPercent, imageModal, tempImagePreview, videoModal, previewSlider} = this.state
        const {categories, removeItem} = this.props
        return (
            <div className="panel-section">
                {
                    error ?
                        <div>یافت نشد!</div>
                        :
                        redirect ?
                            <Redirect to="/panel/documents"/>
                            :
                            document &&
                            <div className="panel-show-doc-cont">
                                <div className="panel-show-doc-input-cont">
                                    <MaterialInput defaultValue={document.title} className={`panel-show-doc-input ${title !== document.title ? "changed" : ""}`} name="title" backgroundColor="white" label={<span>عنوان <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                                    {
                                        title !== document.title &&
                                        <Material className="panel-show-doc-input-svg-cont" backgroundColor="var(--success-color)" onClick={() => this.updateField("title")}>
                                            <TickSvg className="panel-show-doc-input-svg"/>
                                        </Material>
                                    }
                                </div>
                                <Material className="panel-checkbox" onClick={this.toggleRoute}>
                                    <div className={`panel-checkbox-item ${document.is_route ? "" : "hide"}`}/>
                                    مسیر
                                </Material>
                                <div className="panel-show-doc-input-cont">
                                    <MaterialInput defaultValue={document.summary} className={`panel-show-doc-input ${summary !== document.summary ? "changed" : ""}`} name="summary" backgroundColor="white" label={<span>خلاصه</span>} getValue={this.setValue}/>
                                    {
                                        summary !== document.summary &&
                                        <Material className="panel-show-doc-input-svg-cont" backgroundColor="var(--success-color)" onClick={() => this.updateField("summary")}>
                                            <TickSvg className="panel-show-doc-input-svg"/>
                                        </Material>
                                    }
                                </div>
                                <div className="panel-show-doc-input-cont">
                                    <MaterialInput defaultValue={document.description} className={`panel-show-doc-area ${description !== document.description ? "changed" : ""}`} isTextArea={true} name="description" backgroundColor="white" label={<span>توضیحات</span>} getValue={this.setValue}/>
                                    {
                                        description !== document.description &&
                                        <Material className="panel-show-doc-input-svg-cont" backgroundColor="var(--success-color)" onClick={() => this.updateField("description")}>
                                            <TickSvg className="panel-show-doc-input-svg"/>
                                        </Material>
                                    }
                                </div>
                                <div className="panel-show-doc-input-cont">
                                    <MaterialInput defaultValue={document.location} className={`panel-show-doc-input ${location !== document.location ? "changed" : ""}`} name="location" backgroundColor="white" label={<span>لوکیشن</span>} getValue={this.setValue}/>
                                    {
                                        location !== document.location &&
                                        <Material className="panel-show-doc-input-svg-cont" backgroundColor="var(--success-color)" onClick={() => this.updateField("location")}>
                                            <TickSvg className="panel-show-doc-input-svg"/>
                                        </Material>
                                    }
                                </div>

                                <Material className="panel-select-categories" onClick={this.toggleCategories}>افزودن دسته‌بندی</Material>
                                <div className="panel-select-show-categories">
                                    {
                                        document.categories && document.categories.length > 0 ?
                                            document.categories.map((cat, index) =>
                                                <Material key={cat._id} className="panel-select-show-categories-item" onClick={() => this.removeCategory(cat._id, index)}>
                                                    {cat.name}
                                                    <span> </span>
                                                    <span>✕</span>
                                                </Material>,
                                            )
                                            :
                                            <div className="panel-select-show-categories-none">بدون دسته‌بندی</div>
                                    }
                                </div>

                                <Material className="panel-add-item-thumb-cont">
                                    <label className="panel-add-item-thumb">
                                        {
                                            document.thumbnail ?
                                                <img className="panel-add-item-thumb-file" src={REST_URL + document.thumbnail} alt=""/>
                                                :
                                                <ImageSvg className="panel-add-item-pic-svg image"/>
                                        }
                                        <input type="file" hidden accept="image/*" onChange={this.selectThumbnail}/>
                                    </label>
                                </Material>

                                <Material onClick={this.toggleImageModal}>
                                    <label className="panel-add-item-pic">
                                        <CameraSvg className="panel-add-item-pic-svg"/>
                                    </label>
                                </Material>

                                {
                                    document.pictures && document.pictures.length > 0 &&
                                    <div className="panel-add-item-show-pics dont-gesture">
                                        {
                                            document.pictures.map((item, index) =>
                                                <div key={item._id} className="panel-add-item-show-pics-item-material">
                                                    <img src={REST_URL + item.file} className="panel-add-item-show-pics-item" alt="" onClick={() => this.removePicture(item._id, index)}/>
                                                    <CancelSvg className="panel-add-item-show-pics-item-cancel" onClick={() => this.removePicture(item._id, index)}/>

                                                    <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.updatePicSlider(item._id, index, !item.slider)}>
                                                        <div className={`seyed-radio color-border ${item.slider ? "selected" : ""} `}/>
                                                        <div className="seyed-radio-label">نمایش در اسلایدر</div>
                                                    </Material>

                                                    <div className="panel-add-item-show-pics-item-desc">
                                                        {item.description}
                                                    </div>
                                                </div>,
                                            )
                                        }
                                    </div>
                                }

                                <Material className="panel-add-item-video" onClick={this.toggleVideoModal}>
                                    <label className="panel-add-item-pic">
                                        <VideoSvg className="panel-add-item-video-svg"/>
                                    </label>
                                </Material>

                                {
                                    document.films && document.films.length > 0 &&
                                    <div className="panel-add-item-show-pics dont-gesture">
                                        {
                                            document.films.map((item, index) =>
                                                <Material key={item._id} className="panel-add-item-show-pics-item-material" onClick={() => this.removeVideo(item._id, index)}>
                                                    <video preload="none" className="panel-add-item-show-pics-item" controls controlsList="nodownload">
                                                        <source src={REST_URL + item.file}/>
                                                    </video>
                                                    <CancelSvg className="panel-add-item-show-pics-item-cancel"/>
                                                    <div className="panel-add-item-show-pics-item-desc">
                                                        {item.description}
                                                    </div>
                                                </Material>,
                                            )
                                        }
                                    </div>
                                }

                                <Material className="panel-add-item-video" onClick={this.toggleVideoAparatModal}>
                                    <label className="panel-add-item-pic">
                                        <AparatSvg className="panel-add-item-video-svg"/>
                                    </label>
                                </Material>

                                {
                                    document.aparats && document.aparats.length > 0 &&
                                    <div className="panel-add-item-show-pics dont-gesture">
                                        {
                                            document.aparats.map((item, index) =>
                                                <Material key={item._id} className="panel-add-item-show-pics-item-material" onClick={() => this.removeAparatVideo(item._id, index)}>
                                                    <div>{item.link}</div>
                                                    <div className="panel-add-item-show-pics-item-desc">
                                                        {item.description}
                                                    </div>
                                                </Material>,
                                            )
                                        }
                                    </div>
                                }

                                <Material className="panel-add-item-btn back-white" onClick={() => removeItem(document._id, () => this.setState({...this.state, redirect: true}))}><GarbageSvg className="panel-add-item-btn-del"/></Material>
                            </div>
                }

                {
                    getLoading && <div className="panel-section-loading-cont"><ClipLoader size={20} color="var(--primary-color)"/></div>
                }

                {
                    sendLoading &&
                    <div className="sign-up-page-loading">
                        <div className="sign-up-page-loading-percent">
                            {loadingPercent === 0 || loadingPercent === 100 ? <div className="panel-section-loading-cont clip"><ClipLoader size={20} color="var(--primary-color)"/></div> : <span>{loadingPercent} %</span>}
                        </div>
                    </div>
                }

                {
                    categoryModal &&
                    <React.Fragment>
                        <div className="panel-select-all-categories-back" onClick={this.toggleCategories}/>
                        <div className="panel-select-all-categories">
                            <div className="panel-select-all-categories-scroll">
                                {
                                    Object.values(categories).length > 0 ?
                                        Object.values(categories).map(category =>
                                        {
                                            let index = -1
                                            let exist = false
                                            if (document.categories)
                                            {
                                                document.categories.forEach((item, indexFor) =>
                                                {
                                                    if (item._id === category._id)
                                                    {
                                                        exist = true
                                                        index = indexFor
                                                    }
                                                })
                                            }
                                            return (
                                                <Material key={category._id} className="panel-select-all-categories-item" onClick={() => exist ? this.removeCategory(category._id, index) : this.addCategory(category)}>
                                                    {category.name}
                                                    {exist && <TickSvg className="panel-select-all-categories-item-select"/>}
                                                </Material>
                                            )
                                        })
                                        :
                                        <div className="panel-select-all-categories-empty">دسته‌بندی ای پیدا نشد!</div>
                                }
                            </div>
                            <Material className="panel-select-all-categories-btn" onClick={this.toggleCategories}>ثبت</Material>
                        </div>
                    </React.Fragment>
                }

                {
                    imageModal &&
                    <React.Fragment>
                        <div className="panel-select-all-categories-back" onClick={this.toggleImageModal}/>
                        <div className="panel-select-all-categories center">
                            <MaterialInput isTextArea={true} className="panel-add-img-video-area" name="tempDesc" backgroundColor="white" label={<span>توضیحات</span>} getValue={this.setTempValue}/>
                            <Material className="panel-add-item-pic-cont">
                                <label className="panel-add-item-pic">
                                    {
                                        tempImagePreview ?
                                            <img src={tempImagePreview} className="panel-add-item-temp-pic" alt=""/>
                                            :
                                            <CameraSvg className="panel-add-item-pic-svg"/>
                                    }
                                    <input type="file" hidden accept="image/*" onChange={this.selectImage}/>
                                </label>
                            </Material>
                            <div className="panel-add-item-pic-slider">
                                <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={this.setPreviewSlider}>
                                    <div className={`seyed-radio color-border ${previewSlider ? "selected" : ""} `}/>
                                    <div className="seyed-radio-label">نمایش در اسلایدر</div>
                                </Material>
                            </div>
                            <Material className={`panel-select-all-categories-btn img ${tempImagePreview ? "" : "disabled"}`} onClick={tempImagePreview ? this.submitSelectImage : null}>ثبت</Material>
                        </div>
                    </React.Fragment>
                }
                {
                    videoModal &&
                    <React.Fragment>
                        <div className="panel-select-all-categories-back" onClick={this.toggleVideoModal}/>
                        <div className="panel-select-all-categories center">
                            <MaterialInput isTextArea={true} className="panel-add-img-video-area" name="tempDesc" backgroundColor="white" label={<span>توضیحات</span>} getValue={this.setTempValue}/>
                            <Material className="panel-add-item-pic-cont">
                                <label className="panel-add-item-pic">
                                    {
                                        tempImagePreview ?
                                            <video preload="none" className="panel-add-item-temp-pic" controls controlsList="nodownload">
                                                <source src={tempImagePreview}/>
                                            </video>
                                            :
                                            <VideoSvg className="panel-add-item-pic-svg"/>
                                    }
                                    <input type="file" hidden accept="video/*" onChange={this.selectImage}/>
                                </label>
                            </Material>
                            <Material className={`panel-select-all-categories-btn img ${tempImagePreview ? "" : "disabled"}`} onClick={tempImagePreview ? this.submitSelectVideo : null}>ثبت</Material>
                        </div>
                    </React.Fragment>
                }

                {
                    videoAparatModal &&
                    <React.Fragment>
                        <div className="panel-select-all-categories-back" onClick={this.toggleVideoAparatModal}/>
                        <div className="panel-select-all-categories center">
                            <MaterialInput isTextArea={true} className="panel-add-img-video-area" name="tempDesc" backgroundColor="white" label={<span>توضیحات</span>} getValue={this.setTempValue}/>
                            <MaterialInput className="panel-add-img-video-input" name="tempAparat" backgroundColor="white" label={<span>لینک آپارات <span className="sign-up-page-required">*</span></span>} getValue={this.setTempValue}/>
                            <Material className={`panel-select-all-categories-btn img`} onClick={this.submitSelectAparatVideo}>ثبت</Material>
                        </div>
                    </React.Fragment>
                }

            </div>
        )
    }
}

export default PanelShowDocument