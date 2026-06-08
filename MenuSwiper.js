import {
  LitElement,
  html,
  css,
  unsafeHTML,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3.3.3/all/lit-all.min.js';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

class MenuSwiper extends LitElement {
  constructor() {
    super();
    this.primaryColor = '#6d111a';
    this.currentIndex = 1;
    this.swiper;
  }

  firstUpdated() {
    this.initMenuSwiper();
  }

  static properties = {
    services: { type: Array },
    primaryColor: { type: String },
    currentIndex: { type: Number },
  };

  slideTo(e) {
    this.swiper.slideTo(e.currentTarget.dataset.index);
  }

  onImgLoad(e) {
    e.currentTarget.classList.add('load');
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
      />
      <style>
        @import url('https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css');
      </style>

      <div style="--primary-color: ${this.primaryColor}" class="menu_carousel">
        <div class="menu_carousel-wrapper">
          <div class="swiper-menu-button-prev">
            <i class="fa-solid fa-chevron-left"></i>
          </div>
          <div class="swiper-menu">
            <div class="swiper-wrapper">
              <!-- Menu Swiper -->
              ${this.services.map(
                (service, index, arr) => html`
                  <div class="swiper-slide">
                    <div class="menu_carousel-item">
                      <div class="menu_carousel-cover">
                        <img src="${service.imgUrl}" alt="" />
                      </div>
                      <div class="menu_carousel-content_wrapper">
                        <p class="menu_carousel-pagination">
                          ${index + 1} / ${arr.length}
                        </p>
                        <h1 class="menu_carousel-title">
                          <div class="carousel-title-wrapper">
                            ${service.title}
                            <span class="service-price">${service.price}</span>
                          </div>
                        </h1>
                        ${service.description
                          ? html`
                              <div class="menu_carousel-description">
                                ${unsafeHTML(service.description)}
                              </div>
                            `
                          : ''}
                        ${service.defaultInfo
                          ? html`
                              <div class="menu_carousel-default-info">
                                ${service.defaultInfo.memberPrice
                                  ? html`
                                      <div class="feature-item">
                                        <i class="fa-regular fa-user"></i>
                                        <div
                                          class="feature-item-wrapper_content"
                                        >
                                          <p class="feature-item-title">
                                            <b>Member Price</b>
                                          </p>
                                          <p class="feature-item-description">
                                            <span class="price"
                                              >${service.defaultInfo.memberPrice
                                                .content}</span
                                            >
                                            <span class="additional-data"
                                              >${service.defaultInfo.memberPrice
                                                .sku}</span
                                            >
                                          </p>
                                        </div>
                                      </div>
                                    `
                                  : ''}
                                ${service.defaultInfo?.recommended?.content
                                  ? html`
                                      <div class="feature-item">
                                        <i class="fa-regular fa-user"></i>
                                        <div
                                          class="feature-item-wrapper_content"
                                        >
                                          <p class="feature-item-title">
                                            <b>Recommended</b>
                                          </p>
                                          <p class="feature-item-description">
                                            ${service.defaultInfo?.recommended
                                              ?.content ?? ''}
                                          </p>
                                        </div>
                                      </div>
                                    `
                                  : ''}
                              </div>
                            `
                          : ''}
                        <div class="menu-carousel-ctas">
                          <a
                            href="/service-appointments?service-name=${service.title}"
                            >Request Service</a
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                `
              )}
              <!-- End Menu Swiper  -->
            </div>
          </div>
          <div class="swiper-menu-button-next">
            <i class="fa-solid fa-chevron-right"></i>
          </div>
        </div>

        <div class="menu_thumbnail">
          <!-- <input
            class="slide-menu-search"
            placeholder="Search by name"
            type="text"
          /> -->
          <div>
            ${this.services.map(
              (service, index) => html`
                <label
                  class="thumbnail-item"
                  data-index="${index}"
                  @click=${this.slideTo}
                >
                  <input
                    .checked=${index == this.currentIndex}
                    type="radio"
                    name="service"
                    id=""
                  />

                  <div class="thumbnail-item-img-container">
                    <img
                      @load=${this.onImgLoad}
                      class="thumbnail-item-img"
                      src="${service.imgUrl}"
                      alt=""
                    />
                    <div class="skeleton-img"></div>
                  </div>

                  <p class="thumbnail_item-title">
                    <span class="thumbnail_item--index"
                      >${String(index + 1).padStart(2, '0')}</span
                    >
                    ${service.title}
                  </p>
                </label>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }

  initMenuSwiper() {
    this.swiper = new Swiper(this.renderRoot.querySelector('.swiper-menu'), {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 1,
      spaceBetween: 15,
      navigation: {
        nextEl: this.renderRoot.querySelector('.swiper-menu-button-next'),
        prevEl: this.renderRoot.querySelector('.swiper-menu-button-prev'),
      },
      on: {
        slideChange: (e) => {
          this.currentIndex = e.realIndex;
          const item = this.renderRoot.querySelector(
            `.menu_thumbnail .thumbnail-item[data-index="${e.realIndex}"]`
          );
          const container = item.parentElement;

          const containerRect = container.getBoundingClientRect();
          const itemRect = item.getBoundingClientRect();

          if (itemRect.left < containerRect.left) {
            container.scrollBy({
              left: itemRect.left - containerRect.left,
              behavior: 'smooth',
            });
          }

          if (itemRect.right > containerRect.right) {
            container.scrollBy({
              left: itemRect.right - containerRect.right,
              behavior: 'smooth',
            });
          }
        },
      },
    });
  }

  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :host {
        width: 100%;
      }
      @keyframes skeleton {
        0% {
          left: -50%;
        }
        100% {
          left: 100%;
        }
      }
      .menu_carousel {
        --primary-color: #6d151f;
        --text-contrast-color: var(--primary-color);

        max-width: 1500px;
        font-size: 10px;
        padding-inline: 20px;
        width: 100%;
        font-family: 'Barlow Condensed';

        ul {
          list-style-position: inside;
        }

        .skeleton-img {
          position: relative;
          position: absolute;
          left: 0;
          top: 0;
          z-index: -1;
          overflow: hidden;
          background-color: #e5e5e5;

          &:after {
            content: '';
            position: absolute;
            width: 50%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.5),
              transparent
            );
            height: 100%;
            left: -50%;
            animation-name: skeleton;
            animation-timing-function: ease;
            animation-duration: 2s;
            animation-iteration-count: infinite;
          }
        }

        .menu_thumbnail {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-top: 20px;

          .slide-menu-search {
            padding-block: 10px;
            padding-inline: 10px;
            border-radius: 8px;
            border: 2px solid #d6d6d6;
            outline: 0px solid #6d111a46;
            font-size: 1.4em;
            transition: all ease 0.1s;

            &:focus {
              border: 2px solid #6d111a;
              outline: 4px solid #6d111a23;
            }
          }

          > div {
            display: flex;
            align-items: center;
            gap: 30px;
            overflow-x: scroll;
            padding: 20px;
            scroll-padding-right: 80px;
            width: 100%;
          }

          .thumbnail-item {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 15px;
            cursor: pointer;

            input[type='radio'] {
              display: none;
            }
            &:has(input[type='radio']:checked) {
              .thumbnail-item-img-container::after {
                inset: -6px;
                opacity: 1;
              }
            }

            .thumbnail-item-img,
            .skeleton-img {
              width: 150px;
              height: 80px;
              border-radius: 10px;
            }
            .thumbnail-item-img {
              transition: opacity ease 0.25s;
              opacity: 0;

              &.load {
                opacity: 1;
              }
            }

            .thumbnail-item-img-container {
              position: relative;
              border-radius: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              /* overflow: hidden; */

              &::after {
                content: '';
                position: absolute;
                inset: 0;
                opacity: 0;
                border-radius: inherit;
                border: 3px solid var(--primary-color);
                transform: scale(1);
                transition:
                  opacity 0.15s ease,
                  inset 0.15s ease;
                pointer-events: none;
              }
            }

            .thumbnail_item-title {
              font-size: 1.8em;
              font-weight: 500;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              gap: 10px;
              /* font-weight: 500; */

              .thumbnail_item--index {
                font-size: 1.8em;
                font-weight: 600;
                color: var(--text-contrast-color);
              }
            }
          }
        }

        .menu_carousel-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;

          .swiper-menu-button-next,
          .swiper-menu-button-prev {
            position: absolute;
            background-color: var(--primary-color);
            width: 5.2em;
            height: 5.2em;
            border-radius: 500px;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all ease 0.25s;

            @media (max-width: 960px) {
              display: none;
            }

            &:hover {
              background-color: white;
              color: var(--primary-color);
              border: 2px solid var(--primary-color);
            }

            i {
              font-size: 2.5em;
            }
          }
          .swiper-menu-button-next {
            right: -1.6em;
          }
          .swiper-menu-button-prev {
            left: -1.6em;
          }

          .swiper-menu {
            overflow: hidden;
            padding: 10px;
            .swiper-wrapper {
              align-items: stretch;

              .swiper-slide {
                height: auto;

                .menu_carousel-item {
                  background-color: white;
                  box-shadow: 0px 0 6px 0px rgba(0, 0, 0, 0.2);
                  padding: 20px;
                  border-radius: 20px;
                  display: flex;
                  flex-wrap: wrap;
                  gap: 20px;
                  height: 100%;

                  .menu_carousel-cover {
                    flex: 1;

                    img {
                      width: 100%;
                      height: 100%;
                      border-radius: 15px;
                      object-fit: cover;
                    }
                  }

                  .menu_carousel-content_wrapper {
                    width: 60%;
                    display: flex;
                    flex-direction: column;

                    @media (max-width: 960px) {
                      width: 100%;
                    }

                    .menu_carousel-pagination {
                      background-color: var(--primary-color);
                      width: fit-content;
                      color: white;
                      border-radius: 5px;
                      font-size: 1.8em;
                      padding: 0.2em 1em;
                      margin-block: 10px;

                      @media (max-width: 960px) {
                        margin-left: auto;
                      }
                    }
                    .menu_carousel-title {
                      font-size: 4em;
                      text-transform: uppercase;
                      color: var(--text-contrast-color);
                      display: flex;
                      flex-direction: column;
                      gap: 5px;
                      font-weight: 600;
                      /* margin-bottom: 20px; */

                      .carousel-title-wrapper {
                        display: flex;
                        align-items: center;
                        gap: 20px;

                        @media (max-width: 960px) {
                          align-items: unset;
                          flex-direction: column-reverse;
                          font-size: 0.8em;
                          gap: 10px;
                        }
                      }
                      .service-price {
                        background-color: var(--primary-color);
                        color: white;
                        font-weight: 600;
                        width: fit-content;
                        padding: 5px 15px;
                        border-radius: 10px;
                        font-size: 0.6em;
                      }

                      &::after {
                        content: '';
                        width: 80px;
                        height: 3px;
                        background: var(--primary-color);
                      }
                    }
                    .menu_carousel-description {
                      font-size: 1.8em;
                      width: 90%;
                      color: #232324;
                      margin-block: 20px;
                      max-height: 150px;
                      overflow-y: auto;

                      > ul {
                        margin-top: 20px;
                        /* display: flex; */
                        flex-wrap: wrap;

                        > li {
                          flex: 1;
                          min-width: 100px;
                        }
                      }
                      ul > li::marker {
                        content: '- ';
                      }
                      > ul > li::marker {
                        content: '\f00c';
                        font-family: 'Font Awesome 6 Free';
                        font-weight: bold;
                        color: #6da536;
                      }
                    }
                    .menu_carousel-default-info {
                      display: flex;
                      flex-wrap: wrap;
                      gap: 10px;
                      border-top: 2px solid #dddede;
                      padding-block: 20px;

                      .feature-item {
                        display: flex;
                        align-items: center;
                        justify-content: start;
                        padding-inline: 20px;
                        gap: 20px;
                        flex: 1;

                        &:not(:first-child):not(:last-child) {
                          border-left: 2px solid #dddede;
                          border-right: 2px solid #dddede;
                        }

                        i {
                          font-size: 30px;
                          color: var(--primary-color);
                        }

                        .feature-item-wrapper_content {
                          gap: 30px;

                          .feature-item-title {
                            font-size: 1.6em;
                            font-weight: 400;
                            text-transform: uppercase;
                            margin-bottom: 0px;
                          }
                          .feature-item-description {
                            font-size: 2em;

                            .additional-data {
                              font-size: 0.8em;
                              color: #343434;
                            }
                            .price {
                              font-weight: 600;
                              color: #6da536;
                            }
                          }
                        }
                      }
                    }
                    .menu-carousel-ctas {
                      margin-top: auto;
                      a {
                        display: block;
                        background-color: var(--primary-color);
                        color: white;
                        font-size: 2em;
                        text-decoration: none;
                        width: fit-content;
                        padding: 8px 18px;
                        border-radius: 5px;

                        &::hover {
                          background-color: white;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
  }
}
customElements.define('menu-swiper', MenuSwiper);
