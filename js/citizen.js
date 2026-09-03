// =========================================================
// JAL SURAKSHA - CITIZEN PORTAL
// COMPLETE CITIZEN.JS
// =========================================================

console.log("🔥 JAL SURAKSHA CITIZEN JS IS WORKING");


// =========================================================
// GLOBAL VARIABLES
// =========================================================

let userLatitude = null;
let userLongitude = null;

let statusPolling = false;
let riskPolling = false;


// =========================================================
// DOM READY
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("JAL SURAKSHA Citizen Portal loaded");

    initializeClock();

    initializeReportHazard();

    initializeLocationButton();

    initializeEmergencyButtons();

    loadSavedReport();

    startStatusPolling();

    startCitizenRiskMonitoring();

});


// =========================================================
// CLOCK
// =========================================================

function initializeClock() {

    updateCitizenClock();

    setInterval(
        updateCitizenClock,
        1000
    );

}


function updateCitizenClock() {

    const now = new Date();

    const time = now.toLocaleTimeString(
        "en-IN",
        {
            hour12: false
        }
    );

    const clock =
        document.getElementById("citizen-clock");

    if (clock) {

        clock.textContent = time;

    }

    const alertClock =
        document.getElementById("alert-clock");

    if (alertClock) {

        alertClock.textContent =
            now.toLocaleTimeString(
                "en-IN",
                {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }

}


// =========================================================
// REPORT HAZARD
// =========================================================

function initializeReportHazard() {

    const reportButtons =
        document.querySelectorAll(
            "#reportHazardBtn, .report-hazard-btn, [data-action='report-hazard']"
        );

    reportButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                console.log(
                    "Opening Hazard Report..."
                );

                openHazardReport();

            }
        );

    });

}


// =========================================================
// OPEN HAZARD REPORT
// =========================================================

function openHazardReport() {

    const existingModal =
        document.getElementById(
            "hazardReportModal"
        );

    if (existingModal) {

        existingModal.classList.add(
            "show"
        );

        return;

    }

    createHazardReport();

}


// =========================================================
// CREATE HAZARD REPORT MODAL
// =========================================================

function createHazardReport() {

    const modal =
        document.createElement("div");

    modal.id =
        "hazardReportModal";

    modal.innerHTML = `

        <div class="hazard-modal-backdrop">

            <div class="hazard-modal">

                <div class="hazard-modal-header">

                    <div>

                        <span class="hazard-label">
                            FIELD INCIDENT REPORT
                        </span>

                        <h2>
                            Report a Hazard
                        </h2>

                        <p>
                            Send a hyperlocal hazard report
                            to the emergency response team.
                        </p>

                    </div>

                    <button
                        type="button"
                        class="hazard-close"
                        id="closeHazardReport">

                        ×

                    </button>

                </div>


                <form id="hazardReportForm">


                    <!-- HAZARD TYPE -->

                    <div class="form-group">

                        <label>
                            HAZARD TYPE
                        </label>

                        <select
                            id="hazardType"
                            required>

                            <option value="">
                                Select hazard
                            </option>

                            <option value="flood">
                                Flooding
                            </option>

                            <option value="waterlogging">
                                Waterlogging
                            </option>

                            <option value="blocked_road">
                                Blocked Road
                            </option>

                            <option value="heavy_rain">
                                Heavy Rain
                            </option>

                            <option value="drain_overflow">
                                Drain Overflow
                            </option>

                            <option value="landslide">
                                Landslide
                            </option>

                            <option value="other">
                                Other
                            </option>

                        </select>

                    </div>


                    <!-- SEVERITY -->

                    <div class="form-group">

                        <label>
                            SEVERITY
                        </label>

                        <select
                            id="hazardSeverity"
                            required>

                            <option value="">
                                Select severity
                            </option>

                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
                            </option>

                            <option value="critical">
                                Critical
                            </option>

                        </select>

                    </div>


                    <!-- LOCATION -->

                    <div class="form-group">

                        <label>
                            LOCATION
                        </label>

                        <input
                            type="text"
                            id="hazardLocation"
                            placeholder="Enter street / landmark"
                            required>

                    </div>


                    <!-- DESCRIPTION -->

                    <div class="form-group">

                        <label>
                            DESCRIPTION
                        </label>

                        <textarea
                            id="hazardDescription"
                            rows="4"
                            placeholder="Describe what you are seeing..."
                            required></textarea>

                    </div>


                    <!-- GPS -->

                    <div class="gps-box">

                        <div>

                            <strong>
                                LOCATION STATUS
                            </strong>

                            <span id="gpsStatus">
                                Location not captured
                            </span>

                        </div>

                        <button
                            type="button"
                            id="getLocationBtn">

                            USE MY LOCATION

                        </button>

                    </div>


                    <!-- SUBMIT -->

                    <button
                        type="submit"
                        class="hazard-submit">

                        SUBMIT HAZARD REPORT

                        <span>
                            →
                        </span>

                    </button>


                    <div
                        id="hazardMessage"
                        class="hazard-message">
                    </div>


                </form>

            </div>

        </div>

    `;

    document.body.appendChild(modal);

    requestAnimationFrame(function () {

        modal.classList.add("show");

    });


    // =====================================================
    // CLOSE
    // =====================================================

    const closeButton =
        document.getElementById(
            "closeHazardReport"
        );

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeHazardReport
        );

    }


    // =====================================================
    // GPS
    // =====================================================

    const locationButton =
        document.getElementById(
            "getLocationBtn"
        );

    if (locationButton) {

        locationButton.addEventListener(
            "click",
            getUserLocation
        );

    }


    // =====================================================
    // SUBMIT
    // =====================================================

    const form =
        document.getElementById(
            "hazardReportForm"
        );

    if (form) {

        form.addEventListener(
            "submit",
            submitHazardReport
        );

    }

}


