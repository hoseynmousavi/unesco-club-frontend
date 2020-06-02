import React, {PureComponent} from "react"

class AboutPage extends PureComponent
{
    render()
    {
        return (
            <div className="about-page-cont">
                <div className="about-page-text">
                    باشگاه گردشگری و محیط زیست یونسکو در ایران به محوریت گردشگری پایدار و خلاق فعالیت خود را از سال نود و هشت شروع کرده است.
                    <br/>
                    این باشگاه با توجه به سیاست های کلان سازمان جهانی یونسکو محفلی برای طرفداران گردشگری و محیط زیست و آماده برای همکاری با مجموعه های مردم نهاد است.
                    <br/>

                    راههای ارتباط با ما:
                    <br/>
                    آدرس: خیابان سپهبد قرنی خیابان شاداب غربی کوچه شهریور بن بست دوم غربی پلاک دو
                    <br/>
                    شماره تلفن: <a href="tel:+982188924411" className="about-page-text-phone">+982188924411</a>
                    <br/>
                    واتساپ: <a href="tel:+989381908500" className="about-page-text-phone">+989381908500</a>
                    <br/>
                    اینستاگرام: <a href="https://www.instagram.com/unescotec" className="about-page-text-phone">unescotec</a>
                </div>
            </div>
        )
    }
}

export default AboutPage