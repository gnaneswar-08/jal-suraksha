// =========================================================
// JAL SURAKSHA - OFFICER COMMAND CENTER
// COMPLETE OFFICER JAVASCRIPT
// =========================================================


// =========================================================
// GLOBAL MAP VARIABLES
// =========================================================

let map = null;

let riskLayer = null;
let incidentLayer = null;
let sensorLayer = null;
let routeLayer = null;


// =========================================================
// EVACUATION CENTER MARKERS
// IMPORTANT: prevents ReferenceError
// =========================================================

let evacuationCenterMarkers = [];


// =========================================================
// REFRESH CONTROL
// =========================================================

let refreshRunning = false;


// =========================================================
// INCIDENT ICON
// =========================================================

function createIncidentIcon(color) {

    return L.divIcon({

        className: "incident-marker",

        html: `
            <div
                style="
                    width:16px;
                    height:16px;
                    border-radius:50%;
                    background:${color};
                    border:2px solid white;
                    box-shadow:0 0 12px ${color};
                ">
            </div>
        `,

        iconSize: [20, 20],

        iconAnchor: [10, 10]

    });

}


// =========================================================
// SENSOR ICON
// =========================================================

function createSensorIcon() {

    return L.divIcon({

        className: "sensor-marker",

        html: `
            <div
                style="
                    width:10px;
                    height:10px;
                    border-radius:50%;
                    background:#22D3EE;
                    border:2px solid white;
                    box-shadow:0 0 10px #22D3EE;
                ">
            </div>
        `,

        iconSize: [14, 14],

        iconAnchor: [7, 7]

    });

}


// =========================================================
// EVACUATION CENTER ICON
// =========================================================

function createEvacuationCenterIcon() {

    return L.divIcon({

        className: "evacuation-center-marker",

        html: `
            <div
                style="
                    width:38px;
                    height:38px;
                    border-radius:50%;
                    background:#10B981;
                    color:#07140f;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:19px;
                    border:3px solid #ECFDF5;
                    box-shadow:0 0 22px rgba(16,185,129,.75);
                "
            >
                🏠
            </div>
        `,

        iconSize: [38, 38],

        iconAnchor: [19, 19]

    });

}


// =========================================================
// INCIDENT STATUS COLOR
// =========================================================

function getIncidentStatusColor(
    status,
    priority,
    severity
) {

    const currentStatus =
        String(
            status || "NEW"
        ).toUpperCase();

    const currentPriority =
        String(
            priority || ""
        ).toUpperCase();

    const currentSeverity =
        String(
            severity || ""
        ).toLowerCase();


    if (
        currentStatus === "RESOLVED"
    ) {

        return "#22C55E";

    }


    if (
        currentStatus === "IN PROGRESS"
    ) {

        return "#3B82F6";

    }


    if (
        currentStatus === "DISPATCHED"
    ) {

        return "#F97316";

    }


    if (
        currentStatus === "ACKNOWLEDGED"
    ) {

        return "#FBBF24";

    }


    if (
        currentPriority === "P1" ||
        currentSeverity === "critical"
    ) {

        return "#EF4444";

    }


    if (
        currentPriority === "P2" ||
        currentSeverity === "high"
    ) {

        return "#F97316";

    }


    return "#FBBF24";

}


// =========================================================
// INITIALIZE MAP
// =========================================================

function initializeMap() {

    if (
        typeof L === "undefined"
    ) {

        console.error(
            "Leaflet library not loaded."
        );

        return false;

    }


    const mapElement =
        document.getElementById(
            "command-map"
        );


    if (!mapElement) {

        console.error(
            "Map element #command-map not found."
        );

        return false;

    }


    if (
        mapElement._leaflet_id
    ) {

        console.warn(
            "Map is already initialized."
        );

        return true;

    }


    map =
        L.map(
            "command-map",
            {
                zoomControl: true
            }
        )
        .setView(
            [17.3850, 78.4867],
            13
        );


    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"

        }

    ).addTo(map);


    riskLayer =
        L.layerGroup()
            .addTo(map);


    incidentLayer =
        L.layerGroup()
            .addTo(map);


    sensorLayer =
        L.layerGroup()
            .addTo(map);


    routeLayer =
        L.layerGroup()
            .addTo(map);


    // =====================================================
    // LOAD EXISTING DATA
    // =====================================================

    loadDashboard();

    loadRisk();

    loadIncidents();

    loadSensors();

    loadShelter();

    loadEvacuationCentersOnMap();


    updateClock();


    setInterval(
        updateClock,
        1000
    );


    setTimeout(
        function () {

            if (map) {

                map.invalidateSize();

            }

        },
        300
    );


    return true;

}


// =========================================================
// LOAD DASHBOARD
// =========================================================

async function loadDashboard() {

    try {

        const response =
            await fetch(
                "/api/dashboard"
            );


        if (!response.ok) {

            throw new Error(
                "Dashboard API failed"
            );

        }


        const data =
            await response.json();


        console.log(
            "Dashboard:",
            data
        );


        const activeIncidents =
            document.getElementById(
                "map-incidents"
            );


        if (
            activeIncidents &&
            data.active_incidents !== undefined
        ) {

            activeIncidents.textContent =
                data.active_incidents;

        }


        const sensorCount =
            document.getElementById(
                "map-sensors"
            );


        if (
            sensorCount &&
            data.active_sensors !== undefined
        ) {

            sensorCount.textContent =
                data.active_sensors;

        }


        const footerSensors =
            document.getElementById(
                "footer-sensors"
            );


        if (
            footerSensors &&
            data.active_sensors !== undefined
        ) {

            footerSensors.textContent =
                `${data.active_sensors} ACTIVE`;

        }

    }

    catch (error) {

        console.error(
            "Dashboard API error:",
            error
        );

    }

}


