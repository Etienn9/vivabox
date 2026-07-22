// =============================
// HELPERS (CRITICAL)
// =============================

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}

function failResponse(error, detail = "") {
  // Ne pas inclure detail dans la réponse
  return jsonResponse({ ok: false, error })
}

// =============================
// ENTRY
// =============================

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return failResponse("EMPTY_BODY")
    }

    let body

    try {
      body = JSON.parse(e.postData.contents)
    } catch (parseErr) {
      return failResponse("INVALID_JSON")
    }

    const action = body.action
    const payload = body.payload || body

    if (!action) {
      return failResponse("NO_ACTION")
    }

    let result

    switch (action) {
      case "start":
        result = checkout_start(payload)
        break
      case "pay":
        result = checkout_pay(payload)
        break
      case "complete":
        result = checkout_complete(payload)
        break
      case "activate_code":
        result = activate_code(payload)
        break
      case "verify_access":
        result = verify_access(payload)
        break
      case "validate_session":
        result = validate_session(payload)
        break
      // =============================
      // NOUVELLES ACTIONS POUR LA REFACTORISATION
      // =============================
      case "get_codigo_context":
        // Appelle la fonction centrale qui lit l'état du code
        result = getCodigoContext(payload.codigo)
        // Transformation pour garder le format { success, data } uniforme
        if (result && !result.hasOwnProperty('success')) {
          result = success(result)
        } else if (!result) {
          result = error("CODIGO_NOT_FOUND")
        }
        break
      case "create_booking":
        result = create_booking(payload)
        break
      case "get_booking":
        // Optionnel : pour récupérer une réservation par son ID
        result = getBookingById(payload.bookingId)
        break
      default:
        Logger.log("INVALID ACTION: " + action)
        return failResponse("INVALID_ACTION")
    }

    // On évite de logger les payloads sensibles (seulement l'action et un statut)
    Logger.log("ACTION: " + action + " | SUCCESS: " + (result?.ok ?? result?.success))
    return jsonResponse(result)

  } catch (err) {
    Logger.log("SERVER ERROR: " + err.message)
    return jsonResponse({ ok: false, error: "SERVER_ERROR" })
  }
}