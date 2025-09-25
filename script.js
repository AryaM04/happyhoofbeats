// Slideshow functionality
let currentSlideIndex = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

// Function to show a specific slide
function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Ensure index is within bounds
    if (index >= totalSlides) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = totalSlides - 1;
    else currentSlideIndex = index;
    
    // Add active class to current slide and indicator
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

// Function to change slide (next/previous)
function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
    resetAutoSlide();
}

// Function to go to specific slide
function currentSlide(index) {
    showSlide(index - 1);
    resetAutoSlide();
}

// Auto-advance slideshow
function startAutoSlide() {
    // Clear any existing interval first
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    slideInterval = setInterval(() => {
        showSlide(currentSlideIndex + 1);
    }, 8000); // Change slide every 8 seconds
}

// Reset auto-advance timer
function resetAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    startAutoSlide();
}

// Touch/swipe support for mobile
let startX = 0;
let endX = 0;
const slideshowContainer = document.querySelector('.slideshow-container:not(.testimonials-slideshow)');

if (slideshowContainer) {
    slideshowContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    slideshowContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = startX - endX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swiped left - next slide
            changeSlide(1);
        } else {
            // Swiped right - previous slide
            changeSlide(-1);
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Pause slideshow when hovering over it
if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', () => {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    });

    slideshowContainer.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
}

// Initialize slideshow
document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    startAutoSlide();
    initializeTestimonialSlideshow();
});

// --------------- TESTIMONIALS SLIDESHOW FUNCTIONALITY (SINGLE CARD) ---------------
const testimonials = [
    {
        name: "Alison, Bathgate",
        rating: "⭐⭐⭐⭐⭐",
        preview: "Steph and Jen are amazing with my daughter who has really bad anxiety. They're really patient with her and take everything at her pace.",
        full: "Steph and Jen are amazing with my daughter who has really bad anxiety. They're really patient with her and take everything at her pace. She is really coming out of her shell and loves attending her sessions and tells everyone about it. 5 stars from us."
    },
    {
        name: "Melissa, Larbert",
        rating: "⭐⭐⭐⭐⭐",
        preview: "I would highly recommend Happy Hoofbeats pony sessions. My twin boys are age nine and have been doing equine pony therapy for the past two years and have benefited so much from it...",
        full: "I would highly recommend Happy Hoofbeats pony sessions. My twin boys are age nine and have been doing equine pony therapy for the past two years and have benefited so much from it. There is literally no recreational activities suitable for my boys to attend out with school that can meet their complex needs. When we began the pony sessions one of my boys was highly anxious especially with new experiences. We come here every month and to see the difference in both my boys especially my little boy who is anxious is amazing to see. When he is around the ponies Jasper and Sparkles, my boy is so calm and his confidence is grown taking them for walks and learning to hold the rope. My other little boy has came on leaps and bounds holding the rope independently when taking the pony for a walk and following simple instructions which is amazing to see. We are so proud of them and it is great to see the difference in them both. My boys were previously non verbal and I witnessed the boys beginning to say words during their sessions. One of my boys said 'teeth' pointing to the pony's mouth. My little boy previously had no words and it honestly brought tears to my eyes. My other little boy said 'Bye, bye horses see you soon.' To hear him say that really showed how much his confidence has grown around the ponies. Their language has came on so much which has been incredible to witness when they have been with the ponies. Jen and Steph do a fantastic job of making the world of horses inclusive to all. We even had Jen, Steph and the ponies visit our house for my boys birthday last year of which was such a lovely surprise for them! They really do go above and beyond and we would never be without our pony sessions. It is such a unique service that offers so much to all our family. We can't thank Steph and Jen enough for everything they do."
    },    
    {
        name: "Pamela, Livingston",
        rating: "⭐⭐⭐⭐⭐",
        preview: "Thank you very much for having D along this afternoon. Both yourself and Steph are amazing. It was super emotional to see the delight and enjoyment D experienced with your ponies...",
        full: "Thank you very much for having D along this afternoon. Both yourself and Steph are amazing. It was super emotional to see the delight and enjoyment D experienced with your ponies. When I asked him how he felt it went he said it was absolutely amazing. Something I have never heard him say about anything before. He is very excited to come back. Thanks very much, I was holding back the tears as  Darragh has difficulty with his emotions at times and the smile on his face said it all x"
    }
];

let currentTestimonialIndex = 0;
let testimonialInterval;
let expanded = false;
let isPaused = false; // Track if slideshow is manually paused