// =========================================================
// CLOSE HAZARD REPORT
// =========================================================

function closeHazardReport() {

    const modal =
        document.getElementById(
            "hazardReportModal"
        );

    if (modal) {

        modal.remove();

    }

}


// =========================================================
// GPS
// =========================================================

function getUserLocation() {

    const status =
        document.getElementById(
            "gpsStatus"
        );

    if (!status) {

        return;

    }

    if (!navigator.geolocation) {

        status.textContent =
            "GPS unavailable";

        return;

    }

    status.textContent =
        "Locating...";


    navigator.geolocation.getCurrentPosition(

        function (position) {

            userLatitude =
                position.coords.latitude;

            userLongitude =
                position.coords.longitude;


            status.textContent =
                `${userLatitude.toFixed(5)}, ${userLongitude.toFixed(5)}`;


            console.log(
                "GPS:",
                userLatitude,
                userLongitude
            );

        },


        function (error) {

            console.error(
                "GPS error:",
                error
            );

            status.textContent =
                "Unable to access location";

        },


        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}


// =========================================================
// SUBMIT HAZARD REPORT
// =========================================================

async function submitHazardReport(event) {

    event.preventDefault();


    const typeElement =
        document.getElementById(
            "hazardType"
        );

    const severityElement =
        document.getElementById(
            "hazardSeverity"
        );

    const locationElement =
        document.getElementById(
            "hazardLocation"
        );

    const descriptionElement =
        document.getElementById(
            "hazardDescription"
        );

    const message =
        document.getElementById(
            "hazardMessage"
        );


    if (
        !typeElement ||
        !severityElement ||
        !locationElement ||
        !descriptionElement ||
        !message
    ) {

        return;

    }


    const type =
        typeElement.value;

    const severity =
        severityElement.value;

    const location =
        locationElement.value.trim();

    const description =
        descriptionElement.value.trim();


    message.textContent =
        "Submitting report...";

    message.className =
        "hazard-message";


    const report = {

        incident_type:
            type,

        severity:
            severity,

        location:
            location,

        description:
            description,

        latitude:
            userLatitude,

        longitude:
            userLongitude,

        timestamp:
            new Date().toISOString()

    };


    console.log(
        "Hazard Report:",
        report
    );


    try {

        const response =
            await fetch(
                "/api/citizen-report",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            report
                        )

                }
            );


        const data =
            await response.json();


        console.log(
            "Server response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Report submission failed."
            );

        }


        // =================================================
        // SAVE REPORT ID
        // =================================================

        if (
            data.report &&
            data.report.id !== undefined
        ) {

            localStorage.setItem(
                "jal_suraksha_report_id",
                String(
                    data.report.id
                )
            );

        }


        // =================================================
        // UPDATE STATUS
        // =================================================

        if (data.report) {

            updateCitizenStatusUI(
                data.report
            );

        }


        // =================================================
        // SUCCESS
        // =================================================

        message.textContent =
            "✓ Hazard report submitted successfully.";

        message.className =
            "hazard-message success";


        // =================================================
        // RESET FORM
        // =================================================

        const form =
            document.getElementById(
                "hazardReportForm"
            );

        if (form) {

            form.reset();

        }


        userLatitude = null;

        userLongitude = null;


        const gpsStatus =
            document.getElementById(
                "gpsStatus"
            );

        if (gpsStatus) {

            gpsStatus.textContent =
                "Location not captured";

        }


        // =================================================
        // REFRESH RISK IMMEDIATELY
        // =================================================

        updateCitizenAreaRisk();


        // =================================================
        // CLOSE MODAL
        // =================================================

        setTimeout(
            closeHazardReport,
            1800
        );

    }


    catch (error) {

        console.error(
            "Hazard report error:",
            error
        );


        message.textContent =
            error.message ||
            "Unable to submit report. Please try again.";

        message.className =
            "hazard-message error";

    }

}


