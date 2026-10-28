document.addEventListener('DOMContentLoaded', () => portfolioApp.init());

const portfolioApp = {
    init() {
        const backToTop = createBackToTopButton(document.body);
        const contactForm = document.querySelector('#contact-form');

        if (contactForm) {
            setupContactForm(contactForm);
        }

        setupBackToTop(backToTop);
        setupSmoothNavigation();
        setupReadMoreButtons();
        setupResponsiveNavigation();
    },

    showBackToTop(button) {
        button.classList.toggle('is-visible', window.scrollY > 500);
    },

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

function setupBackToTop(button) {
    window.addEventListener('scroll', () => portfolioApp.showBackToTop(button), { passive: true });
    button.addEventListener('click', portfolioApp.scrollToTop);
}

function setupContactForm(form) {
    const formMessage = createFormMessage();
    form.append(formMessage);

    form.addEventListener('submit', (event) => handleFormSubmit(event, form, formMessage));
}

function createFormMessage() {
    const message = document.createElement('p');

    message.className = 'form-message';
    message.setAttribute('role', 'status');
    return message;
}

function handleFormSubmit(event, form, message) {
    event.preventDefault();
    message.textContent = 'Thanks for reaching out. Your message is ready to send.';
    form.reset();
}

function setupSmoothNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', handleNavigationClick);
    });
}

function setupResponsiveNavigation() {
    const header = document.querySelector('body > header');
    const navigation = header?.querySelector('nav');

    if (!header || !navigation) {
        return;
    }

    const menuButton = document.createElement('button');
    const mobileQuery = window.matchMedia('(max-width: 760px)');

    menuButton.type = 'button';
    menuButton.className = 'nav-toggle';
    menuButton.setAttribute('aria-label', 'Toggle navigation');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu';
    header.insertBefore(menuButton, navigation);

    menuButton.addEventListener('click', () => {
        const isOpen = header.classList.toggle('menu-open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    navigation.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => closeMobileNavigation(header, menuButton));
    });

    mobileQuery.addEventListener('change', () => {
        if (!mobileQuery.matches) {
            closeMobileNavigation(header, menuButton);
        }
    });
}

function closeMobileNavigation(header, menuButton) {
    header.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
}

function handleNavigationClick(event) {
    const target = document.querySelector(event.currentTarget.getAttribute('href'));

    if (!target) {
        return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setupReadMoreButtons() {
    document.querySelectorAll('.read-more-button').forEach((button) => {
        button.addEventListener('click', showDetails);
    });

    document.querySelectorAll('.back-button').forEach((button) => {
        button.addEventListener('click', hideDetails);
    });
}

function showDetails(event) {
    const button = event.currentTarget;
    const details = document.getElementById(button.dataset.moreTarget);
    const card = button.closest('.service-card, .study-card');

    if (!details || !card) {
        return;
    }

    const detailPage = createDetailPage(card, details);
    document.body.append(detailPage);
    document.body.classList.add('detail-mode');
}

function hideDetails(event) {
    const detailPage = event.currentTarget.closest('.detail-page');

    if (!detailPage) {
        return;
    }

    detailPage.remove();
    document.body.classList.remove('detail-mode');
}

function createDetailPage(card, details) {
    const detailPage = document.createElement('section');
    const title = document.createElement('h1');
    const paragraph = document.createElement('p');
    const backButton = document.createElement('button');

    detailPage.className = 'detail-page';
    detailPage.setAttribute('aria-live', 'polite');
    title.textContent = card.querySelector('h3').textContent;
    paragraph.textContent = details.querySelector('p').textContent;
    backButton.type = 'button';
    backButton.className = 'back-button';
    backButton.textContent = 'Back to Portfolio';
    backButton.addEventListener('click', hideDetails);

    detailPage.append(title, paragraph, backButton);
    return detailPage;
}

function createBackToTopButton(parentElement) {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.textContent = '\u2191';
    parentElement.append(button);

    return button;
}
