import { Link } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTwitter,
} from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-row">
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Our Services</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Affiliate Program</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Get Help</h4>
                        <ul>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Returns</a></li>
                            <li><Link to="/orders">Order Status</Link></li>
                            <li><a href="#">Payment Options</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Shop by Category</h4>
                        <ul>
                            <li><Link to="/search?category=electronics">Electronics</Link></li>
                            <li><Link to="/search?category=mobiles">Mobiles</Link></li>
                            <li><Link to="/search?category=gaming">Gaming</Link></li>
                            <li><Link to="/search?category=fashion">Fashion</Link></li>
                            <li><Link to="/search?category=fitness">Fitness</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Follow Us</h4>
                        <div className="social-links">
                            <a href="#"><FaFacebookF /></a>
                            <a href="#"><FaTwitter /></a>
                            <a href="#"><FaInstagram /></a>
                            <a href="#"><FaLinkedinIn /></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} TechKart. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;