import React from "react"
import InstaSvg from "../../Media/Svgs/InstaSvg"
import EmailSvg from "../../Media/Svgs/EmailSvg"
import {Link} from "react-router-dom"
import Android from "../../Media/Images/Android.png"
import DescriptionSvg from "../../Media/Svgs/DescriptionSvg"
import LocationSvg from "../../Media/Svgs/LocationSvg"
import VerifiedUserSvg from "../../Media/Svgs/VerifiedUserSvg"
import WhatsappSvg from "../../Media/Svgs/WhatsappSvg"
import PhoneSvg from "../../Media/Svgs/PhoneSvg"
import AddressSvg from "../../Media/Svgs/AddressSvg"

const goUp = () => window.scroll({top: 0, behavior: "smooth"})

const Footer = props =>
{
    const {lang} = props
    return (
        <div className="footer-container" id="footer">
            <div className={`footer-logo-cont ${lang}`}>
                <Link to="/" className="footer-logo-section" onClick={goUp}>
                    <img src="/logo512.png" alt="باشگاه گردشگری و محیط زیست یونسکو" className="footer-logo logo"/>
                    <div className={`footer-desc main-text ${lang}`}>{lang === "fa" ? "باشگاه گردشگری و محیط زیست یونسکو" : "Tourism and Environment Club"}</div>
                </Link>
                <a href="/TEUC.apk" className={`footer-logo-section app ${lang}`} download>
                    <img src={Android} className="footer-logo" alt="irteuc android application"/>
                    <div className={`footer-desc ${lang}`}>{lang === "fa" ? "دانلود اپلیکیشن" : "download application"}</div>
                </a>
            </div>
            <div className="footer-parts">
                <div className={`footer-part ${lang}`}>
                    <div className="footer-part-title">{lang === "fa" ? "بخش‌های برنامه" : "app sections"}</div>
                    <Link to="/documents" className="footer-part-text">
                        <DescriptionSvg className={`footer-part-svg ${lang}`}/>
                        {lang === "fa" ? "پرونده‌ها" : "documents"}
                    </Link>
                    <Link to="/routes" className="footer-part-text">
                        <LocationSvg className={`footer-part-svg ${lang}`}/>
                        {lang === "fa" ? "مسیرها" : "routes"}
                    </Link>
                    <Link to="/users" className="footer-part-text">
                        <VerifiedUserSvg className={`footer-part-svg ${lang}`}/>
                        {lang === "fa" ? "فعالین" : "users"}
                    </Link>
                </div>
                <div className={`footer-part second ${lang}`}>
                    <div className="footer-part-title">{lang === "fa" ? "ارتباط با ما" : "contact us"}</div>
                    <a href="mailto:info@irteuc.com" className="footer-part-text">
                        <EmailSvg className={`footer-part-svg ${lang}`}/>
                        info@irteuc.com
                    </a>
                    <a href="https://instagram.com/unescotec" target="_blank" rel="noopener noreferrer" className="footer-part-text">
                        <InstaSvg className={`footer-part-svg ${lang}`}/>
                        unescotec
                    </a>
                    <a href="tel:02188924411" className="footer-part-text">
                        <PhoneSvg className={`footer-part-svg ${lang}`}/>
                        02188924411
                    </a>
                    <a href="tel:09381908500" className="footer-part-text">
                        <WhatsappSvg className={`footer-part-svg ${lang}`}/>
                        09381908500
                    </a>
                    <div className="footer-part-text">
                        <AddressSvg className={`footer-part-svg ${lang}`}/>
                        <div className="footer-part-address">{lang === "fa" ? "خیابان سپهبد قرنی خیابان شاداب غربی کوچه شهریور بن بست دوم غربی پلاک دو" : "Iran, Tehran, Sepahbod Gharani St., Shadab Gharbi St., Shahrivar Alley, West Second Dead End, No. 2"}</div>
                    </div>
                </div>
                {/*<div className="footer-part last">*/}
                {/*    یس بیب...*/}
                {/*</div>*/}
            </div>
            <div className="footer-last-line">{lang === "fa" ? "تمامی حقوق این شبکه متعلق به irteuc.com می‌باشد." : "All rights reserved to irteuc.com"}</div>
        </div>
    )
}

export default Footer