// =========================================================
// LOAD SAVED REPORT
// =========================================================

function loadSavedReport() {

    const savedId =
        localStorage.getItem(
            "jal_suraksha_report_id"
        );


    if (!savedId) {

        console.log(
            "No citizen report saved yet."
        );

        return;

    }


    console.log(
        "Loading saved citizen report:",
        savedId
    );


    fetchIncidentById(
        savedId
    );

}


// =========================================================
// FETCH INCIDENT BY ID
// =========================================================

async function fetchIncidentById(
    reportId
) {

    try {

        const response =
            await fetch(
                "/api/incidents"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load incidents."
            );

        }


        const data =
            await response.json();


        const incidents =
            Array.isArray(
                data.incidents
            )
                ? data.incidents
                : [];


        const report =
            incidents.find(
                function (incident) {

                    return String(
                        incident.id
                    ) === String(
                        reportId
                    );

                }
            );


        if (!report) {

            console.log(
                "Saved report not found:",
                reportId
            );

            return;

        }


        updateCitizenStatusUI(
            report
        );

    }


    catch (error) {

        console.error(
            "Unable to fetch citizen report:",
            error
        );

    }

}


// =========================================================
// STATUS POLLING
// =========================================================

function startStatusPolling() {

    if (statusPolling) {

        return;

    }


    statusPolling = true;


    updateCitizenReport();


    setInterval(
        updateCitizenReport,
        3000
    );

}


// =========================================================
// UPDATE CITIZEN REPORT
// =========================================================

async function updateCitizenReport() {

    const reportId =
        localStorage.getItem(
            "jal_suraksha_report_id"
        );


    if (!reportId) {

        return;

    }


    try {

        const response =
            await fetch(
                "/api/incidents"
            );


        if (!response.ok) {

            return;

        }


        const data =
            await response.json();


        const incidents =
            Array.isArray(
                data.incidents
            )
                ? data.incidents
                : [];


        const report =
            incidents.find(
                function (incident) {

                    return String(
                        incident.id
                    ) === String(
                        reportId
                    );

                }
            );


        if (!report) {

            return;

        }


        updateCitizenStatusUI(
            report
        );

    }


    catch (error) {

        console.error(
            "Citizen status polling error:",
            error
        );

    }

}


// =========================================================
// UPDATE CITIZEN STATUS UI
// =========================================================

