function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  })
}

export async function onRequestOptions() {
  return json({ ok: true }, 204)
}

function getBearerToken(authHeader = "") {
  // aceita variações de espaços e capitalização
  const match = authHeader.match(/^\s*Bearer\s+(.+)\s*$/i)
  return match ? match[1].trim() : ""
}

export async function onRequestPost(context) {
  const { env, request } = context

  const auth = request.headers.get("Authorization") || request.headers.get("authorization") || ""
  const incomingToken = getBearerToken(auth)
  const expectedToken = String(env.ADMIN_TOKEN || "").trim()

  if (!incomingToken) {
    return json({ ok: false, error: "MISSING_BEARER" }, 401)
  }

  if (!expectedToken) {
    return json({ ok: false, error: "SERVER_MISCONFIGURED_NO_ADMIN_TOKEN" }, 500)
  }

  if (incomingToken !== expectedToken) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: "INVALID_JSON" }, 400)
  }

  const key = String(body.key || "").trim()
  const ip = String(body.ip || "").trim()
  const product = String(body.product || "emotes_menu").trim()
  const status = String(body.status || "active").trim()

  if (!key || !ip) {
    return json({ ok: false, error: "MISSING_KEY_OR_IP" }, 400)
  }

  const record = { key, ip, product, status, createdAt: new Date().toISOString() }

  await env.LICENSES.put(key, JSON.stringify(record))

  return json({ ok: true, saved: record })
}