// =========================================================
// LOAD RISK
// =========================================================

async function loadRisk() {

    try {

        const response =
            await fetch(
                "/api/risk"
            );


        if (!response.ok) {

            throw new Error(
                "Risk API failed"
            );

        }


        const data =
            await response.json();


        console.log(
            "Risk:",
            data
        );


        const threatLocation =
            document.getElementById(
                "threat-location"
            );


        if (
            threatLocation &&
            data.location
        ) {

            threatLocation.textContent =
                data.location;

        }


        const threatScore =
            document.getElementById(
                "threat-score"
            );


        if (
            threatScore &&
            data.risk_index !== undefined
        ) {

            threatScore.textContent =
                data.risk_index;

        }


        const threatStatus =
            document.getElementById(
                "threat-status"
            );


        if (
            threatStatus &&
            data.risk_level
        ) {

            threatStatus.textContent =
                `${data.risk_level} RISK`;

        }


        const threatMessage =
            document.getElementById(
                "threat-message"
            );


        if (
            threatMessage &&
            data.message
        ) {

            threatMessage.textContent =
                data.message;

        }


        const meter =
            document.getElementById(
                "threat-meter-fill"
            );


        if (
            meter &&
            data.risk_index !== undefined
        ) {

            const score =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            data.risk_index
                        )
                    )
                );

            meter.style.width =
                `${score}%`;

        }


        if (!riskLayer) {

            return;

        }


        riskLayer.clearLayers();


        if (
            Array.isArray(
                data.risk_areas
            )
        ) {

            data.risk_areas.forEach(
                function (area) {

                    if (
                        area.latitude === undefined ||
                        area.longitude === undefined
                    ) {

                        return;

                    }


                    L.circle(

                        [
                            Number(
                                area.latitude
                            ),

                            Number(
                                area.longitude
                            )

                        ],

                        {

                            radius:
                                area.radius || 500,

                            color:
                                "#EF4444",

                            fillColor:
                                "#EF4444",

                            fillOpacity:
                                0.18

                        }

                    )

                    .bindPopup(`

                        <b>
                            RISK ZONE
                        </b>

                        <br><br>

                        ${escapeHtml(
                            area.name ||
                            "High Risk Area"
                        )}

                    `)

                    .addTo(
                        riskLayer
                    );

                }
            );

        }

    }

    catch (error) {

        console.error(
            "Risk API error:",
            error
        );

    }

}


// =========================================================
// LOAD INCIDENTS
// =========================================================