function updateCitizenStatusUI(
    report
) {

    if (!report) {

        return;

    }


    console.log(
        "Updating citizen status:",
        report
    );


    // =====================================================
    // REPORT ID
    // =====================================================

    const reportId =
        document.getElementById(
            "citizen-report-id"
        );

    if (reportId) {

        reportId.textContent =
            `#${report.id}`;

    }


    // =====================================================
    // LOCATION
    // =====================================================

    const location =
        document.getElementById(
            "citizen-report-location"
        );

    if (location) {

        location.textContent =
            report.location ||
            "Location unavailable";

    }


    // =====================================================
    // STATUS
    // =====================================================

    const status =
        String(
            report.status ||
            "NEW"
        ).toUpperCase();


    const statusBadge =
        document.getElementById(
            "citizen-report-status"
        );


    if (statusBadge) {

        statusBadge.textContent =
            getCitizenStatusLabel(
                status
            );


        statusBadge.className =
            "report-status-badge " +
            getStatusClass(
                status
            );

    }


    updateTimeline(
        status
    );


    // =====================================================
    // MESSAGE
    // =====================================================

    const message =
        document.getElementById(
            "citizen-status-message"
        );


    if (message) {

        message.textContent =
            getStatusMessage(
                status
            );

    }


    // =====================================================
    // SHOW SECTION
    // =====================================================

    const section =
        document.getElementById(
            "reportStatusSection"
        );


    if (section) {

        section.style.display =
            "block";

    }

}


// =========================================================
// STATUS LABEL
// =========================================================

function getCitizenStatusLabel(
    status
) {

    switch (status) {

        case "NEW":
            return "SUBMITTED";

        case "ACKNOWLEDGED":
            return "ACKNOWLEDGED";

        case "DISPATCHED":
            return "DISPATCHED";

        case "IN PROGRESS":
            return "IN PROGRESS";

        case "RESOLVED":
            return "RESOLVED";

        default:
            return "WAITING";

    }

}


// =========================================================
// STATUS CLASS
// =========================================================

function getStatusClass(
    status
) {

    switch (status) {

        case "NEW":
            return "waiting";

        case "ACKNOWLEDGED":
            return "acknowledged";

        case "DISPATCHED":
            return "dispatched";

        case "IN PROGRESS":
            return "in-progress";

        case "RESOLVED":
            return "resolved";

        default:
            return "waiting";

    }

}


// =========================================================
// STATUS TIMELINE
// =========================================================

function updateTimeline(
    currentStatus
) {

    const steps = [

        {
            id: "status-submitted",
            status: "NEW"
        },

        {
            id: "status-acknowledged",
            status: "ACKNOWLEDGED"
        },

        {
            id: "status-dispatched",
            status: "DISPATCHED"
        },

        {
            id: "status-in-progress",
            status: "IN PROGRESS"
        },

        {
            id: "status-resolved",
            status: "RESOLVED"
        }

    ];


    const currentIndex =
        getStatusIndex(
            currentStatus
        );


    steps.forEach(
        function (
            step,
            index
        ) {

            const element =
                document.getElementById(
                    step.id
                );


            if (!element) {

                return;

            }


            element.classList.remove(
                "completed",
                "active",
                "current"
            );


            const circle =
                element.querySelector(
                    ".status-circle"
                );


            if (
                index < currentIndex
            ) {

                element.classList.add(
                    "completed"
                );


                if (circle) {

                    circle.textContent =
                        "✓";

                }

            }


            else if (
                index === currentIndex
            ) {

                element.classList.add(
                    "completed",
                    "active",
                    "current"
                );


                if (circle) {

                    circle.textContent =
                        "✓";

                }

            }


            else {

                if (circle) {

                    circle.textContent =
                        String(
                            index + 1
                        );

                }

            }

        }
    );

}


// =========================================================
// STATUS INDEX
// =========================================================

function getStatusIndex(
    status
) {

    switch (status) {

        case "NEW":
            return 0;

        case "ACKNOWLEDGED":
            return 1;

        case "DISPATCHED":
            return 2;

        case "IN PROGRESS":
            return 3;

        case "RESOLVED":
            return 4;

        default:
            return 0;

    }

}


// =========================================================
// STATUS MESSAGE
// =========================================================

