from flask import Flask, render_template, jsonify, request
from datetime import datetime


# =========================================================
# FLASK CONFIGURATION
# =========================================================

app = Flask(
    __name__,
    template_folder="../frontend",
    static_folder="../frontend",
    static_url_path="/static"
)


# =========================================================
# IN-MEMORY DATA
# =========================================================

citizen_reports = []

evacuation_centers = []


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def current_time():
    return datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )


def get_next_report_id():
    if not citizen_reports:
        return 1

    return max(
        int(report.get("id", 0))
        for report in citizen_reports
    ) + 1


def get_next_center_id():
    if not evacuation_centers:
        return 1

    return max(
        int(center.get("id", 0))
        for center in evacuation_centers
    ) + 1


# =========================================================
# MAIN PAGES
# =========================================================

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


@app.route("/officer")
def officer():

    return render_template(
        "officer.html"
    )


@app.route("/citizen")
def citizen():

    return render_template(
        "citizen.html"
    )


# =========================================================
# CSS ROUTE
# =========================================================

@app.route("/css/<path:filename>")
def css(filename):

    return app.send_static_file(
        "css/" + filename
    )


# =========================================================
# JAVASCRIPT ROUTE
# =========================================================

@app.route("/js/<path:filename>")
def javascript(filename):

    return app.send_static_file(
        "js/" + filename
    )


# =========================================================
# DASHBOARD API
# =========================================================

@app.route("/api/dashboard")
def dashboard():

    return jsonify({

        "active_incidents":
            7 + len(citizen_reports),

        "active_sensors":
            28,

        "risk_zones":
            4,

        "evacuation_centers":
            len(evacuation_centers)

    })


# =========================================================
# CURRENT RISK API
# =========================================================

@app.route("/api/risk")
def risk():

    # -----------------------------------------------------
    # Calculate risk from citizen reports
    # -----------------------------------------------------

    risk_score = 84

    if citizen_reports:

        severity_values = {

            "low": 25,

            "medium": 50,

            "high": 75,

            "critical": 95

        }

        recent_reports = citizen_reports[-10:]

        scores = []

        for report in recent_reports:

            severity = str(
                report.get(
                    "severity",
                    "medium"
                )
            ).lower()

            scores.append(
                severity_values.get(
                    severity,
                    50
                )
            )

        if scores:

            report_risk = max(scores)

            risk_score = max(
                risk_score,
                report_risk
            )

    # -----------------------------------------------------
    # Risk level
    # -----------------------------------------------------

    if risk_score >= 85:

        risk_level = "CRITICAL"

    elif risk_score >= 70:

        risk_level = "HIGH"

    elif risk_score >= 45:

        risk_level = "ELEVATED"

    else:

        risk_level = "LOW"

    # -----------------------------------------------------
    # Message
    # -----------------------------------------------------

    if risk_level == "CRITICAL":

        message = (
            "Critical flood risk detected. "
            "Immediate emergency response may be required."
        )

    elif risk_level == "HIGH":

        message = (
            "High flood risk detected. "
            "Residents in low-lying areas should "
            "prepare for evacuation."
        )

    elif risk_level == "ELEVATED":

        message = (
            "Elevated environmental risk detected. "
            "Residents should remain alert."
        )

    else:

        message = (
            "Current environmental conditions "
            "are within safer levels."
        )

    return jsonify({

        "location":
            "Ward 42",

        "risk_index":
            risk_score,

        "risk_level":
            risk_level,

        "message":
            message

    })


# =========================================================
# INCIDENT API
# =========================================================

@app.route("/api/incidents")
def incidents():

    incidents_list = []

    # -----------------------------------------------------
    # Add citizen reports
    # -----------------------------------------------------

    for report in citizen_reports:

        severity = str(
            report.get(
                "severity",
                "medium"
            )
        ).lower()

        # -------------------------------------------------
        # Priority
        # -------------------------------------------------

        if severity == "critical":

            priority = "P1"
            water_level = 90

        elif severity == "high":

            priority = "P1"
            water_level = 75

        elif severity == "medium":

            priority = "P2"
            water_level = 55

        else:

            priority = "P3"
            water_level = 35

        # -------------------------------------------------
        # Incident
        # -------------------------------------------------

        incident = {

            "id":
                report.get("id"),

            "location":
                report.get(
                    "location",
                    "Unknown location"
                ),

            "type":
                report.get(
                    "type",
                    "Unknown"
                ),

            "incident_type":
                report.get(
                    "incident_type",
                    report.get(
                        "type",
                        "Unknown"
                    )
                ),

            "severity":
                report.get(
                    "severity",
                    "medium"
                ),

            "water_level":
                water_level,

            "priority":
                priority,

            "description":
                report.get(
                    "description",
                    ""
                ),

            "source":
                report.get(
                    "source",
                    "CITIZEN"
                ),

            "reported_at":
                report.get(
                    "reported_at"
                ),

            "status":
                report.get(
                    "status",
                    "NEW"
                ),

            "status_updated_at":
                report.get(
                    "status_updated_at"
                ),

            "latitude":
                report.get(
                    "latitude"
                ),

            "longitude":
                report.get(
                    "longitude"
                )

        }

        incidents_list.insert(
            0,
            incident
        )

    return jsonify({

        "incidents":
            incidents_list,

        "count":
            len(incidents_list)

    })