async function loadIncidents() {

    try {

        const response =
            await fetch(
                "/api/incidents"
            );


        if (!response.ok) {

            throw new Error(
                "Incident API failed"
            );

        }


        const data =
            await response.json();


        if (incidentLayer) {

            incidentLayer.clearLayers();

        }


        const list =
            document.getElementById(
                "incident-list"
            );


        if (!list) {

            return;

        }


        list.innerHTML = "";


        const incidents =
            Array.isArray(
                data.incidents
            )
                ? data.incidents
                : [];


        const incidentCount =
            document.getElementById(
                "incident-count"
            );


        if (incidentCount) {

            incidentCount.textContent =
                String(
                    incidents.length
                ).padStart(
                    2,
                    "0"
                );

        }


        if (
            incidents.length === 0
        ) {

            list.innerHTML = `

                <div
                    class="incident-item"
                    style="
                        padding:15px;
                        opacity:0.7;
                    "
                >

                    <strong>
                        NO ACTIVE INCIDENTS
                    </strong>

                    <span>
                        Waiting for new reports.
                    </span>

                </div>

            `;

            return;

        }


        incidents.forEach(

            function (
                incident,
                index
            ) {

                const isCitizenReport =
                    String(
                        incident.source || ""
                    ).toUpperCase() ===
                    "CITIZEN";


                const isSOS =
                    String(
                        incident.source || ""
                    ).toUpperCase() ===
                    "SOS";


                const incidentId =
                    incident.id !== undefined &&
                    incident.id !== null
                        ? incident.id
                        : null;


                const incidentType =
                    incident.incident_type ||
                    incident.type ||
                    "Unknown";


                const severity =
                    incident.severity ||
                    incident.priority ||
                    "UNKNOWN";


                const severityLower =
                    String(
                        severity
                    ).toLowerCase();


                const location =
                    incident.location ||
                    "Unknown location";


                const description =
                    incident.description ||
                    "No description provided.";


                const currentStatus =
                    String(
                        incident.status ||
                        "NEW"
                    ).toUpperCase();


                let coordinates;


                const hasGPS =

                    incident.latitude !== null &&

                    incident.latitude !== undefined &&

                    incident.longitude !== null &&

                    incident.longitude !== undefined &&

                    Number.isFinite(
                        Number(
                            incident.latitude
                        )
                    ) &&

                    Number.isFinite(
                        Number(
                            incident.longitude
                        )
                    );


                if (hasGPS) {

                    coordinates = [

                        Number(
                            incident.latitude
                        ),

                        Number(
                            incident.longitude
                        )

                    ];

                }

                else {

                    coordinates = [

                        17.3850 +
                        index * 0.004,

                        78.4867 +
                        index * 0.003

                    ];

                }


                const markerColor =
                    getIncidentStatusColor(
                        currentStatus,
                        incident.priority,
                        severity
                    );


                const marker =
                    L.marker(

                        coordinates,

                        {

                            icon:
                                createIncidentIcon(
                                    markerColor
                                )

                        }

                    );


                marker.bindPopup(`

                    <div>

                        <strong>

                            ${
                                isSOS
                                    ? "🚨 SOS EMERGENCY"
                                    : isCitizenReport
                                        ? "🔴 CITIZEN REPORT"
                                        : "INCIDENT"
                            }

                        </strong>

                        <br><br>

                        <b>
                            Incident ID:
                        </b>

                        #${escapeHtml(incident.id)}

                        <br>

                        <b>
                            Location:
                        </b>

                        ${escapeHtml(location)}

                        <br>

                        <b>
                            Type:
                        </b>

                        ${escapeHtml(incidentType)}

                        <br>

                        <b>
                            Severity:
                        </b>

                        ${escapeHtml(severity)}

                        <br>

                        <b>
                            Priority:
                        </b>

                        ${escapeHtml(
                            incident.priority || "N/A"
                        )}

                        <br>

                        <b>
                            Status:
                        </b>

                        <span
                            style="
                                font-weight:800;
                                color:${markerColor};
                            "
                        >

                            ${escapeHtml(currentStatus)}

                        </span>

                        <br><br>

                        <b>
                            Description:
                        </b>

                        <br>

                        ${escapeHtml(description)}

                    </div>

                `);


                if (incidentLayer) {

                    marker.addTo(
                        incidentLayer
                    );

                }


                let priorityClass =
                    "elevated";


                if (

                    incident.priority === "P1" ||

                    severityLower === "critical"

                ) {

                    priorityClass =
                        "critical";

                }

                else if (

                    incident.priority === "P2" ||

                    severityLower === "high"

                ) {

                    priorityClass =
                        "high";

                }


                let nextStatus = null;

                let buttonText = null;


                if (
                    currentStatus === "NEW"
                ) {

                    nextStatus =
                        "ACKNOWLEDGED";

                    buttonText =
                        "ACKNOWLEDGE";

                }

                else if (
                    currentStatus === "ACKNOWLEDGED"
                ) {

                    nextStatus =
                        "DISPATCHED";

                    buttonText =
                        "DISPATCH";

                }

                else if (
                    currentStatus === "DISPATCHED"
                ) {

                    nextStatus =
                        "IN PROGRESS";

                    buttonText =
                        "IN PROGRESS";

                }

                else if (
                    currentStatus === "IN PROGRESS"
                ) {

                    nextStatus =
                        "RESOLVED";

                    buttonText =
                        "RESOLVE";

                }


                let statusButtonHTML = "";


                if (
                    incidentId !== null &&
                    nextStatus !== null
                ) {

                    statusButtonHTML = `

                        <button
                            type="button"
                            class="incident-status-button"
                            data-incident-id="${escapeHtml(incidentId)}"
                            data-next-status="${escapeHtml(nextStatus)}"
                            style="
                                margin-top:10px;
                                width:100%;
                                padding:9px 12px;
                                border:none;
                                border-radius:7px;
                                cursor:pointer;
                                font-weight:700;
                            "
                        >

                            ${buttonText}

                        </button>

                    `;

                }


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    `incident-item ${priorityClass}`;


                item.innerHTML = `

                    <div
                        class="incident-number"
                    >

                        ${
                            String(
                                index + 1
                            ).padStart(
                                2,
                                "0"
                            )
                        }

                    </div>


                    <div
                        class="incident-info"
                    >

                        ${
                            isSOS
                                ? `

                                    <small
                                        style="
                                            display:block;
                                            color:#EF4444;
                                            font-weight:800;
                                            margin-bottom:4px;
                                        "
                                    >

                                        🚨 SOS EMERGENCY

                                    </small>

                                `
                                : isCitizenReport
                                    ? `

                                        <small
                                            style="
                                                display:block;
                                                color:#EF4444;
                                                font-weight:800;
                                                margin-bottom:4px;
                                            "
                                        >

                                            🔴 CITIZEN REPORT

                                        </small>

                                    `
                                    : ""
                        }


                        <strong>
                            ${escapeHtml(location)}
                        </strong>


                        <span>
                            ${escapeHtml(incidentType)}
                            •
                            ${escapeHtml(severity)}
                        </span>


                        <span>
                            PRIORITY •
                            ${escapeHtml(
                                incident.priority || "N/A"
                            )}
                        </span>


                        <span>

                            STATUS •

                            <span
                                style="
                                    color:${markerColor};
                                    font-weight:800;
                                "
                            >

                                ${escapeHtml(currentStatus)}

                            </span>

                        </span>


                        ${
                            isCitizenReport ||
                            isSOS
                                ? `

                                    <span>
                                        ${escapeHtml(description)}
                                    </span>

                                `
                                : ""
                        }


                        ${statusButtonHTML}

                    </div>


                    <div
                        class="incident-priority"
                    >

                        ${escapeHtml(
                            incident.priority ||
                            severity
                        )}

                    </div>

                `;


                const statusButton =
                    item.querySelector(
                        ".incident-status-button"
                    );


                if (statusButton) {

                    statusButton.addEventListener(

                        "click",

                        async function (event) {

                            event.stopPropagation();


                            const id =
                                this.dataset.incidentId;


                            const newStatus =
                                this.dataset.nextStatus;


                            this.disabled =
                                true;


                            this.textContent =
                                "UPDATING...";


                            try {

                                const response =
                                    await fetch(

                                        `/api/incidents/${id}/status`,

                                        {

                                            method:
                                                "POST",

                                            headers: {

                                                "Content-Type":
                                                    "application/json"

                                            },

                                            body:
                                                JSON.stringify({

                                                    status:
                                                        newStatus

                                                })

                                        }

                                    );


                                const result =
                                    await response.json();


                                if (
                                    !response.ok
                                ) {

                                    throw new Error(

                                        result.message ||
                                        "Status update failed."

                                    );

                                }


                                await loadIncidents();

                                await loadDashboard();

                                await loadRisk();

                            }

                            catch (error) {

                                console.error(
                                    "Status update error:",
                                    error
                                );


                                alert(
                                    "Unable to update incident status.\n\n" +
                                    error.message
                                );


                                this.disabled =
                                    false;


                                this.textContent =
                                    buttonText;

                            }

                        }

                    );

                }


                item.addEventListener(
                    "click",
                    function () {

                        if (map) {

                            map.setView(
                                coordinates,
                                15
                            );

                            marker.openPopup();

                        }

                    }
                );


                list.appendChild(
                    item
                );

            }

        );

    }

    catch (error) {

        console.error(
            "Incident API error:",
            error
        );

    }

}