function getStatusMessage(
    status
) {

    switch (status) {

        case "NEW":

            return "Your report has been submitted and is waiting for officer acknowledgement.";

        case "ACKNOWLEDGED":

            return "An officer has received and acknowledged your report.";

        case "DISPATCHED":

            return "A response team has been dispatched to your location.";

        case "IN PROGRESS":

            return "The response team is currently working on your reported incident.";

        case "RESOLVED":

            return "Your reported incident has been resolved. Thank you for helping keep the community safe.";

        default:

            return "Your report status will appear here.";

    }

}


// =========================================================
// LOCATION BUTTON
// =========================================================

function initializeLocationButton() {

    const button =
        document.querySelector(
            ".location-btn"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            if (!navigator.geolocation) {

                alert(
                    "Location services are not available on this device."
                );

                return;

            }


            button.textContent =
                "⌖ LOCATING...";


            navigator.geolocation.getCurrentPosition(

                function (position) {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;


                    userLatitude =
                        latitude;

                    userLongitude =
                        longitude;


                    console.log(
                        "Citizen location:",
                        latitude,
                        longitude
                    );


                    button.textContent =
                        "✓ LOCATION UPDATED";


                    setTimeout(
                        function () {

                            button.textContent =
                                "⌖ UPDATE LOCATION";

                        },
                        2000
                    );

                },


                function () {

                    button.textContent =
                        "⌖ UPDATE LOCATION";


                    alert(
                        "Unable to access your location."
                    );

                }

            );

        }
    );

}


// =========================================================
// EMERGENCY BUTTONS
// =========================================================

function initializeEmergencyButtons() {


    // =====================================================
    // SOS
    // =====================================================

    const sosButton =
        document.querySelector(
            ".emergency-button.sos"
        );


    if (sosButton) {

        sosButton.addEventListener(
            "click",
            async function () {

                const confirmed =
                    confirm(
                        "🚨 EMERGENCY SOS\n\n" +
                        "Are you sure you want to request immediate assistance?\n\n" +
                        "Your current location will be shared with the response team."
                    );


                if (!confirmed) {

                    return;

                }


                sosButton.disabled =
                    true;

                sosButton.style.opacity =
                    "0.6";


                function sendSOS(
                    latitude,
                    longitude
                ) {

                    fetch(
                        "/api/sos",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    latitude:
                                        latitude,

                                    longitude:
                                        longitude,

                                    location:
                                        "Citizen GPS Location"

                                })

                        }
                    )

                    .then(
                        response =>
                            response.json()
                    )

                    .then(
                        data => {

                            console.log(
                                "SOS response:",
                                data
                            );


                            if (
                                !data.success
                            ) {

                                throw new Error(
                                    data.message ||
                                    "SOS failed"
                                );

                            }


                            if (
                                data.report &&
                                data.report.id !== undefined
                            ) {

                                localStorage.setItem(
                                    "jal_suraksha_report_id",
                                    String(
                                        data.report.id
                                    )
                                );

                            }


                            alert(
                                "🚨 SOS REQUEST SENT\n\n" +
                                "Emergency response has been notified."
                            );


                            // =================================================
                            // IMMEDIATELY UPDATE RISK
                            // =================================================

                            updateCitizenAreaRisk();


                            updateCitizenReport();


                            sosButton.disabled =
                                false;

                            sosButton.style.opacity =
                                "1";

                        }
                    )

                    .catch(
                        error => {

                            console.error(
                                "SOS error:",
                                error
                            );


                            alert(
                                "❌ Unable to send SOS.\n\n" +
                                error.message
                            );


                            sosButton.disabled =
                                false;

                            sosButton.style.opacity =
                                "1";

                        }
                    );

                }


                // =================================================
                // GPS
                // =================================================

                if (
                    !navigator.geolocation
                ) {

                    sendSOS(
                        null,
                        null
                    );

                    return;

                }


                navigator.geolocation.getCurrentPosition(

                    function (position) {

                        const latitude =
                            position.coords.latitude;

                        const longitude =
                            position.coords.longitude;


                        console.log(
                            "SOS GPS:",
                            latitude,
                            longitude
                        );


                        sendSOS(
                            latitude,
                            longitude
                        );

                    },


                    function (error) {

                        console.warn(
                            "GPS unavailable:",
                            error
                        );


                        // SOS still sent

                        sendSOS(
                            null,
                            null
                        );

                    },


                    {

                        enableHighAccuracy:
                            true,

                        timeout:
                            10000,

                        maximumAge:
                            0

                    }

                );

            }
        );

    }


    // =====================================================
    // EMERGENCY CONTACTS
    // =====================================================

    const contactButton =
        document.querySelector(
            ".emergency-button.contact"
        );


    if (contactButton) {

        contactButton.addEventListener(
            "click",
            function () {

                alert(
                    "EMERGENCY CONTACTS\n\n" +
                    "Police: 112\n" +
                    "Fire: 101\n" +
                    "Ambulance: 108"
                );

            }
        );

    }

}


