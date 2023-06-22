let isError = false;
let err = "";
let twitchId;
let em_dataresponse;

var slider = document.getElementById("set-color-hue");
var chatw = document.getElementById("set-chat-width");
var setbtn = document.getElementById("settings-btn");
var setsub = document.getElementById("set-submit");
var setcont = document.getElementById("settings-cont");

let Root = document.querySelector(':root').style

let hue = 264;
let saturation = 100;
let cwidth = 250;

if (document.cookie.indexOf('hue=') == -1) {
    document.cookie = hue;
} else {
    hue = getCookie("hue");
}

if (document.cookie.indexOf('cw=') == -1) {
    document.cookie = cwidth;
} else {
    cwidth = getCookie("cw");
}

slider.value = hue
chatw.value = cwidth

Root.setProperty('--ambient-color', `hsl(${hue}, ${saturation}%, 64%)`);
Root.setProperty('--ambient-color-hsl', `${hue}, ${saturation}%`);
Root.setProperty('--chat-width', `${cwidth}px`);

chatw.onchange = function() {
    cwidth = this.value;
    setCookie("cw", cwidth)
    Root.setProperty('--chat-width', `${cwidth}px`);
    // console.log(cwidth)
}
slider.oninput = function() {
    hue = this.value;
    setCookie("hue", this.value)
    Root.setProperty('--ambient-color', `hsl(${hue}, ${saturation}%, 64%)`);
    Root.setProperty('--ambient-color-hsl', `${hue}, ${saturation}%`);
}
function resetHue() {
    document.cookie = "hue=264";
    hue = 264;
    slider.value = hue
    Root.setProperty('--ambient-color', `hsl(${hue}, ${saturation}%, 64%)`);
    Root.setProperty('--ambient-color-hsl', `${hue}, ${saturation}%`);
}

function setBtn() {
    document.getElementById("settings-cont").style.display = "flex"
}

function setSub() {
    document.getElementById("settings-cont").style.display = "none"
}


fetch('https://api.twitchfa.com/v2/twitch/streamers?page=1&limit=100')  
  .then(function(response) {
      if(!response.ok) {
        isError = true
        const error_div = document.createElement('div');
        const error_span = document.createElement('span');
        error_div.classList.add("error");
        error_span.classList.add("error-text");
        error_span.innerHTML = `API ERROR`;
        error_div.appendChild(error_span);
        document.getElementById("explore-grid").appendChild(error_div);
    }
  })
  .catch(function(error) {
    isError = true;
    err = 'Request failed! ' + error
    const error_div = document.createElement('div');
    error_div.classList.add("error");
    error_div.innerHTML = `${data["message"]}`;
    document.getElementById("explore-grid").appendChild(error_div);
  });

if (isError) {
    const error_div = document.createElement('div');
    error_div.classList.add("error");
    error_div.innerHTML = `${data["message"]}`;
    document.body.appendChild(error_div);
}

// Set chnl to ?channel=
const search_params = new URLSearchParams(window.location.search);
if (search_params.has('channel')) {
    chnl = search_params.get('channel');
    document.getElementById("popup").style.display = "none"
    bioInfo(chnl);
} else {
    exploreTable();
    throw new Error('The channel is not loaded');
}
// Set variables
let stream = document.getElementById('stream');
let src = document.getElementById('stream-src');
stream.poster = thumbUrl(chnl);
stream.addEventListener('error', function(e) {console.error('Error during video playback:', e)})

qualityDropdown.addEventListener("change", function() {
    const selectedUrl = qualityDropdown.value;
    if (selectedUrl !== "") {playStream(selectedUrl)}});
  

fetch(`https://tw-rly.fly.dev/streamer/${chnl}`)
.then(response => response.json())
.then(data => {
    const json_data = JSON.parse(JSON.stringify(data));
    const qualityDropdown = document.getElementById("qualityDropdown");

    let def;
    for (let i = 0; i < json_data.length; i++) {
        const option = document.createElement("option");
        option.value = json_data[i].url;
        option.text = json_data[i].quality;
        qualityDropdown.appendChild(option);
        if (json_data[i].quality == "480p") {
            def = json_data[i].url
        }
    }
    document.getElementById('qualityDropdown').value = def;
    playStream(def)
})

// Fetch Emote list
fetch(`https://tw-rly.fly.dev/streamer/${chnl}/bio`)
.then(response => response.json())
.then(data => {
    twitchId = data[0].data.user.id

    ERR=false
    fetch(`https://7tv.io/v3/users/twitch/${twitchId}`)
        .then(response => response.json())
        .then(data => em_dataresponse = data)
        .catch(error => {console.log(error); ERR = true;});
})


