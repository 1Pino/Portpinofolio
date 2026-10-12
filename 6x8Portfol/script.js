


function randomOklchColor() {
  const hue = Math.random() * 360;
return `oklch(100 1000 ${hue})`;
}


document.addEventListener('DOMContentLoaded', () => {
    const selectors = ['#box', '.box'];
    const elements = selectors
        .flatMap(sel => Array.from(document.querySelectorAll(sel)))
        .filter((v, i, a) => a.indexOf(v) === i);

    if (!elements.length) return;

    const randomColor = () => {
        const supportsOklch = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('color', 'oklch(0 100 500)');
        if (supportsOklch) return randomOklchColor();
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const total = elements.length;
    const hueOffset = Math.random() * 360;
    const hues = Array.from({ length: total }, (_, index) => (index * (360 / total) + hueOffset) % 360);

    for (let index = hues.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [hues[index], hues[swapIndex]] = [hues[swapIndex], hues[index]];
    }

    elements.forEach((el, index) => {
        const hue = hues[index];

        const bgColor = `oklch(${(0.18 + (index % 3) * 0.08).toFixed(3)} ${(0.2 + (index % 4) * 0.08).toFixed(3)} ${hue.toFixed(1)})`;
        const textColor = `oklch(${(0.82 + (index % 2) * 0.04).toFixed(3)} ${(0.1 + (index % 5) * 0.04).toFixed(3)} ${(hue + 8).toFixed(1)})`;

        el.style.backgroundColor = bgColor;
        el.style.color = textColor;

        el.style.setProperty('--random-color', bgColor);
        el.style.setProperty('--random-text-color', textColor);
    });

    const addRevealBehavior = (trigger, reveal, toggleClass = 'active') => {
        if (!trigger || !reveal) return;

        const isPinned = () => trigger.classList.contains(toggleClass);

        const setVisible = (visible, pinned = false) => {
            trigger.classList.toggle('is-visible', visible);
            trigger.classList.toggle(toggleClass, pinned);
            reveal.classList.toggle('visible', visible || pinned);
            trigger.setAttribute('aria-expanded', String(visible || pinned));
        };

        trigger.addEventListener('mouseenter', () => {
            if (!isPinned()) setVisible(true, false);
        });

        trigger.addEventListener('mouseleave', () => {
            if (!isPinned()) setVisible(false, false);
        });

        trigger.addEventListener('click', () => {
            const pinned = !isPinned();
            setVisible(pinned, pinned);
        });

        trigger.addEventListener('focus', () => {
            if (!isPinned()) setVisible(true, false);
        });

        trigger.addEventListener('blur', () => {
            if (!isPinned()) setVisible(false, false);
        });
    };

    addRevealBehavior(document.querySelector('.about-title'), document.querySelector('.about-text'));
    addRevealBehavior(document.querySelector('.contact-title'), document.querySelector('.contact-links'));

    const targetProject = document.getElementById(window.location.hash.slice(1));
    const targetPanel = targetProject?.querySelector('.project-detail-panel');
    const targetLink = targetProject?.querySelector('.project > a[href="#"]');

    if (targetProject && targetPanel) {
        targetPanel.classList.add('show');
        targetPanel.setAttribute('aria-hidden', 'false');
        targetLink?.classList.add('active');
        targetLink?.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(() => targetProject.scrollIntoView({ block: 'start' }));
    }

    const projectLinks = document.querySelectorAll('.projects .project > a[href="#"]');

    projectLinks.forEach(link => {
        const panel = link.closest('.project')?.querySelector('.project-detail-panel');

        if (!panel) return;

        link.addEventListener('click', event => {
            event.preventDefault();
            const isOpen = panel.classList.toggle('show');
            link.classList.toggle('active', isOpen);
            panel.setAttribute('aria-hidden', String(!isOpen));
        });
    });
});