// =========================================================
// LIVE CITIZEN AREA RISK
// =========================================================

function startCitizenRiskMonitoring() {

    if (riskPolling) {

        return;

    }


    riskPolling = true;


    console.log(
        "🌍 Starting live citizen risk monitoring..."
    );


    // First update

    updateCitizenAreaRisk();


    // Update every 5 seconds

    setInterval(
        updateCitizenAreaRisk,
        5000
    );

}


// =========================================================
// FETCH INCIDENTS AND CALCULATE RISK
// =========================================================

async function updateCitizenAreaRisk() {

    try {

        const response =
            await fetch(
                "/api/incidents"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load incidents"
            );

        }


        const data =
            await response.json();


        const incidents =
            Array.isArray(
                data.incidents
            )
                ? data.incidents
                : [];


        console.log(
            "🌍 All incidents:",
            incidents
        );


        calculateCitizenRisk(
            incidents
        );

    }


    catch (error) {

        console.error(
            "Citizen risk error:",
            error
        );

    }

}


// =========================================================
// CALCULATE CITIZEN RISK
// =========================================================

function calculateCitizenRisk(
    incidents
) {

    /*
        Current demo area.

        Your citizen dashboard currently displays:

        Ward 42
    */

    const currentArea =
        "ward 42";


    // =====================================================
    // FIND LOCAL INCIDENTS
    // =====================================================

    const localIncidents =
        incidents.filter(
            function (incident) {

                const location =
                    String(
                        incident.location || ""
                    ).toLowerCase();


                /*
                    Match Ward 42.

                    Example locations:

                    Ward 42
                    Ward 42 Main Road
                    Ward 42 - Market
                */

                return location.includes(
                    currentArea
                );

            }
        );


    console.log(
        "📍 Local Ward 42 incidents:",
        localIncidents
    );


    // =====================================================
    // NO LOCAL INCIDENTS
    // =====================================================

    if (
        localIncidents.length === 0
    ) {

        updateCitizenRiskUI({

            level:
                "LOW",

            score:
                10,

            title:
                "NO ACTIVE EMERGENCY ALERT",

            message:
                "No major incidents have been reported in your area.",

            localIncidents:
                []

        });

        return;

    }


    // =====================================================
    // FIND HIGHEST SEVERITY
    // =====================================================

    let highestScore =
        0;


    let highestIncident =
        null;


    localIncidents.forEach(
        function (incident) {

            const severity =
                String(
                    incident.severity ||
                    "medium"
                ).toLowerCase();


            let score =
                40;


            if (
                severity === "low"
            ) {

                score =
                    25;

            }


            else if (
                severity === "medium"
            ) {

                score =
                    50;

            }


            else if (
                severity === "high"
            ) {

                score =
                    75;

            }


            else if (
                severity === "critical"
            ) {

                score =
                    100;

            }


            // =================================================
            // SOS = ALWAYS CRITICAL
            // =================================================

            if (
                String(
                    incident.source || ""
                ).toUpperCase() === "SOS"
            ) {

                score =
                    100;

            }


            // =================================================
            // KEEP HIGHEST
            // =================================================

            if (
                score >
                highestScore
            ) {

                highestScore =
                    score;

                highestIncident =
                    incident;

            }

        }
    );


    // =====================================================
    // MULTIPLE REPORT CONFIDENCE
    // =====================================================

    let finalScore =
        highestScore;


    /*
        Multiple independent reports
        increase confidence.
    */

    if (
        localIncidents.length >= 2 &&
        finalScore < 100
    ) {

        finalScore +=
            10;

    }


    if (
        localIncidents.length >= 4 &&
        finalScore < 100
    ) {

        finalScore +=
            10;

    }


    finalScore =
        Math.min(
            finalScore,
            100
        );


    // =====================================================
    // DETERMINE RISK LEVEL
    // =====================================================

    let level;


    if (
        finalScore >= 85
    ) {

        level =
            "CRITICAL";

    }


    else if (
        finalScore >= 65
    ) {

        level =
            "HIGH";

    }


    else if (
        finalScore >= 40
    ) {

        level =
            "ELEVATED";

    }


    else {

        level =
            "LOW";

    }


    // =====================================================
    // DEFAULT MESSAGE
    // =====================================================

    let title =
        "LOCAL RISK DETECTED";


    let message =
        `${localIncidents.length} incident(s) reported in Ward 42.`;


    // =====================================================
    // INCIDENT INFORMATION
    // =====================================================

    if (highestIncident) {

        const incidentType =
            highestIncident.incident_type ||
            highestIncident.type ||
            "Hazard";


        const readableType =
            formatIncidentType(
                incidentType
            );


        // =================================================
        // CRITICAL
        // =================================================

        if (
            level === "CRITICAL"
        ) {

            title =
                "CRITICAL EMERGENCY IN YOUR AREA";


            if (
                String(
                    highestIncident.source || ""
                ).toUpperCase() === "SOS"
            ) {

                message =
                    "An SOS emergency has been reported in your area. Immediate emergency assistance may be required.";

            }

            else {

                message =
                    `${readableType} reported in your area. Immediate attention may be required.`;

            }

        }


        // =================================================
        // HIGH
        // =================================================

        else if (
            level === "HIGH"
        ) {

            title =
                "HIGH RISK DETECTED";


            message =
                `${readableType} reported in your area. Please stay alert and follow official instructions.`;

        }


        // =================================================
        // ELEVATED
        // =================================================

        else if (
            level === "ELEVATED"
        ) {

            title =
                "ELEVATED RISK DETECTED";


            message =
                `${readableType} reported nearby. Please remain alert.`;

        }


        // =================================================
        // LOW
        // =================================================

        else {

            title =
                "LOW LOCAL RISK";


            message =
                "A minor incident has been reported. Continue to monitor local conditions.";

        }

    }


    // =====================================================
    // UPDATE UI
    // =====================================================

    updateCitizenRiskUI({

        level:
            level,

        score:
            finalScore,

        title:
            title,

        message:
            message,

        localIncidents:
            localIncidents

    });

}


