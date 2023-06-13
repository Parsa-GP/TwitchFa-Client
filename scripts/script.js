const month = new Date().getMonth();
if (month == 5) {
    document.querySelector(':root').style.setProperty('--vid-bg', 'var(--pride-flag)');
} else if (month == 11) {
    document.querySelector(':root').style.setProperty('--vid-bg', 'linear-gradient(90deg, #00c4ff, #005aff);');
}

let thumb_w = 1280;
let thumb_h = 720;

function notEmote(emote_name) {
    if (document.cookie.indexOf("noemotes") !== -1) {
        const noemotes = JSON.parse(getCookie("noemotes"))
        noemotes.push(emote_name)
        setCookie("noemotes", JSON.stringify(Array.from(new Set(noemotes))))
    } else {
        setCookie("noemotes", `["${emote_name}"]`)
    }
}

function getCookie(cname) {
    /* thanks w3school */
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function setCookie(cname, cvalue) {
    document.cookie = getCookie() + cname + "=" + cvalue + ";";
}

function backToPopup() {
    window.location.href = window.location.origin + window.location.pathname
}

function thumbUrl(chnl) {
    return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${chnl}-${thumb_w}x${thumb_h}.jpg`
}

function t2e(input) {
    let output;
    if (!ERR && em_dataresponse !== null) {
        console.log()
        const json = JSON.parse(JSON.stringify(em_dataresponse));
        const emotes = {};
        json.emote_set.emotes.forEach((emote) => {
            emotes[emote.name] = `https:${emote.data.host.url}/2x.webp`;
        });
        output = input.replace(/\b(\w+)\b/g, (_match, word) =>
            emotes[word] ? `<img class="emote e-7tv" src="${emotes[word]}">` : word
        );

        return output;
    }
    
}

function f2k(follower) {
    follower = follower.toString().replace(/[^0-9.]/g, '');
    if (follower < 1000) {return follower}
    let si = [
        {v: 1E3, s: "K"},
        {v: 1E6, s: "M"},
        {v: 1E9, s: "B"},
        {v: 1E12, s: "T"},
        {v: 1E15, s: "P"},
        {v: 1E18, s: "E"}
    ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
        if (follower >= si[index].v) {
            break;
        }
    }
    return (follower / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
}






/*██                       ▀██
  ██ ▄▄▄  ▄▄▄ ▄▄  ▄▄▄ ▄▄▄   ██ ▄▄ 
  ██▀  ██  ██▀ ▀▀  ██  ██   ██▀ ██
  ██    █  ██      ██  ██   ██  ██
  ▀█▄▄▄▀  ▄██▄     ▀█▄▄▀█▄ ▄██▄ █*/
