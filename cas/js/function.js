function getQueryString(name, href) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (href) {
        r = href.substr(href.indexOf('?') + 1).match(reg);
    }
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}