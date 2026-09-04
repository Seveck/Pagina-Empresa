/**
 * TechSolutions - Modern Interactive Features & UI Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // -------------------------------------------------------------
    // 2. Navigation & Mobile Menu
    // -------------------------------------------------------------
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('backToTop');

    // Header scroll effect & Back to top visibility
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Sticky header class
        if (scrollPos > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollPos > 450) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active link scroll spy
        highlightActiveNavLink();
    });

    // Back to top click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Hamburger toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Highlight nav link based on scroll position
    function highlightActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // -------------------------------------------------------------
    // 3. Hero Mockup Tab Switcher
    // -------------------------------------------------------------
    const mockupTabs = document.querySelectorAll('.mockup-tab');
    const mockupContents = document.querySelectorAll('.mockup-tab-content');

    mockupTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Remove active from all tabs & contents
            mockupTabs.forEach(t => t.classList.remove('active'));
            mockupContents.forEach(c => c.classList.remove('active'));

            // Activate clicked tab & matching content
            tab.classList.add('active');
            const activeContent = document.getElementById(`tab-${targetTab}`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // -------------------------------------------------------------
    // 4. Animated Stats Counters
    // -------------------------------------------------------------
    const statCards = document.querySelectorAll('.stat-card');
    let statsAnimated = false;

    function animateCounters() {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(el => {
            const target = parseFloat(el.getAttribute('data-target'));
            if (isNaN(target)) return;

            const isPercentage = el.innerText.includes('%');
            const isPlus = el.innerText.includes('+');
            const isDays = el.innerText.toLowerCase().includes('días');
            
            let current = 0;
            const step = target / 40;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }

                let formatted = current % 1 === 0 ? current.toFixed(0) : current.toFixed(1);
                if (isPlus) formatted = `+${formatted}`;
                if (isPercentage) formatted = `${formatted}%`;
                if (isDays) formatted = `${formatted} Días`;

                el.innerText = formatted;
            }, 30);
        });
    }

    if (statCards.length > 0 && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.3 });

        statCards.forEach(card => statsObserver.observe(card));
    }

    // -------------------------------------------------------------
    // 5. Interactive Cost & Project Estimator
    // -------------------------------------------------------------
    const projectTypeCards = document.querySelectorAll('#projectTypeGrid .option-card');
    const featureCheckboxes = document.querySelectorAll('#featuresGrid input[type="checkbox"]');
    const estimatedSummaryTitle = document.getElementById('estimatedSummaryTitle');
    const estimatedFeaturesList = document.getElementById('estimatedFeaturesList');
    const estimatedDeliveryDays = document.getElementById('estimatedDeliveryDays');
    const btnApplyEstimation = document.getElementById('btnApplyEstimation');

    let currentSelectedType = {
        name: "Sitio Web Profesional / Corporativo",
        days: 15,
        serviceKey: "desarrollo-web"
    };

    function updateEstimator() {
        let totalDays = currentSelectedType.days;
        let selectedFeatures = [];

        featureCheckboxes.forEach(cb => {
            if (cb.checked) {
                const addDays = parseInt(cb.getAttribute('data-add-days') || '0', 10);
                totalDays += addDays;
                selectedFeatures.push(cb.value);
            }
        });

        // Update UI
        if (estimatedSummaryTitle) {
            estimatedSummaryTitle.innerText = currentSelectedType.name;
        }

        if (estimatedFeaturesList) {
            if (selectedFeatures.length > 0) {
                estimatedFeaturesList.innerText = `Incluye: ${selectedFeatures.join(', ')}.`;
            } else {
                estimatedFeaturesList.innerText = 'Funcionalidades esenciales base para su puesta en marcha.';
            }
        }

        if (estimatedDeliveryDays) {
            estimatedDeliveryDays.innerText = `${totalDays} días hábiles`;
        }
    }

    projectTypeCards.forEach(card => {
        card.addEventListener('click', () => {
            projectTypeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const typeName = card.getAttribute('data-base');
            const typeDays = parseInt(card.getAttribute('data-days') || '15', 10);
            const typeKey = card.getAttribute('data-type');

            let serviceDropdownKey = "desarrollo-web";
            if (typeKey === 'mobile') serviceDropdownKey = 'app-movil';
            if (typeKey === 'erp') serviceDropdownKey = 'sistema-erp';
            if (typeKey === 'ecommerce') serviceDropdownKey = 'desarrollo-web';

            currentSelectedType = {
                name: typeName,
                days: typeDays,
                serviceKey: serviceDropdownKey
            };

            updateEstimator();
        });
    });

    featureCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateEstimator);
    });

    // Apply Estimation CTA -> Scroll to Contact & Pre-fill
    if (btnApplyEstimation) {
        btnApplyEstimation.addEventListener('click', () => {
            const contactSection = document.getElementById('contacto');
            const serviceSelect = document.getElementById('serviceType');
            const messageArea = document.getElementById('clientMessage');

            // Set dropdown value
            if (serviceSelect && currentSelectedType.serviceKey) {
                serviceSelect.value = currentSelectedType.serviceKey;
            }

            // Pre-fill message
            let selectedFeatures = [];
            featureCheckboxes.forEach(cb => {
                if (cb.checked) selectedFeatures.push(cb.value);
            });

            const daysText = estimatedDeliveryDays ? estimatedDeliveryDays.innerText : '25 días hábiles';
            const featureText = selectedFeatures.length > 0 ? selectedFeatures.join('; ') : 'Módulos base';

            if (messageArea) {
                messageArea.value = `Hola TechSolutions, coticé en su simulador interactivo un proyecto de "${currentSelectedType.name}". \n\nFuncionalidades requeridas:\n• ${featureText}\n\nTiempo estimado requerido: ${daysText}.\n\nMe gustaría recibir más detalles sobre la asesoría y el presupuesto formal.`;
            }

            // Smooth scroll
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                // Focus message
                setTimeout(() => {
                    if (messageArea) messageArea.focus();
                }, 800);
            }
        });
    }

    // -------------------------------------------------------------
    // 6. Portfolio Filter Tabs
    // -------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 7. Portfolio Interactive Modal
    // -------------------------------------------------------------
    const projectModal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const viewProjectBtns = document.querySelectorAll('.btn-view-project, .portfolio-card .portfolio-overlay');

    const projectData = {
        rodizio: {
            title: "Restaurante Rodizio Cúcuta",
            subtitle: "Plataforma Web Premium, Sistema de Reservas & Pedidos en Mesa",
            client: "Restaurante Rodizio",
            location: "Cúcuta, Colombia",
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
            challenge: "El restaurante enfrentaba congestión en horas pico debido a llamadas telefónicas manuales para reservas y lentitud en la atención al ordenar, generando esperas y pérdida de comensales.",
            solution: "Desarrollamos una plataforma web de alto rendimiento optimizada para móviles, con un sistema de reserva de mesas con confirmación automática por WhatsApp y una carta digital interactiva con pedidos directos a cocina.",
            results: [
                "+65% de incremento en reservas confirmadas desde canales digitales",
                "-40% de reducción en tiempos de espera de los comensales",
                "99.9% de satisfacción en comensales que utilizaron la carta digital",
                "Integración completa con el sistema contable y de facturación"
            ],
            tech: ["React.js", "Node.js", "PostgreSQL", "Tailwind CSS", "WhatsApp Cloud API"]
        },
        logistock: {
            title: "LogiStock Pro ERP",
            subtitle: "Sistema en la Nube de Gestión de Inventarios y Despacho Multi-Bodega",
            client: "LogiTrans Express",
            location: "Norte de Santander, Colombia",
            image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
            challenge: "La empresa gestionaba más de 10,000 referencias en planillas manuales de Excel, lo que provocaba desajustes en el stock físico, demoras en el despacho y pérdidas operativas.",
            solution: "Creamos un software ERP a medida en la nube, con soporte para lectores de códigos de barras, alertas automáticas de reabastecimiento y roles jerárquicos de usuario para bodegueros y gerencia.",
            results: [
                "Control en tiempo real de más de 10,000 SKUs sin discrepancias",
                "Reducción del 70% en el tiempo necesario para realizar auditorías de inventario",
                "Cero pérdidas por productos extraviados tras 6 meses en producción",
                "Reportes ejecutivos automáticos enviados diariamente por correo"
            ],
            tech: ["Vue.js 3", "Python FastAPI", "MySQL", "Docker", "AWS S3"]
        },
        medikapp: {
            title: "MedikApp Salud",
            subtitle: "Aplicación Móvil para Agendamiento Médico e Historial Digital",
            client: "MedikApp Salud IPS",
            location: "Colombia",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
            challenge: "Alto índice de inasistencia a citas médicas (ausentismo del 28%) y procesos lentos para que los pacientes obtuvieran sus fórmulas y resultados de laboratorio.",
            solution: "Desarrollamos una aplicación móvil para iOS y Android que permite agendar consultas en 3 pasos, descargar órdenes en PDF y recibir recordatorios automatizados 24 horas antes.",
            results: [
                "Más de 18,000 citas médicas gestionadas exitosamente",
                "Reducción del ausentismo médico del 28% al 6%",
                "Calificación promedio de 4.9 estrellas en las tiendas de apps",
                "Cumplimiento riguroso de normativas de protección de datos de salud"
            ],
            tech: ["Flutter", "Firebase Auth & Firestore", "Node.js", "WhatsApp API", "Cloud Functions"]
        },
        payflow: {
            title: "PayFlow Connect",
            subtitle: "Módulo Automatizado de Cobros Recurrentes y Conciliación Bancaria",
            client: "Empresas Aliadas SaaS",
            location: "Regional",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
            challenge: "Las empresas de suscripción invertían más de 15 horas semanales cotejando transferencias bancarias manuales con recibos de pago de clientes.",
            solution: "Implementamos un microservicio seguro que se conecta directamente con pasarelas de pago y webhooks bancarios para actualizar el estado del servicio en 1 segundo.",
            results: [
                "100% de automatización en conciliación de transferencias y pagos con tarjeta",
                "Ahorro de más de 15 horas de trabajo operativo semanal por empresa",
                "Cero errores de habilitación o corte de servicio para usuarios finales",
                "Cifrado y estándares de seguridad acordes a normativas financieras"
            ],
            tech: ["Node.js", "Stripe API", "Wompi", "PostgreSQL", "Redis"]
        }
    };

    function openProjectModal(projectId) {
        const data = projectData[projectId];
        if (!data || !modalContent) return;

        modalContent.innerHTML = `
            <div class="modal-project-header">
                <div class="modal-meta">
                    <span class="category-pill">${data.subtitle}</span>
                    <span class="location-pill"><i data-lucide="map-pin"></i> ${data.location}</span>
                </div>
                <h2 style="font-size: 1.85rem; margin-bottom: 0.5rem; color: #0f172a;">${data.title}</h2>
                <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1.2rem;"><strong>Cliente:</strong> ${data.client}</p>
            </div>

            <div style="border-radius: 12px; overflow: hidden; height: 260px; margin-bottom: 1.8rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.8rem;">
                <div style="background: #f8fafc; padding: 1.2rem; border-radius: 10px; border: 1px solid #e2e8f0;">
                    <strong style="color: #0f172a; display: block; margin-bottom: 0.5rem; font-size: 1rem;">🎯 El Desafío</strong>
                    <p style="font-size: 0.9rem; color: #475569; line-height: 1.55;">${data.challenge}</p>
                </div>
                <div style="background: #f8fafc; padding: 1.2rem; border-radius: 10px; border: 1px solid #e2e8f0;">
                    <strong style="color: #0f172a; display: block; margin-bottom: 0.5rem; font-size: 1rem;">💡 Nuestra Solución</strong>
                    <p style="font-size: 0.9rem; color: #475569; line-height: 1.55;">${data.solution}</p>
                </div>
            </div>

            <div style="margin-bottom: 1.8rem;">
                <strong style="color: #0f172a; display: block; margin-bottom: 0.8rem; font-size: 1.05rem;">📈 Resultados Obtenidos:</strong>
                <ul style="display: flex; flex-direction: column; gap: 0.6rem;">
                    ${data.results.map(r => `
                        <li style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.92rem; color: #1e293b;">
                            <i data-lucide="check-circle-2" class="text-emerald" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
                            <span>${r}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                ${data.tech.map(t => `<span style="background: #eff6ff; color: #2563eb; font-weight: 600; font-size: 0.8rem; padding: 0.3rem 0.8rem; border-radius: 6px;">${t}</span>`).join('')}
            </div>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <a href="#contacto" id="btnModalQuote" class="btn btn-primary btn-lg" style="flex: 1;">
                    <span>Quiero un Proyecto Similar</span>
                    <i data-lucide="arrow-right"></i>
                </a>
            </div>
        `;

        if (window.lucide) {
            lucide.createIcons();
        }

        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Modal quote button listener
        const btnModalQuote = document.getElementById('btnModalQuote');
        if (btnModalQuote) {
            btnModalQuote.addEventListener('click', () => {
                closeProjectModal();
                const messageArea = document.getElementById('clientMessage');
                if (messageArea) {
                    messageArea.value = `Hola TechSolutions, vi el caso de éxito de "${data.title}" y me interesa desarrollar una solución similar para mi empresa.`;
                }
            });
        }
    }

    function closeProjectModal() {
        if (projectModal) {
            projectModal.classList.remove('active');
            projectModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const parentCard = btn.closest('.portfolio-card');
            const projectId = btn.getAttribute('data-modal') || (parentCard ? parentCard.getAttribute('data-modal') : null);
            if (projectId) {
                openProjectModal(projectId);
            }
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });

    // -------------------------------------------------------------
    // 8. Interactive FAQ Accordion
    // -------------------------------------------------------------
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentItem = question.closest('.faq-item');
            const isCurrentlyActive = currentItem.classList.contains('active');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const btn = item.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            // If it wasn't active, open it
            if (!isCurrentlyActive) {
                currentItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // -------------------------------------------------------------
    // 9. Contact Form Validation & Feedback Toast
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const toastNotification = document.getElementById('toastNotification');

    function showToast(title, message) {
        if (!toastNotification) return;

        const titleEl = document.getElementById('toastTitle');
        const msgEl = document.getElementById('toastMsg');

        if (titleEl) titleEl.innerText = title;
        if (msgEl) msgEl.innerText = message;

        toastNotification.classList.add('show');

        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 5000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('clientName');
            const phoneInput = document.getElementById('clientPhone');
            const emailInput = document.getElementById('clientEmail');
            const messageInput = document.getElementById('clientMessage');
            const btnSubmit = document.getElementById('btnSubmitForm');

            let isValid = true;

            // Simple validation helper
            function checkField(input, condition) {
                const group = input.closest('.form-group');
                if (!condition) {
                    if (group) group.classList.add('has-error');
                    isValid = false;
                } else {
                    if (group) group.classList.remove('has-error');
                }
            }

            checkField(nameInput, nameInput.value.trim().length >= 2);
            checkField(phoneInput, phoneInput.value.trim().length >= 7);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            checkField(emailInput, emailRegex.test(emailInput.value.trim()));
            checkField(messageInput, messageInput.value.trim().length >= 5);

            if (isValid) {
                const originalText = btnSubmit.innerHTML;
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = `<span>Enviando propuesta segura...</span>`;

                // Simulate high-speed submission
                setTimeout(() => {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = originalText;
                    contactForm.reset();

                    showToast(
                        "¡Solicitud Recibida con Éxito!",
                        "Hemos recibido tu proyecto. Te contactaremos hoy mismo por WhatsApp y correo."
                    );
                }, 1200);
            }
        });
    }

    // -------------------------------------------------------------
    // 10. Initial Update for Estimator
    // -------------------------------------------------------------
    updateEstimator();
});