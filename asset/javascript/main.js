//.....import.....//
import { recursive } from "./base.js";
/***** Header *****/
header();
function header() {
    let input = document.querySelector('.header__input')
    changeSize();
    function changeSize() {
        let logo = document.querySelector('.header__logo'),
            leftHeader = document.querySelector('.header__logo-box'),
            rightHeader = document.querySelector('.header__navigation')

        setInterval(() => {
            if (window.innerWidth < 840) {
                logo.setAttribute('src', './asset/img/logo-mobile.png');
                leftHeader.classList.add('m-3');
                rightHeader.classList.add('m-4');
            }
            else {
                logo.setAttribute('src', './asset/img/logo.png');
                leftHeader.classList.remove('m-3');
                rightHeader.classList.remove('m-4');
            }
        }, 200);
    };

    headerInput();
    function headerInput() {
        let cursor = document.querySelector('.header__input-cursor')

        setInterval(() => { cursor.classList.toggle('flicker') }, 600);
        input.addEventListener('input', (e) => {
            cursor.style.display = 'none';
            input.style.caretColor = 'unset';
            if (e.target.value == '') {
                cursor.style.display = 'block';
                input.style.caretColor = 'transparent';
            };
            if (e.target.value.length > 9) {
                e.target.value = e.target.value.slice(0, 9);
            };
        });

    };
    // MenuSearch
    let menuSearch = document.querySelector('.header__menu-search'),
        keySearchs = document.querySelectorAll('.header__menu-search-key'),
        keyLength = keySearchs.length - 1,
        arrayKey = [],
        marginKey = 0,
        i = 0,
        colors = [
            'rgb(255, 0, 0)',
            'rgb(255, 0, 132)',
            'rgb(255, 242, 0)',
            'rgb(0, 21, 255)',
            'rgb(0, 255, 47)',
            'rgb(255, 0, 132)',
            'rgb(255, 242, 0)',
            'rgb(0, 255, 47)',
            'rgb(255, 0, 0)'
        ];

    // PositionToSearch
    recursive(0, keySearchs, position)
    function position(element) {
        marginKey += 15
        element.style.opacity = 1;
        if (element.innerText === 'c') {
            element.style.left = (marginKey -= 4) + 'px';
        }
        if (element.innerText === 's') {
            element.style.left = (marginKey += 8) + 'px';
        }
        element.style.left = marginKey + 'px';
        i++
    }

    // AimationIn
    input.addEventListener('click', animationInput)
    function animationInput() {
        // Random/copy Array
        for (let item of keySearchs) {
            if (Number.parseInt(Math.random() * keyLength) % 2 != 0) {
                arrayKey.push(item)
            }
            else {
                arrayKey.unshift(item)
            }
        }
        // menuSearch.style.display = 'flex';
        setTimeout(() => {
            recursive(100, arrayKey, step1)
            function step1(element, index) {
                element.style.top = '10%'

            }

        }, 0)
    };

    // Login menu
    LoginMenu()
    function LoginMenu() {
        let menuLogin = document.querySelector('.menu-login'),
            title = document.querySelector('.menu-login__title'),
            socialLogin = document.querySelector('.menu-login-social'),
            checkBox = document.querySelector('#menu-login__checkbox'),
            memorizeText = document.querySelector('.menu-login__memorize-text'),
            recovery = document.querySelector('.menu-login__recovery'),
            loginBtn = document.querySelector('.menu-login__login-btn'),
            register = document.querySelector('.menu-login__register-btn'),
            registerText = document.querySelector('.menu-login__register-text'),
            iconHidePw = document.querySelector('.menu-login__password .hide-pw'),
            inputPw = document.querySelector('.menu-login__input-password');


        iconHidePw.addEventListener('click', hidePassWord);
        function hidePassWord() {
            iconHidePw.classList.toggle('fa-eye-slash')
            if (inputPw.type === 'password') {
                inputPw.type = 'text'
            }
            else {
                inputPw.type = 'password'
            };

        };

        register.addEventListener('click', openRegister);
        function openRegister() {
            menuLogin.style.animation = 'menu-login ease 1s';
            socialLogin.style.display = 'none';
            checkBox.style.display = 'none';
            memorizeText.style.display = 'none';
            recovery.style.display = 'none';
            title.innerText = 'Đăng ký bằng tên người dùng';
            loginBtn.innerText = 'Đăng ký';
            registerText.innerText ='Bạn đã có tài khoản?';
            register.innerText = 'Đăng nhập ngay';

            setTimeout(() => {
                menuLogin.style.animation = '';
            }, 2000);
        };
    };
};

