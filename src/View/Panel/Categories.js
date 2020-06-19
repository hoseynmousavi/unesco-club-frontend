import React, {PureComponent} from "react"
import {ClipLoader} from "react-spinners"
import api from "../../Functions/api"
import Material from "../Components/Material"
import MaterialInput from "../Components/MaterialInput"
import {NotificationManager} from "react-notifications"
import CancelSvg from "../../Media/Svgs/CancelSvg"

class Categories extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            getLoading: true,
            categories: {},
            isModalOpen: false,
            modalLoading: false,
        }
        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("document/category", `?limit=20&page=1`)
            .then(data => this.setState({...this.state, getLoading: false, categories: data.reduce((sum, cat) => ({...sum, [cat._id]: cat}), {})}))

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
            const {categories} = this.state
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (Object.values(categories).length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, getLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("document/category", `?limit=20&page=${this.page}`)
                        .then(data =>
                        {
                            this.page += 1
                            this.setState({...this.state, getLoading: false, categories: {...categories, ...data.reduce((sum, cat) => ({...sum, [cat._id]: cat}), {})}})
                        })
                })
            }
        }, 20)
    }

    toggleModal = () =>
    {
        if (!this.state.modalLoading)
            this.setState({...this.state, isModalOpen: !this.state.isModalOpen})
    }

    setValue = (e) =>
    {
        const {name, value} = e.target
        this[name] = value
    }

    submitOnEnter = (e) => e.keyCode === 13 && this.submit()

    submit = () =>
    {
        const {name, description, name_en, description_en} = this
        const {modalLoading} = this.state
        if (!modalLoading)
        {
            if (name && name_en)
            {
                this.setState({...this.state, modalLoading: true}, () =>
                {
                    api.post("document/category", {name, name_en, description_en: description_en ? description_en : undefined, description: description ? description : undefined})
                        .then(category =>
                        {
                            NotificationManager.success("با موفقیت ساخته شد!")
                            const {categories} = this.state
                            this.setState({...this.state, modalLoading: false, categories: {[category._id]: category, ...categories}, isModalOpen: false})
                        })
                        .catch(err =>
                        {
                            this.setState({...this.state, modalLoading: false}, () =>
                            {
                                console.log(err)
                                NotificationManager.error("خطا در برقراری ارتباط!")
                            })
                        })
                })
            }
            else
            {
                if (!name || !name_en) NotificationManager.error("نام و name را وارد کنید!")
            }
        }
    }

    removeItem(category_id)
    {
        let result = window.confirm("از حذف مطمئنید؟")
        if (result)
        {
            api.del("document/category", {category_id})
                .then(() =>
                {
                    const categories = {...this.state.categories}
                    delete categories[category_id]
                    this.setState({...this.state, categories}, () =>
                        NotificationManager.success("حذف شد"),
                    )
                })
                .catch((err) =>
                {
                    if (err?.response?.data?.message === "it is using!") NotificationManager.error("این دسته‌بندی توسط پرونده‌ها استفاده میشود!")
                    else NotificationManager.error("خطا در برقراری ارتباط!")
                })
        }
    }

    render()
    {
        const {getLoading, categories, isModalOpen, modalLoading} = this.state
        return (
            <div className="panel-section">
                <div className="panel-page-section-title">دسته‌بندی‌ها</div>
                <div className="panel-row-cont-title">
                    <div className="panel-row-item">نام</div>
                    <div className="panel-row-item">توضیحات</div>
                    <div className="panel-row-item-small">حذف</div>
                </div>
                {
                    Object.values(categories).map(category =>
                        <div key={category._id} className="panel-row-cont">
                            <div className="panel-row-item">{category.name} | {category.name_en}</div>
                            <div className="panel-row-item">{category.description} | {category.description_en}</div>
                            <div className="panel-row-item-small"><CancelSvg className="panel-row-item-remove" onClick={() => this.removeItem(category._id)}/></div>
                        </div>,
                    )
                }
                <div className="loading-section-cont">
                    {
                        getLoading && <div className="panel-section-loading-cont"><ClipLoader size={20} color="var(--primary-color)"/></div>
                    }
                </div>
                <Material className="panel-add-item-btn" onClick={this.toggleModal}>+</Material>
                {
                    isModalOpen &&
                    <React.Fragment>
                        <div className="panel-add-item-model-cont">
                            <div className="sign-up-page-title">ایجاد دسته‌بندی</div>
                            <MaterialInput onKeyDown={this.submitOnEnter} className="sign-up-page-input" name="name" backgroundColor="white" label={<span>نام <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                            <MaterialInput onKeyDown={this.submitOnEnter} className="sign-up-page-input en" name="name_en" backgroundColor="white" label={<span>name <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                            <MaterialInput onKeyDown={this.submitOnEnter} className="sign-up-page-input" name="description" backgroundColor="white" label={<span>توضیحات</span>} getValue={this.setValue}/>
                            <MaterialInput onKeyDown={this.submitOnEnter} className="sign-up-page-input en" name="description_en" backgroundColor="white" label={<span>description</span>} getValue={this.setValue}/>
                            <Material className={`sign-up-page-submit ${modalLoading ? "disabled" : ""}`} backgroundColor="rgba(255,255,255,0.3)" onClick={this.submit}>ثبت</Material>
                        </div>
                        <div className="panel-add-item-back" onClick={this.toggleModal}/>
                    </React.Fragment>
                }
            </div>
        )
    }
}

export default Categories