// =========================================================
// LOAD SENSORS
// =========================================================

async function loadSensors() {

    try {

        const response =
            await fetch(
                "/api/sensors"
            );


        if (!response.ok) {

            throw new Error(
                "Sensor API failed"
            );

        }


        const data =
            await response.json();


        if (sensorLayer) {

            sensorLayer.clearLayers();

        }


        const list =
            document.getElementById(
                "telemetry-list"
            );


        if (!list) {

            return;

        }


        list.innerHTML = "";


        const sensors =
            Array.isArray(
                data.sensors
            )
                ? data.sensors
                : [];


        const mapSensorCount =
            document.getElementById(
                "map-sensors"
            );


        if (mapSensorCount) {

            mapSensorCount.textContent =
                sensors.length;

        }


        const footerSensors =
            document.getElementById(
                "footer-sensors"
            );


        if (footerSensors) {

            footerSensors.textContent =
                `${sensors.length} ACTIVE`;

        }


        sensors.forEach(

            function (
                sensor,
                index
            ) {

                const coordinates = [

                    17.3890 +
                    index * 0.005,

                    78.4900 -
                    index * 0.004

                ];


                L.marker(

                    coordinates,

                    {

                        icon:
                            createSensorIcon()

                    }

                )

                .bindPopup(`

                    <b>
                        SENSOR ${escapeHtml(sensor.id)}
                    </b>

                    <br><br>

                    ${escapeHtml(sensor.type)}

                    <br>

                    Location:
                    ${escapeHtml(sensor.location)}

                    <br>

                    Value:
                    ${escapeHtml(sensor.value)}
                    ${escapeHtml(sensor.unit)}

                    <br>

                    Status:
                    ${escapeHtml(sensor.status)}

                `)

                .addTo(
                    sensorLayer
                );


                let statusClass =
                    "telemetry-safe";


                if (
                    sensor.status ===
                    "CRITICAL"
                ) {

                    statusClass =
                        "telemetry-danger";

                }

                else if (
                    sensor.status ===
                    "WARNING"
                ) {

                    statusClass =
                        "telemetry-warning";

                }


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "telemetry-item";


                item.innerHTML = `

                    <div
                        class="sensor-id"
                    >

                        ${escapeHtml(sensor.id)}

                    </div>


                    <div>

                        <strong>
                            ${escapeHtml(sensor.type)}
                        </strong>


                        <span>
                            ${escapeHtml(sensor.location)}
                        </span>

                    </div>


                    <b
                        class="${statusClass}"
                    >

                        ${escapeHtml(sensor.value)}
                        ${escapeHtml(sensor.unit)}

                    </b>

                `;


                list.appendChild(
                    item
                );

            }

        );

    }

    catch (error) {

        console.error(
            "Sensor API error:",
            error
        );

    }

}


// =========================================================
// LOAD EVACUATION CENTERS ON OFFICER MAP
// =========================================================

async function loadEvacuationCentersOnMap() {

    try {

        const response =
            await fetch(
                "/api/evacuation-centers"
            );


        if (!response.ok) {

            throw new Error(
                "Evacuation center API failed"
            );

        }


        const data =
            await response.json();


        const centers =
            Array.isArray(
                data.centers
            )
                ? data.centers
                : [];


        // =====================================================
        // REMOVE ONLY EVACUATION CENTER MARKERS
        // =====================================================

        evacuationCenterMarkers.forEach(

            function (marker) {

                if (
                    routeLayer &&
                    routeLayer.hasLayer(marker)
                ) {

                    routeLayer.removeLayer(
                        marker
                    );

                }

            }

        );


        evacuationCenterMarkers = [];


        // =====================================================
        // ADD NEW CENTER MARKERS
        // =====================================================

        centers.forEach(

            function (center) {

                const latitude =
                    Number(
                        center.latitude
                    );


                const longitude =
                    Number(
                        center.longitude
                    );


                if (
                    !Number.isFinite(latitude) ||
                    !Number.isFinite(longitude)
                ) {

                    return;

                }


                const marker =
                    L.marker(

                        [
                            latitude,
                            longitude
                        ],

                        {
                            icon:
                                createEvacuationCenterIcon()
                        }

                    );


                const capacity =
                    Number(
                        center.capacity || 0
                    );


                const occupied =
                    Number(
                        center.occupied || 0
                    );


                const available =
                    Number(
                        center.available !== undefined
                            ? center.available
                            : Math.max(
                                capacity - occupied,
                                0
                            )
                    );


                marker.bindPopup(`

                    <div>

                        <strong>
                            🏠
                            ${escapeHtml(
                                center.name ||
                                "Evacuation Center"
                            )}
                        </strong>

                        <br><br>

                        <b>
                            Location:
                        </b>

                        ${escapeHtml(
                            center.location ||
                            "Location unavailable"
                        )}

                        <br>

                        <b>
                            Capacity:
                        </b>

                        ${capacity}

                        <br>

                        <b>
                            Available:
                        </b>

                        ${available}

                        <br>

                        <b>
                            Status:
                        </b>

                        ${escapeHtml(
                            center.status ||
                            "OPEN"
                        )}

                    </div>

                `);


                marker.addTo(
                    routeLayer
                );


                evacuationCenterMarkers.push(
                    marker
                );

            }

        );


        // =====================================================
        // UPDATE OFFICER LIST
        // =====================================================

        updateOfficerShelterList(
            centers
        );

    }

    catch (error) {

        console.error(
            "Evacuation center map error:",
            error
        );

    }

}