# =========================================================
# UPDATE INCIDENT STATUS
# =========================================================

@app.route(
    "/api/incidents/<int:incident_id>/status",
    methods=["POST"]
)
def update_incident_status(
    incident_id
):

    data = request.get_json(
        silent=True
    ) or {}

    new_status = str(
        data.get(
            "status",
            ""
        )
    ).upper().strip()

    allowed_statuses = [

        "NEW",

        "ACKNOWLEDGED",

        "DISPATCHED",

        "IN PROGRESS",

        "RESOLVED"

    ]

    if new_status not in allowed_statuses:

        return jsonify({

            "success":
                False,

            "message":
                "Invalid status."

        }), 400

    for report in citizen_reports:

        if int(
            report.get("id", -1)
        ) == incident_id:

            report["status"] = new_status

            report["status_updated_at"] = (
                current_time()
            )

            print(
                f"Incident {incident_id} "
                f"→ {new_status}"
            )

            return jsonify({

                "success":
                    True,

                "message":
                    "Incident status updated successfully.",

                "incident":
                    report

            })

    return jsonify({

        "success":
            False,

        "message":
            "Incident not found."

    }), 404


# =========================================================
# SENSOR API
# =========================================================

@app.route("/api/sensors")
def sensors():

    return jsonify({

        "sensors": [

            {

                "id": "#12",

                "type": "Water Level",

                "location": "Ward 42",

                "value": 84,

                "unit": "%",

                "status": "CRITICAL"

            },

            {

                "id": "#08",

                "type": "Rainfall",

                "location": "North Ridge",

                "value": 62,

                "unit": "mm/h",

                "status": "WARNING"

            },

            {

                "id": "#21",

                "type": "Water Level",

                "location": "Sector 18",

                "value": 34,

                "unit": "%",

                "status": "NORMAL"

            },

            {

                "id": "#17",

                "type": "Drain Flow",

                "location": "Market Road",

                "value": 47,

                "unit": "%",

                "status": "WARNING"

            }

        ]

    })


# =========================================================
# SHELTER API - LEGACY / DEFAULT
# =========================================================

@app.route("/api/shelter")
def shelter():

    # -----------------------------------------------------
    # If officer has added centers, return first center
    # -----------------------------------------------------

    if evacuation_centers:

        center = evacuation_centers[0]

        return jsonify({

            "name":
                center["name"],

            "route_status":
                "Route Clear",

            "distance":
                1.8,

            "capacity":
                center["capacity"],

            "occupied":
                center["occupied"],

            "available":
                center["available"],

            "status":
                center["status"],

            "latitude":
                center["latitude"],

            "longitude":
                center["longitude"]

        })

    # -----------------------------------------------------
    # Default demo shelter
    # -----------------------------------------------------

    return jsonify({

        "name":
            "Community Center",

        "route_status":
            "Route Clear",

        "distance":
            1.8,

        "capacity":
            150,

        "occupied":
            62,

        "available":
            88,

        "status":
            "OPEN",

        "latitude":
            17.3850,

        "longitude":
            78.4867

    })


# =========================================================
# EVACUATION CENTERS - GET
# =========================================================

@app.route(
    "/api/evacuation-centers",
    methods=["GET"]
)
def get_evacuation_centers():

    return jsonify({

        "success":
            True,

        "count":
            len(evacuation_centers),

        "centers":
            evacuation_centers

    })


# =========================================================
# EVACUATION CENTERS - ADD
# =========================================================