// =========================================================
// FORMAT INCIDENT TYPE
// =========================================================

function formatIncidentType(
    type
) {

    return String(type)
        .replace(/_/g, " ")
        .replace(/\b\w/g, function (letter) {

            return letter.toUpperCase();

        });

}


// =========================================================
// UPDATE CITIZEN RISK UI
// =========================================================

function updateCitizenRiskUI(
    risk
) {

    console.log(
        `🚨 Citizen Risk: ${risk.level} (${risk.score}/100)`
    );


    // =====================================================
    // EMERGENCY ALERT
    // =====================================================

    const alertTitle =
        document.querySelector(
            ".emergency-alert h2"
        );


    const alertMessage =
        document.querySelector(
            ".emergency-alert p"
        );


    const alertBox =
        document.querySelector(
            ".emergency-alert"
        );


    if (alertTitle) {

        alertTitle.textContent =
            risk.title;

    }


    if (alertMessage) {

        alertMessage.textContent =
            risk.message;

    }


    // =====================================================
    // ALERT CSS STATE
    // =====================================================

    if (alertBox) {

        alertBox.classList.remove(
            "risk-low",
            "risk-elevated",
            "risk-high",
            "risk-critical"
        );


        alertBox.classList.add(
            "risk-" +
            risk.level.toLowerCase()
        );

    }


    // =====================================================
    // FLOOD CARD
    // =====================================================

    const floodCard =
        document.querySelector(
            ".citizen-risk-card.critical"
        );


    if (floodCard) {

        const value =
            floodCard.querySelector(
                ".risk-value"
            );


        const paragraph =
            floodCard.querySelector(
                "p"
            );


        const meter =
            floodCard.querySelector(
                ".risk-meter div"
            );


        const small =
            floodCard.querySelector(
                "small"
            );


        if (value) {

            value.textContent =
                risk.level;

        }


        if (paragraph) {

            if (
                risk.localIncidents.length === 0
            ) {

                paragraph.textContent =
                    "No major incidents reported";

            }

            else {

                paragraph.textContent =
                    `${risk.localIncidents.length} local incident(s) detected`;

            }

        }


        if (meter) {

            meter.style.width =
                `${risk.score}%`;

        }


        if (small) {

            small.textContent =
                `RISK INDEX: ${risk.score}/100`;

        }

    }


    // =====================================================
    // WATER CARD
    // =====================================================

    const waterCard =
        document.querySelector(
            ".citizen-risk-card.water"
        );


    if (waterCard) {

        const value =
            waterCard.querySelector(
                ".risk-value"
            );


        const paragraph =
            waterCard.querySelector(
                "p"
            );


        const meter =
            waterCard.querySelector(
                ".risk-meter div"
            );


        if (value) {

            if (
                risk.score >= 85
            ) {

                value.textContent =
                    "CRITICAL";

            }

            else if (
                risk.score >= 65
            ) {

                value.textContent =
                    "HIGH";

            }

            else if (
                risk.score >= 40
            ) {

                value.textContent =
                    "ELEVATED";

            }

            else {

                value.textContent =
                    "NORMAL";

            }

        }


        if (paragraph) {

            if (
                risk.score >= 85
            ) {

                paragraph.textContent =
                    "Emergency conditions reported";

            }

            else if (
                risk.score >= 65
            ) {

                paragraph.textContent =
                    "High local risk";

            }

            else if (
                risk.score >= 40
            ) {

                paragraph.textContent =
                    "Elevated local risk";

            }

            else {

                paragraph.textContent =
                    "No major water emergency";

            }

        }


        if (meter) {

            meter.style.width =
                `${risk.score}%`;

        }

    }


    // =====================================================
    // UPDATE AREA HEADING BASED ON RISK
    // =====================================================

    const areaHeading =
        document.querySelector(
            ".location-card h1"
        );


    if (areaHeading) {

        areaHeading.textContent =
            "Ward 42";

    }


    // =====================================================
    // UPDATE WHY THIS ALERT SECTION
    // =====================================================

    updateRiskInformation(
        risk
    );

}