// =========================================================
// UPDATE OFFICER EVACUATION CENTER LIST
// WITH DELETE OPTION
// =========================================================

function updateOfficerShelterList(centers) {

    const list =
        document.getElementById(
            "officer-shelter-list"
        );

    if (!list) {
        return;
    }

    // -----------------------------------------------------
    // EMPTY STATE
    // -----------------------------------------------------

    if (
        !Array.isArray(centers) ||
        centers.length === 0
    ) {

        list.innerHTML = `

            <div
                style="
                    padding:16px;
                    opacity:.7;
                    text-align:center;
                "
            >

                🏠 No evacuation centers registered yet.

            </div>

        `;

        return;
    }

    // -----------------------------------------------------
    // CREATE CENTER CARDS
    // -----------------------------------------------------

    list.innerHTML = centers.map(
        function (center) {

            const capacity =
                Number(
                    center.capacity || 0
                );

            const occupied =
                Number(
                    center.occupied || 0
                );

            const available =
                Number(
                    center.available !== undefined
                        ? center.available
                        : Math.max(
                            capacity - occupied,
                            0
                        )
                );

            const status =
                String(
                    center.status || "OPEN"
                ).toUpperCase();

            const centerId =
                center.id;

            return `

                <div
                    class="evac-center-item"
                    style="
                        position:relative;
                        padding:15px;
                        margin-bottom:10px;
                        border:1px solid rgba(16,185,129,.25);
                        border-radius:10px;
                        background:rgba(16,185,129,.06);
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:flex-start;
                            gap:10px;
                        "
                    >

                        <div
                            style="
                                min-width:0;
                                flex:1;
                            "
                        >

                            <div
                                style="
                                    font-weight:800;
                                    font-size:15px;
                                    margin-bottom:6px;
                                "
                            >

                                🏠
                                ${escapeHtml(
                                    center.name ||
                                    "Evacuation Center"
                                )}

                            </div>


                            <div
                                style="
                                    font-size:12px;
                                    opacity:.8;
                                    line-height:1.7;
                                "
                            >

                                📍
                                ${escapeHtml(
                                    center.location ||
                                    "Location unavailable"
                                )}

                                <br>

                                👥 Capacity:
                                <strong>
                                    ${capacity}
                                </strong>

                                &nbsp; • &nbsp;

                                Available:
                                <strong>
                                    ${available}
                                </strong>

                                <br>

                                📡 GPS:
                                ${Number(
                                    center.latitude
                                ).toFixed(5)},
                                ${Number(
                                    center.longitude
                                ).toFixed(5)}

                            </div>


                            <div
                                style="
                                    margin-top:7px;
                                    display:inline-block;
                                    padding:4px 9px;
                                    border-radius:20px;
                                    background:rgba(16,185,129,.15);
                                    color:#10B981;
                                    font-size:10px;
                                    font-weight:800;
                                "
                            >

                                ● ${escapeHtml(status)}

                            </div>

                        </div>


                        <!-- DELETE BUTTON -->

                        <button
                            type="button"
                            class="delete-evacuation-center"
                            data-center-id="${escapeHtml(centerId)}"
                            style="
                                flex-shrink:0;
                                border:1px solid rgba(239,68,68,.35);
                                background:rgba(239,68,68,.10);
                                color:#EF4444;
                                border-radius:8px;
                                padding:8px 10px;
                                cursor:pointer;
                                font-size:12px;
                                font-weight:800;
                                transition:.2s;
                            "
                            title="Delete evacuation center"
                        >

                            🗑 DELETE

                        </button>

                    </div>

                </div>

            `;

        }
    ).join("");

    // -----------------------------------------------------
    // DELETE BUTTON EVENTS
    // -----------------------------------------------------

    const deleteButtons =
        list.querySelectorAll(
            ".delete-evacuation-center"
        );

    deleteButtons.forEach(
        function (button) {

            button.addEventListener(
                "mouseenter",
                function () {

                    this.style.background =
                        "rgba(239,68,68,.22)";

                    this.style.transform =
                        "translateY(-1px)";

                }
            );

            button.addEventListener(
                "mouseleave",
                function () {

                    this.style.background =
                        "rgba(239,68,68,.10)";

                    this.style.transform =
                        "translateY(0)";

                }
            );

            button.addEventListener(
                "click",
                async function (event) {

                    event.stopPropagation();

                    const centerId =
                        this.dataset.centerId;

                    await deleteEvacuationCenter(
                        centerId,
                        this
                    );

                }
            );

        }
    );

}
// =========================================================
// DELETE EVACUATION CENTER
// =========================================================