@app.route(
    "/api/evacuation-centers",
    methods=["POST"]
)
def add_evacuation_center():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        # -------------------------------------------------
        # GET DATA
        # -------------------------------------------------

        name = str(
            data.get(
                "name",
                ""
            )
        ).strip()

        location = str(
            data.get(
                "location",
                ""
            )
        ).strip()

        capacity = data.get(
            "capacity",
            0
        )

        latitude = data.get(
            "latitude"
        )

        longitude = data.get(
            "longitude"
        )

        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not name:

            return jsonify({

                "success":
                    False,

                "message":
                    "Center name is required."

            }), 400

        if not location:

            return jsonify({

                "success":
                    False,

                "message":
                    "Location is required."

            }), 400

        if latitude is None:

            return jsonify({

                "success":
                    False,

                "message":
                    "Latitude is required."

            }), 400

        if longitude is None:

            return jsonify({

                "success":
                    False,

                "message":
                    "Longitude is required."

            }), 400

        try:

            capacity = int(
                capacity
            )

        except:

            return jsonify({

                "success":
                    False,

                "message":
                    "Capacity must be a number."

            }), 400

        if capacity <= 0:

            return jsonify({

                "success":
                    False,

                "message":
                    "Capacity must be greater than zero."

            }), 400

        try:

            latitude = float(
                latitude
            )

            longitude = float(
                longitude
            )

        except:

            return jsonify({

                "success":
                    False,

                "message":
                    "Latitude and longitude must be numbers."

            }), 400

        if latitude < -90 or latitude > 90:

            return jsonify({

                "success":
                    False,

                "message":
                    "Invalid latitude."

            }), 400

        if longitude < -180 or longitude > 180:

            return jsonify({

                "success":
                    False,

                "message":
                    "Invalid longitude."

            }), 400

        # -------------------------------------------------
        # CREATE CENTER
        # -------------------------------------------------

        center = {

            "id":
                get_next_center_id(),

            "name":
                name,

            "location":
                location,

            "capacity":
                capacity,

            "occupied":
                0,

            "available":
                capacity,

            "status":
                "OPEN",

            "latitude":
                latitude,

            "longitude":
                longitude,

            "created_at":
                current_time()

        }

        evacuation_centers.append(
            center
        )

        print(
            "\n========================================"
        )

        print(
            "       EVACUATION CENTER ADDED"
        )

        print(
            "========================================"
        )

        print(
            f"Center ID : {center['id']}"
        )

        print(
            f"Name      : {center['name']}"
        )

        print(
            f"Location  : {center['location']}"
        )

        print(
            f"Capacity  : {center['capacity']}"
        )

        print(
            f"Latitude  : {center['latitude']}"
        )

        print(
            f"Longitude : {center['longitude']}"
        )

        print(
            "========================================\n"
        )

        return jsonify({

            "success":
                True,

            "message":
                "Evacuation center added successfully.",

            "center":
                center

        }), 201

    except Exception as error:

        print(
            "Evacuation center error:",
            error
        )

        return jsonify({

            "success":
                False,

            "message":
                "Server error while adding evacuation center."

        }), 500


# =========================================================
# DELETE EVACUATION CENTER
# =========================================================

@app.route(
    "/api/evacuation-centers/<int:center_id>",
    methods=["DELETE"]
)
def delete_evacuation_center(
    center_id
):

    for center in evacuation_centers:

        if int(
            center.get("id", -1)
        ) == center_id:

            evacuation_centers.remove(
                center
            )

            return jsonify({

                "success":
                    True,

                "message":
                    "Evacuation center removed."

            })

    return jsonify({

        "success":
            False,

        "message":
            "Evacuation center not found."

    }), 404


# =========================================================
# CITIZEN REPORT API
# =========================================================