// DOM elements
const nameEl = document.getElementById('testimonial-name');
const ratingEl = document.getElementById('testimonial-rating');
const previewEl = document.getElementById('testimonial-preview');
const fullEl = document.getElementById('testimonial-full');
const fullTextEl = fullEl ? fullEl.querySelector('p') : null;
const expandBtn = document.getElementById('testimonial-expand-btn');
const prevBtn = document.getElementById('testimonial-prev');
const nextBtn = document.getElementById('testimonial-next');
const indicatorsEl = document.getElementById('testimonial-indicators');

function renderTestimonial(index) {
    const t = testimonials[index];
    nameEl.textContent = t.name;
    ratingEl.textContent = t.rating;
    
    // Check if testimonial is under 250 characters
    const isShortTestimonial = t.full.length < 400;
    
    if (isShortTestimonial) {
        // For short testimonials, show the full text and hide button
        previewEl.textContent = t.full; // Show full text instead of preview
        fullTextEl.textContent = t.full;
        previewEl.style.display = 'block';
        fullEl.style.display = 'none';
        expandBtn.style.display = 'none';
        expanded = false; // Reset expanded state for short testimonials
    } else {
        // For longer testimonials, show normal expand/collapse behavior
        previewEl.textContent = t.preview;
        fullTextEl.textContent = t.full;
        previewEl.style.display = expanded ? 'none' : 'block';
        fullEl.style.display = expanded ? 'block' : 'none';
        expandBtn.style.display = 'block';
        expandBtn.textContent = expanded ? 'Read Less' : 'Read More';
        expandBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
    // Update indicators
    if (indicatorsEl) {
        indicatorsEl.innerHTML = '';
        for (let i = 0; i < testimonials.length; i++) {
            const span = document.createElement('span');
            span.className = 'indicator' + (i === index ? ' active' : '');
            span.onclick = () => { 
                resumeTestimonialSlideshow(); // Resume on indicator click
                goToTestimonial(i); 
            };
            indicatorsEl.appendChild(span);
        }
    }
}

function goToTestimonial(index) {
    currentTestimonialIndex = index;
    expanded = false;
    isPaused = false; // Reset pause state when manually navigating
    renderTestimonial(currentTestimonialIndex);
    // Resume auto-advance when navigating via buttons/indicators
    resetTestimonialAutoSlide();
}

function changeTestimonialSlide(direction) {
    let next = currentTestimonialIndex + direction;
    if (next < 0) next = testimonials.length - 1;
    if (next >= testimonials.length) next = 0;
    // Resume auto-advance when using navigation buttons
    goToTestimonial(next);
}

function startTestimonialAutoSlide() {
    clearInterval(testimonialInterval); // Clear any existing interval
    if (!isPaused && !expanded) { // Only start if not paused and not expanded
        testimonialInterval = setInterval(() => {
            if (!isPaused && !expanded) { // Double-check before advancing
                autoAdvanceTestimonial();
            }
        }, 10000); // Slowed down to 10 seconds
    }
}

function autoAdvanceTestimonial() {
    let next = currentTestimonialIndex + 1;
    if (next >= testimonials.length) next = 0;
    currentTestimonialIndex = next;
    expanded = false; // Ensure auto-advance shows preview
    renderTestimonial(currentTestimonialIndex);
}

function resetTestimonialAutoSlide() {
    clearInterval(testimonialInterval);
    startTestimonialAutoSlide();
}

function pauseTestimonialSlideshow() {
    isPaused = true;
    clearInterval(testimonialInterval);
}

function resumeTestimonialSlideshow() {
    isPaused = false;
    startTestimonialAutoSlide();
}

function toggleTestimonial() {
    const t = testimonials[currentTestimonialIndex];
    const isShortTestimonial = t.full.length < 250;
    
    // Only toggle if it's not a short testimonial
    if (!isShortTestimonial) {
        if (expanded) {
            // When collapsing, add animation class and smoothly transition
            fullEl.classList.add('collapsing');
            expandBtn.textContent = 'Read More';
            expandBtn.setAttribute('aria-expanded', 'false');
            
            setTimeout(() => {
                previewEl.style.display = 'block';
                fullEl.style.display = 'none';
                fullEl.classList.remove('collapsing');
                expanded = false;
            }, 400); // Match the animation duration
        } else {
            // When expanding
            expanded = true;
            previewEl.style.display = 'none';
            fullEl.style.display = 'block';
            expandBtn.style.display = 'block';
            expandBtn.textContent = 'Read Less';
            expandBtn.setAttribute('aria-expanded', 'true');
            // Pause slideshow when expanding to read full testimonial
            pauseTestimonialSlideshow();
        }
        // When collapsing, slideshow stays paused until manual navigation
    }
}

function initializeTestimonialSlideshow() {
    renderTestimonial(currentTestimonialIndex);
    startTestimonialAutoSlide();
    // Touch/swipe support
    const testimonialContainer = document.querySelector('.testimonials-slideshow');
    if (testimonialContainer) {
        let testimonialStartX = 0;
        let testimonialEndX = 0;
        testimonialContainer.addEventListener('touchstart', (e) => {
            testimonialStartX = e.touches[0].clientX;
        });
        testimonialContainer.addEventListener('touchend', (e) => {
            testimonialEndX = e.changedTouches[0].clientX;
            handleTestimonialSwipe();
        });
        function handleTestimonialSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = testimonialStartX - testimonialEndX;
            if (Math.abs(swipeDistance) > swipeThreshold) {
                resumeTestimonialSlideshow(); // Resume on swipe
                if (swipeDistance > 0) {
                    changeTestimonialSlide(1);
                } else {
                    changeTestimonialSlide(-1);
                }
            }
        }
        testimonialContainer.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });
        testimonialContainer.addEventListener('mouseleave', () => {
            // Only resume if not manually paused and not expanded
            if (!isPaused && !expanded) {
                startTestimonialAutoSlide();
            }
        });
    }
    // Button events
    if (expandBtn) expandBtn.onclick = toggleTestimonial;
    if (prevBtn) prevBtn.onclick = () => {
        resumeTestimonialSlideshow();
        changeTestimonialSlide(-1);
    };
    if (nextBtn) nextBtn.onclick = () => {
        resumeTestimonialSlideshow();
        changeTestimonialSlide(1);
    };
}