async function deleteEvacuationCenter(centerId, button) {

    // -----------------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------------

    if (
        centerId === undefined ||
        centerId === null ||
        centerId === ""
    ) {

        alert(
            "Unable to delete evacuation center.\n\nCenter ID is missing."
        );

        return;

    }


    // -----------------------------------------------------
    // CONFIRMATION
    // -----------------------------------------------------

    const confirmed = confirm(
        "🗑 DELETE EVACUATION CENTER\n\n" +
        "Are you sure you want to remove this evacuation center?\n\n" +
        "This will also remove it from the Citizen Safety Portal."
    );


    if (!confirmed) {

        return;

    }


    // -----------------------------------------------------
    // DISABLE BUTTON
    // -----------------------------------------------------

    if (button) {

        button.disabled = true;

        button.textContent = "⏳ DELETING...";

        button.style.opacity = "0.6";

        button.style.cursor = "not-allowed";

    }


    // -----------------------------------------------------
    // DELETE FROM FLASK
    // -----------------------------------------------------

    try {

        const response = await fetch(

            `/api/evacuation-centers/${encodeURIComponent(centerId)}`,

            {

                method: "DELETE",

                headers: {

                    "Accept": "application/json"

                }

            }

        );


        // -------------------------------------------------
        // READ RESPONSE
        // -------------------------------------------------

        let data = {};

        try {

            data = await response.json();

        }

        catch (jsonError) {

            console.warn(
                "Delete response was not JSON."
            );

        }


        // -------------------------------------------------
        // ERROR
        // -------------------------------------------------

        if (!response.ok) {

            throw new Error(

                data.message ||
                `Delete failed. Server returned ${response.status}.`

            );

        }


        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        console.log(
            "Evacuation center deleted:",
            centerId
        );


        alert(
            "✅ EVACUATION CENTER DELETED\n\n" +
            "The center has been removed successfully."
        );


        // -------------------------------------------------
        // REFRESH OFFICER LIST
        // -------------------------------------------------

        await loadEvacuationCenters();


        // -------------------------------------------------
        // REFRESH MAP
        // -------------------------------------------------

        await loadEvacuationCentersOnMap();


        // -------------------------------------------------
        // REFRESH DASHBOARD
        // -------------------------------------------------

        await loadDashboard();


    }

    catch (error) {

        console.error(
            "Delete evacuation center error:",
            error
        );


        alert(
            "❌ Unable to delete evacuation center.\n\n" +
            error.message
        );


        // Restore button

        if (button) {

            button.disabled = false;

            button.textContent = "🗑 DELETE";

            button.style.opacity = "1";

            button.style.cursor = "pointer";

        }

    }

}
// =========================================================
// LOAD SHELTER
// =========================================================


// =========================================================
// CLOCK
// =========================================================

function updateClock() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(

            "en-IN",

            {

                hour12: false

            }

        );


    const clock =
        document.getElementById(
            "officer-clock"
        );


    if (clock) {

        clock.textContent =
            time;

    }


    const sync =
        document.getElementById(
            "last-sync"
        );


    if (sync) {

        sync.textContent =
            time;

    }

}


// =========================================================
// LAYER TOGGLE
// =========================================================

function toggleLayer(
    layer,
    button
) {

    if (
        !map ||
        !layer
    ) {

        return;

    }


    if (
        map.hasLayer(
            layer
        )
    ) {

        map.removeLayer(
            layer
        );


        if (button) {

            button.classList.remove(
                "active"
            );

        }

    }

    else {

        map.addLayer(
            layer
        );


        if (button) {

            button.classList.add(
                "active"
            );

        }

    }

}


// =========================================================
// INITIATE EMERGENCY RESPONSE
// =========================================================

async function initiateEmergencyResponse() {

    const dispatchButton =
        document.getElementById(
            "dispatchButton"
        );


    if (!dispatchButton) {

        return;

    }


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


        const activeIncidents =
            incidents.filter(
                function (incident) {

                    const status =
                        String(
                            incident.status ||
                            "NEW"
                        ).toUpperCase();


                    return (
                        status !== "RESOLVED"
                    );

                }
            );


        if (
            activeIncidents.length === 0
        ) {

            alert(

                "NO ACTIVE INCIDENTS\n\n" +

                "There are currently no incidents requiring emergency response."

            );

            return;

        }


        const priorityRank = {

            "P1": 1,

            "P2": 2,

            "P3": 3

        };


        activeIncidents.sort(
            function (a, b) {

                const priorityA =
                    priorityRank[
                        String(
                            a.priority ||
                            "P3"
                        ).toUpperCase()
                    ] || 3;


                const priorityB =
                    priorityRank[
                        String(
                            b.priority ||
                            "P3"
                        ).toUpperCase()
                    ] || 3;


                return (
                    priorityA -
                    priorityB
                );

            }
        );


        const incident =
            activeIncidents[0];


        const currentStatus =
            String(
                incident.status ||
                "NEW"
            ).toUpperCase();


        if (
            currentStatus === "DISPATCHED" ||
            currentStatus === "IN PROGRESS"
        ) {

            alert(

                "RESPONSE ALREADY ACTIVE\n\n" +

                "Incident #" +
                incident.id +
                " is already " +
                currentStatus +
                "."

            );

            return;

        }


        const confirmed =
            confirm(

                "⚠ INITIATE EMERGENCY RESPONSE\n\n" +

                "Incident: #" +
                incident.id +

                "\nLocation: " +
                incident.location +

                "\nPriority: " +
                (
                    incident.priority ||
                    "N/A"
                ) +

                "\nSeverity: " +
                (
                    incident.severity ||
                    "N/A"
                ) +

                "\n\n" +

                "Dispatch a response team?"

            );


        if (!confirmed) {

            return;

        }


        dispatchButton.disabled =
            true;


        dispatchButton.style.opacity =
            "0.6";


        dispatchButton.textContent =
            "⏳ DISPATCHING...";


        const statusResponse =
            await fetch(

                `/api/incidents/${incident.id}/status`,

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            status:
                                "DISPATCHED"

                        })

                }

            );


        const result =
            await statusResponse.json();


        if (
            !statusResponse.ok
        ) {

            throw new Error(
                result.message ||
                "Dispatch failed."
            );

        }


        await loadIncidents();

        await loadDashboard();

        await loadRisk();


        if (
            map &&
            incident.latitude !== null &&
            incident.latitude !== undefined &&
            incident.longitude !== null &&
            incident.longitude !== undefined
        ) {

            map.setView(

                [
                    Number(
                        incident.latitude
                    ),

                    Number(
                        incident.longitude
                    )

                ],

                16

            );

        }


        alert(

            "🚨 EMERGENCY RESPONSE INITIATED\n\n" +

            "Incident #" +
            incident.id +

            "\nLocation: " +
            incident.location +

            "\n\nResponse team has been dispatched."

        );

    }

    catch (error) {

        console.error(
            "Emergency response error:",
            error
        );


        alert(

            "❌ Unable to initiate emergency response.\n\n" +

            error.message

        );

    }

    finally {

        dispatchButton.disabled =
            false;


        dispatchButton.style.opacity =
            "1";


        dispatchButton.textContent =
            "⚠ INITIATE EMERGENCY RESPONSE";

    }

}