function bioInfo(streamer) {
    fetch(`https://tw-rly.fly.dev/streamer/${streamer}/bio`)
    .then(response => response.json())
    .then(data => {
        const user = data[0].data.user;

        twitchId = user.id

        let em_dataresponse;
        ERR=false
        fetch(`https://7tv.io/v3/users/twitch/${twitchId}`)
            .then(response => response.json())
            .then(data => em_dataresponse = data)
            .catch(error => {console.log(error); ERR = true;});


        document.getElementById("bio-pfp").src = user.profileImageURL;
        if (user.isPartner) {
            document.getElementById("bio-pfp-badge").style.display = "block";
        }
        document.getElementById("bio-name").innerHTML = streamer;
        document.getElementById("bio-follower").innerHTML = f2k(user.followers.totalCount) + " Followers";
        document.getElementById("bio-desc").innerHTML = user.description;

        const bio_cont = document.getElementById("bio-social-cont");
        user.channel.socialMedias.forEach(item => {
            const bioitem = document.createElement('a');
            bioitem.href = item.url;
            bioitem.classList.add('bio-item');

            const socialImage = document.createElement('img');
            socialImage.classList.add("bio-social");
            socialImage.src = "img/social/"+item.name+".png";
            socialImage.onerror = function() {this.src = "img/social/invalid.png"};
            socialImage.loading = "lazy";
            socialImage.alt = item.title;

            bioitem.appendChild(socialImage);
            bio_cont.appendChild(bioitem);
        })
    })
    .catch(error => {
        console.log(error);
        ERR = true;
        setTimeout(function() {bioInfo(streamer)}, 5000);
    });

}

function playStream(url) {
    if(Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(stream);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
            stream.play();
        });
    }
    else if (stream.canPlayType('application/vnd.apple.mpegurl')) {
        stream.src = url;
        stream.addEventListener('loadedmetadata',function() {
            stream.play();
        });
    }
    /* deprecated and simpler way (w/o supporting desktop)
    src.src = url;
    stream.load();
    */
}

/*function muteStream() {
    const video = document.querySelector('video');
    if (video.volume == 1) {
        video.volume = 0
    } else {
        video.volume = 1
    }
    
}*/

function msToHMS(ms) {
    let seconds = ms / 1000;

    let hours = parseInt( seconds / 3600 );
    seconds = seconds % 3600;

    let minutes = parseInt( seconds / 60 );
    seconds = Math.floor(seconds % 60);

    if (minutes < 10) {minutes = "0" + minutes;}
    if (seconds < 10) {seconds = "0" + seconds;}
    if (hours == 0) {return minutes+":"+seconds;}
    else {return hours+":"+minutes+":"+seconds;}
}

function exploreTable() {
    // You can modify the thumb_w and thumb_h in script.js.
    fetch(`https://api.twitchfa.com/v2/twitch/streamers?page=1&limit=100`)
      .then(response => response.json())
      .then(data => {resp_data = data
        const container = document.getElementById("explore-grid");

        let all_viewers = 0
        resp_data.data.forEach(item => {
            const exitem = document.createElement('a');
            exitem.href = window.location.origin + window.location.pathname + "?channel=" + item.login;
            exitem.classList.add('ex-item');

            // Thumbnail
            const thumbnail = document.createElement('img');
            thumbnail.classList.add("ex-thumb");
            thumbnail.loading = "lazy"
            thumbnail.src = item.thumbnailUrl.replace("{width}", thumb_w).replace("{height}", thumb_h);

            // Bottom Container
            const btm = document.createElement('div');
            btm.classList.add('ex-btm');

            // Profile Picture
            const profile = document.createElement('img');
            profile.classList.add("ex-pfp");
            profile.loading = "lazy"
            profile.src = item.profileUrl;

            
            // Text Container
            const cont = document.createElement('div');
            cont.classList.add('ex-text');

            // Display Name
            const displayName = document.createElement('p');
            displayName.classList.add("ex-name");
            displayName.textContent = item.displayName;

            // Uptime
            const upTime = document.createElement('p');
            upTime.classList.add("ex-uptime");
            upTime.textContent = msToHMS(item.uptime);

            // Game Name
            const gameName = document.createElement('p');
            gameName.classList.add("ex-gname");
            gameName.textContent = item.gameName;

            // Viewers
            const viewers = document.createElement('p');
            viewers.classList.add("ex-view");
            viewers.innerHTML = `<img class="ex-eye" src="img/eye.png"> ${item.viewers}`;
            all_viewers = all_viewers + Number(item.viewers);

            cont.appendChild(displayName);
            cont.appendChild(gameName);
            btm.appendChild(profile);
            btm.appendChild(cont);
            exitem.appendChild(viewers);
            exitem.appendChild(upTime);
            exitem.appendChild(thumbnail);
            exitem.appendChild(btm);
            container.appendChild(exitem);
        })
      document.getElementById("chnl-input").placeholder = "All viewers: " + all_viewers;
      })
      .catch(error => {console.log(error); ERR = true});
}