@app.route(
    "/api/citizen-report",
    methods=["POST"]
)
def citizen_report():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        location = str(
            data.get(
                "location",
                ""
            )
        ).strip()

        incident_type = str(
            data.get(
                "incident_type",
                ""
            )
        ).strip()

        severity = str(
            data.get(
                "severity",
                ""
            )
        ).strip().lower()

        description = str(
            data.get(
                "description",
                ""
            )
        ).strip()

        latitude = data.get(
            "latitude"
        )

        longitude = data.get(
            "longitude"
        )

        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not location:

            return jsonify({

                "success":
                    False,

                "message":
                    "Location is required."

            }), 400

        if not incident_type:

            return jsonify({

                "success":
                    False,

                "message":
                    "Incident type is required."

            }), 400

        if severity not in [

            "low",

            "medium",

            "high",

            "critical"

        ]:

            return jsonify({

                "success":
                    False,

                "message":
                    "Invalid severity."

            }), 400

        # -------------------------------------------------
        # CREATE REPORT
        # -------------------------------------------------

        report = {

            "id":
                get_next_report_id(),

            "location":
                location,

            "type":
                incident_type,

            "incident_type":
                incident_type,

            "severity":
                severity,

            "description":
                description,

            "source":
                "CITIZEN",

            "status":
                "NEW",

            "latitude":
                latitude,

            "longitude":
                longitude,

            "reported_at":
                current_time(),

            "status_updated_at":
                current_time()

        }

        citizen_reports.append(
            report
        )

        print(
            "\n========================================"
        )

        print(
            "       NEW CITIZEN HAZARD REPORT"
        )

        print(
            "========================================"
        )

        print(
            f"Report ID   : {report['id']}"
        )

        print(
            f"Location    : {report['location']}"
        )

        print(
            f"Incident    : {report['incident_type']}"
        )

        print(
            f"Severity    : {report['severity']}"
        )

        print(
            f"Description : {report['description']}"
        )

        print(
            f"Latitude    : {report['latitude']}"
        )

        print(
            f"Longitude   : {report['longitude']}"
        )

        print(
            f"Status      : {report['status']}"
        )

        print(
            "========================================\n"
        )

        return jsonify({

            "success":
                True,

            "message":
                "Emergency report received successfully.",

            "report":
                report

        }), 201

    except Exception as error:

        print(
            "Citizen report error:",
            error
        )

        return jsonify({

            "success":
                False,

            "message":
                "Server error while processing report."

        }), 500


# =========================================================
# SOS EMERGENCY API
# =========================================================

@app.route(
    "/api/sos",
    methods=["POST"]
)
def sos_emergency():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        latitude = data.get(
            "latitude"
        )

        longitude = data.get(
            "longitude"
        )

        location = str(
            data.get(
                "location",
                "Citizen GPS Location"
            )
        ).strip()

        report = {

            "id":
                get_next_report_id(),

            "location":
                location,

            "type":
                "SOS EMERGENCY",

            "incident_type":
                "SOS EMERGENCY",

            "severity":
                "critical",

            "description":
                "Citizen requested immediate emergency assistance.",

            "source":
                "SOS",

            "status":
                "NEW",

            "latitude":
                latitude,

            "longitude":
                longitude,

            "reported_at":
                current_time(),

            "status_updated_at":
                current_time()

        }

        citizen_reports.append(
            report
        )

        print(
            "\n========================================"
        )

        print(
            "          SOS EMERGENCY"
        )

        print(
            "========================================"
        )

        print(
            f"Report ID : {report['id']}"
        )

        print(
            f"Location  : {report['location']}"
        )

        print(
            f"Latitude  : {report['latitude']}"
        )

        print(
            f"Longitude : {report['longitude']}"
        )

        print(
            f"Status    : {report['status']}"
        )

        print(
            "========================================\n"
        )

        return jsonify({

            "success":
                True,

            "message":
                "SOS emergency request received.",

            "report":
                report

        }), 201

    except Exception as error:

        print(
            "SOS error:",
            error
        )

        return jsonify({

            "success":
                False,

            "message":
                "Server error while processing SOS."

        }), 500


# =========================================================
# GET ALL CITIZEN REPORTS
# =========================================================

@app.route(
    "/api/citizen-reports"
)
def get_citizen_reports():

    return jsonify({

        "count":
            len(citizen_reports),

        "reports":
            citizen_reports

    })


# =========================================================
# CITIZEN CURRENT INCIDENT
# =========================================================

@app.route(
    "/api/citizen-current-incident"
)
def citizen_current_incident():

    if not citizen_reports:

        return jsonify({

            "success":
                True,

            "has_incident":
                False,

            "incident":
                None

        })

    latest_report = citizen_reports[-1]

    return jsonify({

        "success":
            True,

        "has_incident":
            True,

        "incident":
            latest_report

    })


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route(
    "/api/health"
)
def health():

    return jsonify({

        "status":
            "ONLINE",

        "service":
            "JAL SURAKSHA",

        "citizen_reports":
            len(citizen_reports),

        "evacuation_centers":
            len(evacuation_centers)

    })


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    print("\n========================================")
    print("        JAL SURAKSHA SERVER")
    print("========================================")
    print("Officer: http://127.0.0.1:5000/officer")
    print("Citizen: http://127.0.0.1:5000/citizen")
    print("========================================\n")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )