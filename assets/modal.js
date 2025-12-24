// Modal Logic
const modal = document.getElementById('code-modal');
const modalCode = document.getElementById('modal-code');

const codeSnippets = {
    spread: `
key: 'spread-section',
trigger: 'viewProgress',
effects: [
    {
        key: 'spread-card-0',
        fill: 'both',
        rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
        rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
        keyframeEffect: {
            name: 'stayCenter',
            keyframes: [
                { transform: 'translate(-50%, -50%) scale(1)' },
                { transform: 'translate(-50%, -50%) scale(1.3)' }
            ]
        }
    },
    // ... other cards kept implicitly by leaving config structure similar ...
    {
        key: 'spread-card-1',
        fill: 'both',
        rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
        rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
        keyframeEffect: {
            name: 'spreadLeftInner',
            keyframes: [
                { transform: 'translate(-50%, -50%) scale(1)' },
                { transform: 'translate(calc(-50% - 16vw), -50%) scale(1.15)' }
            ]
        }
    },
    {
        key: 'spread-card-2',
        fill: 'both',
        rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
        rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
        keyframeEffect: {
            name: 'spreadRightInner',
            keyframes: [
                { transform: 'translate(-50%, -50%) scale(1)' },
                { transform: 'translate(calc(-50% + 16vw), -50%) scale(1.15)' }
            ]
        }
    },
    {
        key: 'spread-card-3',
        fill: 'both',
        rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
        rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
        keyframeEffect: {
            name: 'spreadLeftOuter',
            keyframes: [
                { transform: 'translate(-50%, -50%) scale(1)' },
                { transform: 'translate(calc(-50% - 32vw), -50%) scale(0.9)' }
            ]
        }
    },
    {
        key: 'spread-card-4',
        fill: 'both',
        rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
        rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
        keyframeEffect: {
            name: 'spreadRightOuter',
            keyframes: [
                { transform: 'translate(-50%, -50%) scale(1)' },
                { transform: 'translate(calc(-50% + 32vw), -50%) scale(0.9)' }
            ]
        }
    }
]
            `
};

function openModal(type) {
    modalCode.textContent = codeSnippets[type];
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Export for global access
window.openModal = openModal;
window.closeModal = closeModal;