// =========================================================
// UPDATE WHY THIS ALERT INFORMATION
// =========================================================

function updateRiskInformation(
    risk
) {

    const signalList =
        document.querySelector(
            ".signal-list"
        );


    if (!signalList) {

        return;

    }


    if (
        risk.localIncidents.length === 0
    ) {

        signalList.innerHTML = `

            <div>

                <span class="signal-icon">
                    ●
                </span>

                No major citizen incidents reported

            </div>

            <div>

                <span class="signal-icon">
                    ●
                </span>

                Local monitoring network is active

            </div>

            <div>

                <span class="signal-icon">
                    ●
                </span>

                Continue monitoring official updates

            </div>

        `;

        return;

    }


    const latest =
        risk.localIncidents[0];


    const incidentType =
        formatIncidentType(
            latest.incident_type ||
            latest.type ||
            "Hazard"
        );


    signalList.innerHTML = `

        <div>

            <span class="signal-icon">
                ●
            </span>

            ${incidentType} reported in Ward 42

        </div>

        <div>

            <span class="signal-icon">
                ●
            </span>

            ${risk.localIncidents.length}
            local incident(s) detected

        </div>

        <div>

            <span class="signal-icon">
                ●
            </span>

            Risk index currently ${risk.score}/100

        </div>

    `;

}


// =========================================================
// DEBUG
// =========================================================

console.log(
    "✅ Citizen status tracker initialized."
);

console.log(
    "✅ Citizen live risk monitoring initialized."
);

console.log(
    "✅ Citizen dashboard is connected to /api/incidents."
);