// =========================================================
// EVACUATION CENTER MODAL
// =========================================================

function initializeShelterManagement() {

    const button =
        document.getElementById(
            "addShelterButton"
        );


    const modal =
        document.getElementById(
            "evacuationModal"
        );


    if (!button || !modal) {

        console.warn(
            "Evacuation center UI not found."
        );

        return;

    }


    // =====================================================
    // OPEN
    // =====================================================

    button.addEventListener(
        "click",
        function () {

            modal.classList.add(
                "show"
            );

        }
    );


    // =====================================================
    // CLOSE
    // =====================================================

    const closeButton =
        document.getElementById(
            "closeEvacuationModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeEvacuationModal
        );

    }


    // =====================================================
    // CLOSE BY BACKDROP
    // =====================================================

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeEvacuationModal();

            }

        }
    );


    // =====================================================
    // GPS
    // =====================================================

    const gpsButton =
        document.getElementById(
            "evacUseGpsButton"
        );


    if (gpsButton) {

        gpsButton.addEventListener(
            "click",
            getEvacuationCenterGPS
        );

    }


    // =====================================================
    // FORM
    // =====================================================

    const form =
        document.getElementById(
            "evacuationForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            submitEvacuationCenter
        );

    }

}


// =========================================================
// CLOSE EVACUATION MODAL
// =========================================================