// Form submission handling
function handleFormSubmission() {
    const form = document.querySelector('.form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Use traditional form submission with hidden iframe to avoid CORS issues
            submitFormWithIframe(form, submitButton, originalButtonText);
        });
    }
}

// Submit form using hidden iframe to avoid CORS and page redirect
function submitFormWithIframe(form, submitButton, originalButtonText) {
    // Create a hidden iframe to submit the form without page redirect
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'form-submission-iframe';
    document.body.appendChild(iframe);
    
    // Set form target to the iframe
    const originalTarget = form.target;
    const originalAction = form.action;
    form.target = 'form-submission-iframe';
    
    // Create a clone of the form to avoid modifying the original
    const formClone = form.cloneNode(true);
    formClone.target = 'form-submission-iframe';
    formClone.style.display = 'none';
    document.body.appendChild(formClone);
    
    // Handle iframe load event
    iframe.onload = function() {
        // Show confirmation message
        showConfirmationMessage('Thank you for your message! We will get back to you soon.');
        
        // Reset the original form
        form.reset();
        
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        
        // Clean up
        document.body.removeChild(iframe);
        document.body.removeChild(formClone);
        form.target = originalTarget;
    };
    
    // Submit the cloned form
    formClone.submit();
}

function showConfirmationMessage(message, type = 'success') {
    // Remove any existing confirmation message
    const existingMessage = document.querySelector('.confirmation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create confirmation message element
    const confirmationDiv = document.createElement('div');
    confirmationDiv.className = `confirmation-message ${type}`;
    confirmationDiv.textContent = message;
    
    // Insert the message after the form
    const form = document.querySelector('.form');
    form.parentNode.insertBefore(confirmationDiv, form.nextSibling);
    
    // Auto-remove the message after 5 seconds
    setTimeout(() => {
        if (confirmationDiv.parentNode) {
            confirmationDiv.remove();
        }
    }, 5000);
}

// Mobile Navigation Functionality
function initializeMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile menu
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Get the target section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed nav
                const navHeight = document.querySelector('.mobile-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 10; // 10px extra padding
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Handle scroll to highlight active section
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = document.querySelector('.mobile-nav').offsetHeight;
        const scrollPos = window.scrollY + navHeight + 50; // 50px buffer
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const navLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            
            if (navLink) {
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    // Add active class to current link
                    navLink.classList.add('active');
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    startAutoSlide();
    initializeTestimonialSlideshow();
    handleFormSubmission();
    initializeMobileNav();
});