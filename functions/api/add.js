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

export async function onRequestPost(context) {
  const { env, request } = context

  const auth = request.headers.get("Authorization") || ""
  const expected = `Bearer ${env.ADMIN_TOKEN}`

  if (auth !== expected) {
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

  const record = {
    key,
    ip,
    product,
    status,
    createdAt: new Date().toISOString(),
  }

  await env.LICENSES.put(key, JSON.stringify(record))

  return json({ ok: true, saved: record })
}