function closeEvacuationModal() {

    const modal =
        document.getElementById(
            "evacuationModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


// =========================================================
// GET EVACUATION CENTER GPS
// =========================================================

function getEvacuationCenterGPS() {

    const status =
        document.getElementById(
            "evacGpsStatus"
        );


    if (
        !navigator.geolocation
    ) {

        if (status) {

            status.textContent =
                "GPS is not available on this device.";

        }

        return;

    }


    if (status) {

        status.textContent =
            "Getting current coordinates...";

    }


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            const latitudeInput =
                document.getElementById(
                    "evacLatitude"
                );


            const longitudeInput =
                document.getElementById(
                    "evacLongitude"
                );


            if (latitudeInput) {

                latitudeInput.value =
                    latitude.toFixed(6);

            }


            if (longitudeInput) {

                longitudeInput.value =
                    longitude.toFixed(6);

            }


            if (status) {

                status.textContent =
                    `GPS captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

            }

        },

        function (error) {

            console.error(
                "Evacuation center GPS error:",
                error
            );


            if (status) {

                status.textContent =
                    "Unable to access GPS. Enter coordinates manually.";

            }

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


// =========================================================
// SUBMIT EVACUATION CENTER
// =========================================================

async function submitEvacuationCenter(
    event
) {

    event.preventDefault();


    const name =
        document.getElementById(
            "evacCenterName"
        )?.value.trim();


    const location =
        document.getElementById(
            "evacCenterLocation"
        )?.value.trim();


    const capacity =
        document.getElementById(
            "evacCenterCapacity"
        )?.value;


    const latitude =
        document.getElementById(
            "evacLatitude"
        )?.value;


    const longitude =
        document.getElementById(
            "evacLongitude"
        )?.value;


    const message =
        document.getElementById(
            "evacuationMessage"
        );


    const submitButton =
        document.getElementById(
            "registerEvacuationButton"
        );


    // =====================================================
    // VALIDATION
    // =====================================================

    if (
        !name ||
        !location ||
        !capacity ||
        !latitude ||
        !longitude
    ) {

        if (message) {

            message.textContent =
                "Please fill all fields.";

            message.className =
                "evac-message error";

        }

        return;

    }


    const numericCapacity =
        Number(
            capacity
        );


    const numericLatitude =
        Number(
            latitude
        );


    const numericLongitude =
        Number(
            longitude
        );


    if (
        !Number.isFinite(numericCapacity) ||
        numericCapacity <= 0
    ) {

        if (message) {

            message.textContent =
                "Capacity must be a valid positive number.";

            message.className =
                "evac-message error";

        }

        return;

    }


    if (
        !Number.isFinite(numericLatitude) ||
        numericLatitude < -90 ||
        numericLatitude > 90
    ) {

        if (message) {

            message.textContent =
                "Invalid latitude.";

            message.className =
                "evac-message error";

        }

        return;

    }


    if (
        !Number.isFinite(numericLongitude) ||
        numericLongitude < -180 ||
        numericLongitude > 180
    ) {

        if (message) {

            message.textContent =
                "Invalid longitude.";

            message.className =
                "evac-message error";

        }

        return;

    }


    if (message) {

        message.textContent =
            "Registering evacuation center...";

        message.className =
            "evac-message";

    }


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "REGISTERING...";

    }


    try {

        const response =
            await fetch(
                "/api/evacuation-centers",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            name:
                                name,

                            location:
                                location,

                            capacity:
                                numericCapacity,

                            latitude:
                                numericLatitude,

                            longitude:
                                numericLongitude

                        })

                }
            );


        let data = {};

        try {

            data =
                await response.json();

        }

        catch {

            data = {};

        }


        if (
            !response.ok
        ) {

            throw new Error(

                data.message ||
                "Unable to register evacuation center."

            );

        }


        if (message) {

            message.textContent =
                "✓ Evacuation center registered successfully.";

            message.className =
                "evac-message success";

        }


        // =================================================
        // REFRESH MAP + LIST
        // =================================================

        await loadEvacuationCentersOnMap();


        // =================================================
        // FOCUS NEW CENTER
        // =================================================

        if (map) {

            map.setView(

                [
                    numericLatitude,
                    numericLongitude
                ],

                15

            );

        }


        // =================================================
        // RESET + CLOSE
        // =================================================

        setTimeout(

            function () {

                const form =
                    document.getElementById(
                        "evacuationForm"
                    );


                if (form) {

                    form.reset();

                }


                closeEvacuationModal();

            },

            1000

        );

    }

    catch (error) {

        console.error(
            "Evacuation center registration error:",
            error
        );


        if (message) {

            message.textContent =
                error.message ||
                "Unable to register evacuation center.";

            message.className =
                "evac-message error";

        }

    }

    finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "🏠 REGISTER SAFE CENTER";

        }

    }

}


// =========================================================
// BUTTON INITIALIZATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =====================================================
        // RISK
        // =====================================================

        const riskButton =
            document.getElementById(
                "riskLayerBtn"
            );


        if (riskButton) {

            riskButton.addEventListener(
                "click",
                function () {

                    toggleLayer(
                        riskLayer,
                        this
                    );

                }
            );

        }


        // =====================================================
        // SENSOR
        // =====================================================

        const sensorButton =
            document.getElementById(
                "sensorLayerBtn"
            );


        if (sensorButton) {

            sensorButton.addEventListener(
                "click",
                function () {

                    toggleLayer(
                        sensorLayer,
                        this
                    );

                }
            );

        }


        // =====================================================
        // ROUTES
        // =====================================================

        const routeButton =
            document.getElementById(
                "routeLayerBtn"
            );


        if (routeButton) {

            routeButton.addEventListener(
                "click",
                function () {

                    toggleLayer(
                        routeLayer,
                        this
                    );

                }
            );

        }


        // =====================================================
        // EMERGENCY RESPONSE
        // =====================================================

        const dispatchButton =
            document.getElementById(
                "dispatchButton"
            );


        if (dispatchButton) {

            dispatchButton.addEventListener(
                "click",
                initiateEmergencyResponse
            );

        }


        // =====================================================
        // BROADCAST EVACUATION
        // =====================================================

        const evacuateButton =
            document.getElementById(
                "evacuateButton"
            );


        if (evacuateButton) {

            evacuateButton.addEventListener(
                "click",
                function () {

                    alert(

                        "EVACUATION ALERT READY\n\n" +

                        "Broadcast will be sent to affected residents."

                    );

                }
            );

        }


        // =====================================================
        // MESH
        // =====================================================

        const meshButton =
            document.getElementById(
                "meshButton"
            );


        if (meshButton) {

            meshButton.addEventListener(
                "click",
                function () {

                    alert(

                        "MESH NETWORK PING SENT\n\n" +

                        "Nearby nodes have been contacted."

                    );

                }
            );

        }


        // =====================================================
        // VIEW ALL INCIDENTS
        // =====================================================

        const viewAllButton =
            document.getElementById(
                "viewAllIncidents"
            );


        if (viewAllButton) {

            viewAllButton.addEventListener(
                "click",
                function () {

                    const incidentList =
                        document.getElementById(
                            "incident-list"
                        );


                    if (incidentList) {

                        incidentList.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });

                    }

                }
            );

        }


        // =====================================================
        // EVACUATION CENTER MANAGEMENT
        // =====================================================

        initializeShelterManagement();

        loadEvacuationCenters();

    }
);


// =========================================================
// LOAD EVACUATION CENTERS LIST
// =========================================================

async function loadEvacuationCenters() {

    try {

        const response =
            await fetch(
                "/api/evacuation-centers"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load evacuation centers."
            );

        }


        const data =
            await response.json();


        const centers =
            Array.isArray(
                data.centers
            )
                ? data.centers
                : [];


        const count =
            document.getElementById(
                "shelter-count"
            );


        if (count) {

            count.textContent =
                centers.length;

        }


        updateOfficerShelterList(
            centers
        );

    }

    catch (error) {

        console.error(
            "Load evacuation centers error:",
            error
        );

    }

}


// =========================================================
// AUTO REFRESH
// =========================================================

setInterval(

    async function () {

        if (
            refreshRunning
        ) {

            return;

        }


        refreshRunning =
            true;


        try {

            await Promise.all([

                loadDashboard(),

                loadRisk(),

                loadIncidents(),

                loadSensors(),

                loadShelter(),

                loadEvacuationCenters(),

                loadEvacuationCentersOnMap()

            ]);


            if (map) {

                setTimeout(
                    function () {

                        map.invalidateSize();

                    },
                    100
                );

            }


            console.log(
                "JAL SURAKSHA telemetry refreshed"
            );

        }

        catch (error) {

            console.error(
                "Refresh error:",
                error
            );

        }

        finally {

            refreshRunning =
                false;

        }

    },

    5000

);


// =========================================================
// START MAP
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeMap();

    }
);


// =========================================================
// BASIC HTML ESCAPE
// =========================================================

function escapeHtml(value) {

    return String(
        value === undefined ||
        value === null
            ? ""
            : value
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================================
// DEBUG
// =========================================================

console.log(
    "✅ JAL SURAKSHA Officer JS loaded."
);

console.log(
    "✅ Evacuation center management enabled."
);