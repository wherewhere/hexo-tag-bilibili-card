const script = getScript("bilibili-card.js");

function getScript(scriptName) {
    const scripts = document.scripts;
    for (let i = scripts.length; i >= 0;) {
        const script = scripts[--i];
        if (script.src.substring(script.src.lastIndexOf('/') + 1) === scriptName) {
            return script;
        }
    }
}

function cardTemplate(imageProxy, { v_id, v_cover, v_time, v_title, v_playview, v_danmaku, v_upname }) {
    return `<link rel="stylesheet" href="https://cdn.staticfile.net/font-awesome/4.7.0/css/font-awesome.min.css">
            <div class="default-flex video-holder normal-card">
                <a class="default-flex" href="//www.bilibili.com/video/${v_id}" target="_blank">
                    <div class="disable-event cover-box">
                        <div class="cover-img"
                            style="background-image: url(${imageProxy}${v_cover})">
                        </div>
                        <div class="video-mask">
                            <i class="video-icon fa fa-youtube-play"></i>
                            <div class="video-sub">
                                <div class="video-duration">${v_time}</div>
                            </div>
                        </div>
                    </div>
                    <div class="disable-event video-content-container">
                        <p class="double-ellipsis video-title">${v_title}</p>
                        <div class="video-card-info">
                            <div class="cover-info-item">
                                <i class="iconfont fa fa-youtube-play"></i>
                                <span class="single-ellipsis num-info">${v_playview}</span>
                            </div>
                            <div class="cover-info-item">
                                <i class="iconfont fa fa-list-alt"></i>
                                <span class="single-ellipsis num-info">${v_danmaku}</span>
                            </div>
                        </div>
                        <div class="video-card-bottom">
                            <label class="card-text-label">视频</label>
                            <div class="view-flex default-flex align-center slim-author-info">
                                <label class="icon-up">UP</label>
                                <span class="view-flex single-ellipsis author-name">${v_upname}</span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>`;
}

class BilibiliCard extends HTMLElement {
    static get observedAttributes() {
        return ['aid', 'title', 'upper', 'cover', 'duration', 'views', 'danmakus', 'image-proxy'];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = script.src.substring(0, script.src.lastIndexOf('.')) + ".css";
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = cardTemplate(this.imageProxy, {
            v_id: this.aid,
            v_cover: this.cover,
            v_time: this.duration,
            v_title: this.title,
            v_playview: this.views,
            v_danmaku: this.danmakus,
            v_upname: this.upper
        });
        shadowRoot.appendChild(link);
    }

    get aid() {
        return this.getAttribute('aid');
    }
    set aid(value) {
        this.setAttribute('aid', value);
    }

    get title() {
        return this.getAttribute('title');
    }
    set title(value) {
        this.setAttribute('title', value);
    }

    get upper() {
        return this.getAttribute('upper');
    }
    set upper(value) {
        this.setAttribute('upper', value);
    }

    get cover() {
        return this.getAttribute('cover');
    }
    set cover(value) {
        this.setAttribute('cover', value);
    }

    get duration() {
        return this.getAttribute('duration');
    }
    set duration(value) {
        this.setAttribute('duration', value);
    }

    get views() {
        return this.getAttribute('views');
    }
    set views(value) {
        this.setAttribute('views', value);
    }

    get danmakus() {
        return this.getAttribute('danmakus');
    }
    set danmakus(value) {
        this.setAttribute('danmakus', value);
    }

    get imageProxy() {
        return this.getAttribute('image-proxy');
    }
    set imageProxy(value) {
        this.setAttribute('image-proxy', value);
    }
}

customElements.define('bilibili-card', BilibiliCard);
