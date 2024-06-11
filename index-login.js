var btn_log = window.document.getElementById('button_log');
var btn_cadastro = window.document.getElementById('button_cad');
var notification = document.getElementById('notification');
var content = document.getElementById('content-not');
var fieldsets = document.querySelectorAll('.cadastro >* fieldset');
var editprofile = document.querySelectorAll('.editprofile');
var released = true

function observeVisibility(element, funcao) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && released) {
                funcao()
                released = false
            }
        });
    });
    observer.observe(element);
    released = true
}

function userVerification() {
    let email = window.document.getElementById('email').value;
    let password = window.document.getElementById('password').value;
    let auth = firebase.auth()

    btn_log.disabled = true

    auth.signInWithEmailAndPassword(email, password)
    .then((credentialUser) => {
        let user = credentialUser.user

        sessionStorage.setItem('user', user.uid)
        window.location.href = './win-guru.html';
    })
    .catch((err) => {

        notification.style.display = 'flex'
        setTimeout(() => {
            notification.style.display = 'none'
            btn_log.disabled = false
        }, 3000)

        switch (err.code) {
            case 'auth/invalid-email':
                content.innerText = 'Insira um e-mail valido'
                break;
            case 'auth/wrong-password':
                content.innerText = 'Preencha o campo "senha"'
                break;
            case 'auth/user-disabled':
                content.innerText = 'Esta conta do usuário foi desativada por um administrador.'
                break;
            default:
                let messErr = '{"error":{"code":400,"message":"INVALID_LOGIN_CREDENTIALS","errors":[{"message":"INVALID_LOGIN_CREDENTIALS","domain":"global","reason":"invalid"}]}}'
                if(err.message == messErr) {
                    content.innerText = 'Email ou senha invalido'
                }else {
                    content.innerText = 'Erro interno. Contate um ADM'
                }
                console.log(compiledErr)
                break;
        }
    })
}

const handleKeydown = (keyPress) => {
    if(keyPress.code == "Enter") {
        observeVisibility(btn_log, userVerification)
        observeVisibility(btn_cadastro, userCreate)
    }
}

document.addEventListener("keydown", handleKeydown)

function userCreate() {
    let fullName = document.getElementById('fullName').value.toLowerCase();
    let nickName = document.getElementById('nickName').value.toLowerCase();
    let birth = document.getElementById('birth').value;
    let newUser = document.getElementById('newUser').value.toLowerCase();
    let passUser = document.getElementById('passUser').value;
    let passUserConfirm = document.getElementById('passUserConfirm').value;
    let auth = firebase.auth()

    var sexo = function() {
        let female = document.getElementById('feminino').checked;
        let male = document.getElementById('masculino').checked;
        let sexUser;

        if(female) {
            sexUser = 'feminino'
        }else if(male) {
            sexUser = 'masculino'
        }else {
            sexUser = 'indefinido'
        }

        return sexUser
    }

    btn_cadastro.disabled = true
       

    fieldsets.forEach((field) => {
        if(field.children[1].value == '') {
            field.style.borderColor = 'red'
            field.children[0].style.color = 'red'
        }
        field.children[1].addEventListener('input', () => {
            field.style.borderColor = '#327732';
            field.children[0].style.color = '#327732'
        })
    })

    if(passUser != passUserConfirm) {
        notification.style.display = 'flex'
        setTimeout(() => {
            notification.style.display = 'none'
            btn_cadastro.disabled = false
        }, 3000)
        content.innerText = 'As senhas precisam ser iguais'
    } else if(editprofile[0].value != '' && editprofile[1].value != '' &&  editprofile[2].value != '' && sexo() !== 'indefinido') {
        auth.createUserWithEmailAndPassword(newUser, passUser)
        .then((sucessfull) => {
            const user = sucessfull.user;
            const uid = user.uid;
            var db = firebase.firestore();

            db.collection("user-accont").doc(uid).set({
                profile: {
                    birth: birth,
                    email: newUser,
                    nome: fullName,
                    profileImage: "https://firebasestorage.googleapis.com/v0/b/win-guru-bet.appspot.com/o/www%2Fphotos%2Fuser-default.jpg?alt=media&token=9858a407-d994-4cf2-8e83-5494e0a07f16",
                    sexo: sexo(),
                    typeAccont: "default",
                    userName: nickName,
                    vip: false
                }
            })
            .then(() => {
                notification.style.display = 'flex'
                setTimeout(() => {
                    document.getElementById('back-login').click()
                    notification.style.display = 'none'
                    btn_cadastro.disabled = false
                }, 3000)
                content.innerText = 'Usuário cadastrado com sucesso!'
            })
            .catch((error) => {
                setTimeout(() => {
                    notification.style.display = 'none'
                    btn_cadastro.disabled = false
                }, 3000)
                content.innerText = 'Erro ao se cadastrar. Verifique as informações e tente novamente'
            });
        })
        .catch((err) => {
            let btn_cadastro = window.document.getElementById('button_cad');
            notification.style.display = 'flex'

            setTimeout(() => {
                notification.style.display = 'none'
                btn_cadastro.disabled = false
            }, 3000) 
            
            switch (err.code) {
                case 'auth/email-already-in-use':
                    content.innerText = 'Este e-mail já está em uso'
                    break;
                case 'auth/wrong-password':
                    content.innerText = 'Preencha o campo "senha"'
                    break;
                case 'auth/weak-password':
                    content.innerText = 'Sua senha precisa conter no mínimo 6 caracteres'
                    break;
                case 'auth/invalid-email':
                    content.innerText = 'Insira um e-mail valido"'
                    break;
                default:
                    content.innerText = 'Erro interno. Contate um ADM'
                    console.log(err)
                    break;
            }
        })  
    } else {
        notification.style.display = 'flex'
        setTimeout(() => {
            notification.style.display = 'none'
            btn_cadastro.disabled = false
        }, 3000)
        content.innerText = 'Preencha todos os campos obrigatórios'
    }
}

function carouselImage(id, time) {
    let father = window.document.getElementById(id);
    let childs = father.children
    let i = 1

    setInterval(() => {
        childs[i].scrollIntoView({behavior: 'smooth', block: 'center'});
        i++

        if(i >= childs.length) {
            i = 0
        }
    }, time)
}

carouselImage('slide', 5000)