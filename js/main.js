document.addEventListener("DOMContentLoaded", () => {

    console.log("JAL SURAKSHA main.js loaded");


    /* =====================================================
       LIVE CLOCK
    ====================================================== */

    function updateClock() {

        const now = new Date();

        const time = now.toLocaleTimeString("en-IN", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });


        const liveTime =
            document.getElementById("liveTime");

        const riskTime =
            document.getElementById("riskTime");

        const telemetryTime =
            document.getElementById("telemetryTime");


        if (liveTime) {
            liveTime.textContent = time;
        }

        if (riskTime) {
            riskTime.textContent = time;
        }

        if (telemetryTime) {
            telemetryTime.textContent = time;
        }

    }


    updateClock();

    setInterval(updateClock, 1000);


    /* =====================================================
       TELEMETRY REFRESH ANIMATION
    ====================================================== */

    const telemetry =
        document.querySelector(".telemetry-bar");


    function refreshTelemetry() {

        if (!telemetry) return;

        telemetry.classList.remove("refreshing");

        // Restart animation
        void telemetry.offsetWidth;

        telemetry.classList.add("refreshing");

    }


    refreshTelemetry();

    setInterval(refreshTelemetry, 15000);


    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    const hiddenElements =
        document.querySelectorAll(".scroll-hidden");


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("revealed");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    hiddenElements.forEach((element) => {

        observer.observe(element);

    });


    /* =====================================================
       BUTTON RIPPLE
    ====================================================== */

    document.querySelectorAll("button").forEach((button) => {

        button.addEventListener("click", function (event) {

            const rect =
                button.getBoundingClientRect();


            const ripple =
                document.createElement("span");


            ripple.className =
                "button-ripple";


            ripple.style.left =
                `${event.clientX - rect.left}px`;


            ripple.style.top =
                `${event.clientY - rect.top}px`;


            button.appendChild(ripple);


            setTimeout(() => {

                ripple.remove();

            }, 600);

        });

    });


    /* =====================================================
       NAVIGATION
    ====================================================== */

    const platformBtn =
        document.getElementById("platformBtn");


    const checkRiskBtn =
        document.getElementById("checkRiskBtn");


    const finalRiskBtn =
        document.getElementById("finalRiskBtn");


    const citizenPortalBtn =
        document.getElementById("citizenPortalBtn");


    const officerPortalBtn =
        document.getElementById("officerPortalBtn");


    const exploreBtn =
        document.getElementById("exploreBtn");


    /* Citizen */

    function openCitizenPortal() {

        window.location.href = "/citizen";

    }


    /* Officer */

    function openOfficerPortal() {

        window.location.href = "/officer";

    }


    if (checkRiskBtn) {

        checkRiskBtn.addEventListener(
            "click",
            openCitizenPortal
        );

    }


    if (finalRiskBtn) {

        finalRiskBtn.addEventListener(
            "click",
            openCitizenPortal
        );

    }


    if (citizenPortalBtn) {

        citizenPortalBtn.addEventListener(
            "click",
            openCitizenPortal
        );

    }


    if (officerPortalBtn) {

        officerPortalBtn.addEventListener(
            "click",
            openOfficerPortal
        );

    }


    if (platformBtn) {

        platformBtn.addEventListener(
            "click",
            () => {

                window.location.href = "/citizen";

            }
        );

    }


    /* =====================================================
       EXPLORE BUTTON
    ====================================================== */

    if (exploreBtn) {

        exploreBtn.addEventListener(
            "click",
            () => {

                document
                    .getElementById("problem")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }


    /* =====================================================
       NAV ACTIVE STATE
    ====================================================== */

    const navLinks =
        document.querySelectorAll(".nav-links a");


    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.forEach((item) => {

                item.classList.remove("active");

            });

            link.classList.add("active");

        });

    });


    /* =====================================================
       MAP RISK ZONE MICRO ANIMATION
    ====================================================== */

    const critical =
        document.querySelector(".critical-zone");


    if (critical) {

        setInterval(() => {

            critical.style.transform =
                "scale(1.035)";

            setTimeout(() => {

                critical.style.transform =
                    "scale(1)";

            }, 500);

        }, 2500);

    }


    /* =====================================================
       CONSOLE STATUS
    ====================================================== */

    console.log(
        "%cJAL SURAKSHA",
        "color:#22d3ee;font-size:20px;font-weight:bold;"
    );

    console.log(
        "%cHyperlocal Climate Intelligence System ONLINE",
        "color:#34d399;font-size:12px;"
    );

});