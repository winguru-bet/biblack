var userName = window.document.getElementById('user-name-profile');
var userImage = window.document.getElementById('image-profile');
var roleta = window.document.getElementById('roulette_slider');
var sorteRandom = window.document.getElementById('clicksorte');
var msgUser = document.getElementById('msg_user_chat');
var keyUser = sessionStorage.getItem('user');

var db = firebase.firestore();
var rt = firebase.database();

db.collection("user-accont").doc(keyUser).get()
.then((snapData) => {
    let clear = document.querySelectorAll('.loading')
    let data = snapData.data()
    let jsonCompile = JSON.stringify(data)

    clear.forEach((e) => {
        e.classList.remove('loading')
    })

    sessionStorage.setItem('dataUser', jsonCompile)
    userImage.src = data.profile.profileImage
    userName.innerText = data.profile.userName
    
})

rt.ref(`chats/chat-user/`).on('child_added', (snapshot) => {
    let dados = snapshot.val()
    let userChat = window.document.getElementById('scroll-content')
    
    let dv1 = document.createElement('div')
    dv1.classList.add('user-linear-chat')

    let dv2 = document.createElement('div')
    dv2.classList.add('user-sms')

    let dv3 = document.createElement('div')

    let img = document.createElement('img')
    img.classList.add('user-perfil-chat')
    img.src = dados.profile

    let span = document.createElement('span')
    span.classList.add('chat-user-name')
    span.innerText = dados.userSend

    let spanTalk = document.createElement('span')
    spanTalk.innerText = dados.talk

    dv1.appendChild(dv3)
    dv1.appendChild(dv2)
    dv2.appendChild(span)
    dv2.appendChild(spanTalk)
    dv3.appendChild(img)
    userChat.appendChild(dv1)

    if(dados.vip) {
        dv3.classList.add('vip-user')
    }

    userChat.scrollTop = userChat.scrollHeight
})

rt.ref(`chats/chat-bot/`).on('child_added', (snapshot) => {
    let dados = snapshot.val()
    let father = document.getElementById('chatBot')

    let dv1 = document.createElement('div')
    dv1.classList.add('container-chat')

    let dv2 = document.createElement('div')
    dv2.classList.add('message')

    let dv3 = document.createElement('div')
    dv3.classList.add('container-ms')

    let dv4 = document.createElement('div')
    dv4.classList.add('container-ms')
    dv4.classList.add('time-send')

    let img = document.createElement('img')
    img.classList.add('perfil-bot')
    img.src = dados.profile

    let span = document.createElement('span')
    span.classList.add('chat-name')
    span.innerText = dados.botSend

    let previsao = document.createElement('span')
    previsao.innerText = dados.prevision

    let time = document.createElement('span')
    time.classList.add('time-message')
    time.innerText = dados.time

    dv1.appendChild(img)
    dv1.appendChild(dv2)
    dv2.appendChild(dv3)
    dv2.appendChild(dv4)
    dv3.appendChild(span)
    dv3.appendChild(previsao)
    dv4.appendChild(time)
    father.appendChild(dv1)
    father.scrollTop = father.scrollHeight
})

function send_msg() {
    let msg = document.getElementById('msg_user_chat');

    if(msg.value.trim() != '') {
        let hr = String(new Date().getHours() < 10 ? '0' + new Date().getHours(): new Date().getHours())
        let min = String(new Date().getMinutes() < 10 ? '0' + new Date().getMinutes(): new Date().getMinutes())
        let sec = String(new Date().getSeconds() < 10 ? '0' + new Date().getSeconds(): new Date().getSeconds())
        let mls = String(new Date().getMilliseconds() < 10 ? '0' + new Date().getMilliseconds(): new Date().getMilliseconds())
        let jsonConvert = JSON.parse(sessionStorage.getItem('dataUser'))

        let dados = {
            profile: jsonConvert.profile.profileImage,
            char: hr + min + sec + mls + keyUser,
            userSend: jsonConvert.profile.userName,
            talk: msg.value,
            typeAccont: jsonConvert.profile.typeAccont,
            vip: jsonConvert.profile.vip
        }

        rt.ref(`chats/chat-user/${dados.char}/`).set(dados)
        .then(() => {
            msg.value = ''
        })
        .catch((err) => {
            console.log('Erro ao enviar: ', err)
        })   
    }
    msg.focus()
}

document.addEventListener('keydown', (key) => {
    if(key.code == "Enter" && msgUser.value != '') {
        send_msg()
    }
})
function girar() {
    roleta.style.transform = 'translateX(-14200px)'
    console.log('girou')
}

// CONFIGURAÇÕES DO GRÁFICO

const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
        ]
          ,
        datasets: [
            {
                label: '# Saida do Vermelho',
                data: [10, 3, 6, 4, 1],
                borderWidth: 2,
                color: '#fff',
                borderColor: '#f12c4c',
                backgroundColor: '#f12c4c'
            },
            {
                label: '# Saida do Preto',
                data: [2, 5, 4, 8, 9],
                borderWidth: 2,
                color: '#fff',
                borderColor: '#262f36',
                backgroundColor: '#262f36'
            },
            {
                label: '# Branco',
                data: [1, 0, 2, 2, 0],
                borderWidth: 2,
                color: '#fff',
                borderColor: '#ffffff',
                backgroundColor: '#ffffff'
            },
            
            
        ]
    },
    options: {
        scales: {
        y: {
            beginAtZero: true
        }
        }
    }
});
