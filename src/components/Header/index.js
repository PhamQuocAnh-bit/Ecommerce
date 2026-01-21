import logo from "../../assets/logo.webp";
import icon from "../../assets/icon-giomocua.webp"
import "../Header/index.css"

function Header() {
    return (
        <>
        <div class= "container">
            <div class = "row">
                <div class = "row 1">
                    <a>
                        <img src = {logo} alt="logo" class ="logo-a"></img>
                    </a>
                </div>
                <div class = "row-2">
                    <div class = "sologan">
                        <h1>BÁNH MÌ PHỐ</h1>
                    </div>
                    <div class = "inner-menu">
                        <ul>
                            <li>
                                <a href="#">
                                TRANG CHỦ
                                </a>
                            </li>
                            <li>
                                <a href="#">THỰC ĐƠN</a>
                                <ul>
                                    <li>
                                        <a href="#">BÁNH MÌ</a>
                                    </li>
                                    <li>
                                        <a href="#">BÁNH BAO</a>
                                    </li>
                                    <li>
                                        <a href="#">ĐỒ NGUỘI</a>
                                    </li>
                                    <li>
                                        <a href="#">ĐỒ UỐNG</a>
                                    </li>
                                </ul>
                            </li>

                            <li>
                                <a href="#"> TIN TỨC</a>
                            </li>
                            <li>
                                <a href="#">CUA HANG</a>
                            </li>
                             <li>
                                <a href="#">LIÊN HỆ</a>
                            </li>
                             <li>
                                <a href="#">ĐĂNG NHẬP</a>
                            </li>


                        </ul>
                    </div>
                </div>

                <div class = "row-3">
                    <div class ="address"><span>Học viện công nghệ bưu chính viễn thông</span></div>
                    <div class ="call">
                        <h1>HOTLINE: 0123456789</h1>
                        <img src={icon}></img>
                        <span>Giờ mở cửa</span>
                        <h3>8:00-17:00</h3>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
/*END HEADER */

export default Header;