import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import ImageSvg from "../../Media/Svgs/ImageSvg"
import CameraSvg from "../../Media/Svgs/Camera"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import VideoSvg from "../../Media/Svgs/VideoSvg"
import {NotificationManager} from "react-notifications"
import compressImage from "../../Helpers/compressImage"
import api from "../../Functions/api"
import TickSvg from "../../Media/Svgs/TickSvg"
import {ClipLoader} from "react-spinners"

class CreateDocument extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            modalLoading: false,
            picturePreviews: [],
            videoPreviews: [],
            categoryModal: false,
            selectedCategories: [],
            imageModal: false,
            videoModal: false,
            loadingPercent: 0,
        }

        this.pictures = []
        this.videos = []
    }

    setValue = (e) =>
    {
        const {name, value} = e.target
        this[name] = value
    }

    selectThumbnail = (e) =>
    {
        const img = e.target.files[0]
        this.thumbnail = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, thumbnailPreview: reader.result})
        e.target.value = ""
    }

    toggleVideoModal = () =>
    {
        this.setState({...this.state, videoModal: !this.state.videoModal, tempImagePreview: undefined}, () =>
        {
            this.tempDesc = undefined
            this.tempImg = undefined
        })
    }

    selectVideo = (e) =>
    {
        const video = e.target.files[0]
        this.tempImg = video
        const reader = new FileReader()
        reader.readAsDataURL(video)
        reader.onload = () => this.setState({...this.state, tempImagePreview: reader.result})
        e.target.value = ""
    }

    removeVideo(index)
    {
        const videoPreviews = [...this.state.videoPreviews]
        videoPreviews.splice(index, 1)
        this.setState({...this.state, videoPreviews}, () =>
            this.videos.splice(index, 1),
        )
    }

    submitSelectVideo = () =>
    {
        const {tempImagePreview} = this.state
        this.setState({...this.state, videoPreviews: [...this.state.videoPreviews, tempImagePreview]}, () =>
        {
            this.videos.push({file: this.tempImg, description: this.tempDesc})
            this.toggleVideoModal()
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

    removePicture(index)
    {
        const picturePreviews = [...this.state.picturePreviews]
        picturePreviews.splice(index, 1)
        this.setState({...this.state, picturePreviews}, () =>
            this.pictures.splice(index, 1),
        )
    }

    submitSelectImage = () =>
    {
        const {picturePreviews, tempImagePreview, previewSlider} = this.state
        this.setState({...this.state, picturePreviews: [...picturePreviews, tempImagePreview]}, () =>
        {
            this.pictures.push({file: this.tempImg, description: this.tempDesc, slider: previewSlider})
            this.toggleImageModal()
        })
    }

    submitOnEnter = (e) => e.keyCode === 13 && this.submit()

    submit = () =>
    {
        const {title, summary, description, location, thumbnail, videos, pictures} = this
        const {modalLoading, selectedCategories, is_route} = this.state
        if (!modalLoading)
        {
            if (title)
            {
                this.setState({...this.state, modalLoading: true, loadingPercent: 0}, () =>
                {
                    let form = new FormData()
                    form.append("title", title)
                    selectedCategories.length > 0 && form.append("categories", JSON.stringify(selectedCategories))
                    summary && form.append("summary", summary)
                    description && form.append("description", description)
                    location && form.append("location", location)
                    is_route && form.append("is_route", is_route)
                    videos.forEach((video, index) =>
                    {
                        form.append("film" + index, video.file)
                        video.description && form.append("film" + index, video.description)
                    })
                    compressImage(thumbnail).then(thumb =>
                    {
                        thumb && form.append("thumbnail", thumb)
                        if (pictures.length > 0)
                        {
                            let counter = 0
                            pictures.forEach((pic, index) =>
                            {
                                compressImage(pic.file).then(image =>
                                {
                                    form.append("picture" + index, image)
                                    pic.description && form.append("picture" + index, pic.description)
                                    pic.slider && form.append("picture" + index + "slider", pic.slider)
                                    counter++
                                    if (counter === pictures.length) this.send(form)
                                })
                            })
                        }
                        else this.send(form)
                    })
                })
            }
            else NotificationManager.error("عنوان پرونده را وارد کنید!")
        }
    }

    send(form)
    {
        api.post("document", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
            .then((document) =>
            {
                const {addDocument, toggleModal, categories} = this.props
                NotificationManager.success("با موفقیت ایجاد شد!")
                const newDocument = {...document}
                if (newDocument.categories && newDocument.categories.length > 0)
                {
                    let newCats = []
                    newDocument.categories.forEach(item => newCats.push(categories[item]))
                    newDocument.categories = [...newCats]
                }
                addDocument(newDocument)
                toggleModal()
            })
            .catch(() => this.setState({...this.state, modalLoading: false}, () => NotificationManager.error("مشکلی پیش آمد! اینترنت خود را بررسی کنید!")))
    }

    toggleCategories = () => this.setState({...this.state, categoryModal: !this.state.categoryModal})

    selectCategory(category)
    {
        const selectedCategories = [...this.state.selectedCategories]
        if (selectedCategories.indexOf(category) !== -1) selectedCategories.splice(selectedCategories.indexOf(category), 1)
        else selectedCategories.push(category)
        this.setState({...this.state, selectedCategories})
    }

    setPreviewSlider = () => this.setState({...this.state, previewSlider: !this.state.previewSlider})

    toggleRoute = () => this.setState({...this.state, is_route: !this.state.is_route})

    render()
    {
        const {thumbnailPreview, picturePreviews, videoPreviews, modalLoading, selectedCategories, categoryModal, imageModal, videoModal, tempImagePreview, loadingPercent, previewSlider, is_route} = this.state
        const {toggleModal, categories} = this.props
        return (
            <React.Fragment>
                <div className="panel-add-item-back" onClick={modalLoading ? null : toggleModal}>
                    <div className="panel-add-item-model-cont static" onClick={e => e.stopPropagation()}>
                        <div className="sign-up-page-title">ایجاد پرونده</div>
                        <MaterialInput onKeyDown={this.submitOnEnter} className="sign-up-page-input" name="title" backgroundColor="white" label={<span>عنوان <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                        <Material className="panel-checkbox" onClick={this.toggleRoute}>
                            <div className={`panel-checkbox-item ${is_route ? "" : "hide"}`}/>
                            مسیر
                        </Material>
                        <MaterialInput onKeyDown={this.submitOnEnter} className="sign-up-page-input" name="summary" backgroundColor="white" label={<span>خلاصه</span>} getValue={this.setValue}/>
                        <MaterialInput isTextArea={true} className="sign-up-page-area" name="description" backgroundColor="white" label={<span>توضیحات</span>} getValue={this.setValue}/>
                        <MaterialInput onKeyDown={this.submitOnEnter} className="sign-up-page-input" name="location" backgroundColor="white" label={<span>لوکیشن</span>} getValue={this.setValue}/>

                        <Material className="panel-select-categories" onClick={this.toggleCategories}>افزودن دسته‌بندی</Material>

                        <div className="panel-select-show-categories">
                            {
                                selectedCategories.length > 0 ?
                                    selectedCategories.map(cat =>
                                        <Material key={cat} className="panel-select-show-categories-item" onClick={() => this.selectCategory(cat)}>
                                            {categories[cat].name}
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
                                    thumbnailPreview ?
                                        <img className="panel-add-item-thumb-file" src={thumbnailPreview} alt=""/>
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
                            picturePreviews.length > 0 &&
                            <div className="panel-add-item-show-pics dont-gesture">
                                {
                                    picturePreviews.map((item, index) =>
                                        <Material key={index} className="panel-add-item-show-pics-item-material" onClick={() => this.removePicture(index)}>
                                            <img src={item} className="panel-add-item-show-pics-item" alt=""/>
                                            <CancelSvg className="panel-add-item-show-pics-item-cancel"/>
                                        </Material>,
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
                            videoPreviews.length > 0 &&
                            <div className="panel-add-item-show-pics dont-gesture">
                                {
                                    videoPreviews.map((item, index) =>
                                        <Material key={index} className="panel-add-item-show-pics-item-material" onClick={() => this.removeVideo(index)}>
                                            <video preload="none" className="panel-add-item-show-pics-item" controls controlsList="nodownload">
                                                <source src={item}/>
                                            </video>
                                            <CancelSvg className="panel-add-item-show-pics-item-cancel"/>
                                        </Material>,
                                    )
                                }
                            </div>
                        }

                        <Material className={`sign-up-page-submit ${modalLoading ? "disabled" : ""}`} backgroundColor="rgba(255,255,255,0.3)" onClick={this.submit}>ثبت</Material>
                    </div>
                </div>
                {
                    modalLoading &&
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
                                            <Material key={category._id} className="panel-select-all-categories-item" onClick={() => this.selectCategory(category._id)}>
                                                {category.name}
                                                {selectedCategories.indexOf(category._id) !== -1 && <TickSvg className="panel-select-all-categories-item-select"/>}
                                            </Material>,
                                        )
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
                            <MaterialInput isTextArea={true} className="panel-add-img-video-area" name="tempDesc" backgroundColor="white" label={<span>توضیحات</span>} getValue={this.setValue}/>
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
                            <MaterialInput isTextArea={true} className="panel-add-img-video-area" name="tempDesc" backgroundColor="white" label={<span>توضیحات</span>} getValue={this.setValue}/>
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
                                    <input type="file" hidden accept="video/*" onChange={this.selectVideo}/>
                                </label>
                            </Material>
                            <Material className={`panel-select-all-categories-btn img ${tempImagePreview ? "" : "disabled"}`} onClick={tempImagePreview ? this.submitSelectVideo : null}>ثبت</Material>
                        </div>
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

export default CreateDocument