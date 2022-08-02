window.addEventListener('scroll', e => {
    const { body, documentElement } = document
    const navbarClass = document.querySelector('nav').classList
    if (body.scrollTop > 80 || documentElement.scrollTop > 80)
        navbarClass.add('scroll-nav');
    else
        navbarClass.remove('scroll-nav');
})