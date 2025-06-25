// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on link
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Counter Animation for Statistics
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const current = parseInt(counter.textContent) || 0;
        const increment = target / 50;
        const isPercentage = counter.textContent.includes('%');
        const hasPlus = counter.textContent.includes('+');
        
        if (current < target) {
            const newValue = Math.ceil(current + increment);
            let displayValue = newValue;
            
            if (isPercentage) {
                displayValue = newValue + '%';
            } else if (hasPlus && newValue >= target) {
                displayValue = target + '+';
            } else if (hasPlus) {
                displayValue = newValue + '+';
            }
            
            counter.textContent = displayValue;
            
            setTimeout(() => animateCounters(), 50);
        }
    });
}

// Trigger counter animation when section is visible
const statsSection = document.querySelector('.stats-card');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

// Calculator Functionality
const contractSumSlider = document.getElementById('contract-sum');
const contractValueDisplay = document.getElementById('contract-value');
const sroTypeSelect = document.getElementById('sro-type');

function formatNumber(num) {
    return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ' ');
}

function updateCalculator() {
    if (!contractSumSlider || !contractValueDisplay) return;
    
    const contractSum = parseInt(contractSumSlider.value);
    const sroType = sroTypeSelect ? sroTypeSelect.value : 'builders';
    
    // Update contract sum display
    contractValueDisplay.textContent = formatNumber(contractSum) + ' ₽';
    
    // Calculate fees based on contract sum and SRO type
    let entryFee = 5000;
    let monthlyFee = 5000;
    let compensationFund = 0;
    let insurance = 7500;
    
    // Compensation fund calculation based on contract sum
    if (contractSum <= 1000000) {
        compensationFund = 100000;
    } else if (contractSum <= 3000000) {
        compensationFund = 300000;
    } else if (contractSum <= 10000000) {
        compensationFund = 500000;
    } else if (contractSum <= 50000000) {
        compensationFund = 1000000;
    } else {
        compensationFund = 5000000;
    }
    
    // Adjust fees based on SRO type
    if (sroType === 'designers') {
        entryFee = 3000;
        monthlyFee = 3000;
        insurance = 5000;
    } else if (sroType === 'surveyors') {
        entryFee = 4000;
        monthlyFee = 4000;
        insurance = 6000;
    }
    
    // Update displays
    const entryFeeEl = document.getElementById('entry-fee');
    const monthlyFeeEl = document.getElementById('monthly-fee');
    const compensationFundEl = document.getElementById('compensation-fund');
    const insuranceEl = document.getElementById('insurance');
    const totalCostEl = document.getElementById('total-cost');
    
    if (entryFeeEl) entryFeeEl.textContent = formatNumber(entryFee) + ' ₽';
    if (monthlyFeeEl) monthlyFeeEl.textContent = formatNumber(monthlyFee) + ' ₽';
    if (compensationFundEl) compensationFundEl.textContent = formatNumber(compensationFund) + ' ₽';
    if (insuranceEl) insuranceEl.textContent = formatNumber(insurance) + ' ₽';
    
    const totalCost = entryFee + monthlyFee + compensationFund + insurance;
    if (totalCostEl) totalCostEl.textContent = formatNumber(totalCost) + ' ₽';
}

// Initialize calculator
if (contractSumSlider) {
    contractSumSlider.addEventListener('input', updateCalculator);
    updateCalculator();
}

if (sroTypeSelect) {
    sroTypeSelect.addEventListener('change', updateCalculator);
}

// Form Validation and Submission
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        
        // Remove existing error styling
        input.classList.remove('error');
        
        if (!value) {
            input.classList.add('error');
            isValid = false;
        }
        
        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!emailRegex.test(value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && value) {
            const phoneRegex = /^[\\+]?[1-9]?[0-9]{7,14}$/;
            const cleanPhone = value.replace(/[\\s\\(\\)\\-]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                input.classList.add('error');
                isValid = false;
            }
        }
        
        // INN validation
        if (input.id === 'inn' && value) {
            const innRegex = /^[0-9]{10,12}$/;
            if (!innRegex.test(value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification__close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Handle form submissions
function handleFormSubmit(form, e) {
    e.preventDefault();
    
    if (!validateForm(form)) {
        showNotification('Пожалуйста, заполните все обязательные поля корректно', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Form submitted:', data);
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
        
        // Close modal if form is in modal
        const modal = form.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
        
        // Send to email (in real implementation, this would be handled by backend)
        sendEmail(data);
        
    }, 2000);
}

// Email sending function (mock implementation)
function sendEmail(formData) {
    // In real implementation, this would send data to your backend
    const emailBody = `
Новая заявка с сайта СРО НОСО:

Название организации: ${formData['company-name'] || 'Не указано'}
ИНН: ${formData.inn || 'Не указан'}
Контактное лицо: ${formData['contact-person'] || 'Не указано'}
Телефон: ${formData.phone || 'Не указан'}
Email: ${formData.email || 'Не указан'}
Дополнительная информация: ${formData.message || 'Нет'}

Дата: ${new Date().toLocaleString('ru-RU')}
    `;
    
    console.log('Email content:', emailBody);
    console.log('Send to: info@sronoso.ru');
}

// Attach form handlers
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => handleFormSubmit(form, e));
});

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\\D/g, '');
    
    if (value.startsWith('8')) {
        value = '7' + value.substring(1);
    }
    
    if (value.startsWith('7')) {
        if (value.length >= 1) value = '+7 (' + value.substring(1);
        if (value.length >= 7) value = value.substring(0, 7) + ') ' + value.substring(7);
        if (value.length >= 12) value = value.substring(0, 12) + '-' + value.substring(12);
        if (value.length >= 15) value = value.substring(0, 15) + '-' + value.substring(15, 17);
    }
    
    input.value = value;
}

// Apply phone formatting to phone inputs
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', () => formatPhoneNumber(input));
});

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Checklist functionality
document.querySelectorAll('.checklist-item__checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const label = this.nextElementSibling;
        if (this.checked) {
            label.style.opacity = '0.6';
            label.style.textDecoration = 'line-through';
        } else {
            label.style.opacity = '1';
            label.style.textDecoration = 'none';
        }
        
        // Update progress
        updateChecklistProgress();
    });
});

function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item__checkbox');
    const checked = document.querySelectorAll('.checklist-item__checkbox:checked').length;
    const total = checkboxes.length;
    const progress = Math.round((checked / total) * 100);
    
    console.log(`Документы готовы: ${checked} из ${total} (${progress}%)`);
}

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero__background');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add floating particles to hero section
function createParticles() {
    const particlesContainer = document.querySelector('.hero__particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s linear infinite;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// CSS for particle animation
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification--success {
        border-left: 4px solid #27AE60;
    }
    
    .notification--error {
        border-left: 4px solid #E74C3C;
    }
    
    .notification__content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
    }
    
    .notification__content i {
        color: #27AE60;
        font-size: 1.2rem;
    }
    
    .notification--error .notification__content i {
        color: #E74C3C;
    }
    
    .notification__close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        color: #7F8C8D;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .form__input.error {
        border-color: #E74C3C;
        background-color: #FEF5F5;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

document.head.appendChild(particleStyles);

// Initialize particles
createParticles();

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
