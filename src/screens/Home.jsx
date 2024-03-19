import React from "react";
import Footer from "../components/Footer";
import "./css/bootstrap.min.css";
import "./css/animate.css";
import "./css/themify-icons.css";
import "./css/magnific-popup.css";
import "./css/nice-select.css";
import "./css/slick.css";
import "./css/style.css";
import bannerImage from "./img/banner_img.png";
import topservice from "./img/top_service.png";
export default function Home() {
  return (
    <div>
      <header className="main_menu home_menu">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <nav className="navbar navbar-expand-lg navbar-light">
                <lord-icon
                  src="https://cdn.lordicon.com/hpcxqbph.json"
                  trigger="loop"
                  style={{ width: "80px", height: "80px" }}
                ></lord-icon>
                <a className="navbar-brand" style={{ fontWeight: "bold" }}>
                  MedTalk AI
                </a>

                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className="collapse navbar-collapse main-menu-item justify-content-center"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav align-items-center">
                    <li className="nav-item">
                      <a className="nav-link" href="about.html"></a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="contact.html"></a>
                    </li>
                  </ul>
                </div>
                <a className="btn_2 d-none d-lg-block" href="/login">
                  LOGIN
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <section className="banner_part">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 col-xl-5">
              <div className="banner_text">
                <div className="banner_text_iner">
                  <h5>Where conversations become care!</h5>
                  <h1>MedTalk AI</h1>
                  <p>
                    MedTalk AI revolutionizes medical documentation with AI and
                    ML, simplifying patient record management for hospitals. By
                    analyzing audio recordings, it swiftly extracts key details,
                    streamlining diagnosis and eliminating manual data entry.
                    Our platform generates accessible PDF reports, alleviating
                    the burden of handwritten notes.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="banner_img">
                <img src={bannerImage} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="about_us padding_top">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-md-6 col-lg-6">
              <div className="about_us_img">
                <img src={topservice} alt="" />
              </div>
            </div>
            <div className="col-md-6 col-lg-5">
              <div className="about_us_text">
                <h2>About us</h2>
                <p>
                  MedTalk AI is on a mission to transform healthcare
                  documentation. Our team of experts in artificial intelligence
                  and healthcare technology is dedicated to streamlining
                  processes, improving accuracy, and enhancing accessibility for
                  healthcare providers and patients. With our innovative
                  solution, we're redefining the way medical records are
                  created, managed, and accessed. Welcome to the future of
                  healthcare documentation with MedTalk AI.
                </p>
                <div className="banner_item">
                  <div className="single_item">
                    <h5>Streamlining</h5>
                  </div>
                  <div className="single_item">
                    <h5>Precision</h5>
                  </div>
                  <div className="single_item">
                    <h5>Ease</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
