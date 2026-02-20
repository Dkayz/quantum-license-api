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

  let body
  try {
    body = await request.json()
  } catch {
    return json({ status: "INVALID" }, 400)
  }

  const key = String(body.key || "").trim()
  const ip = String(body.ip || "").trim()
  const product = String(body.product || "").trim()

  if (!key || !ip || !product) {
    return json({ status: "INVALID" }, 200)
  }

  const raw = await env.LICENSES.get(key)

  if (!raw) {
    return json({ status: "INVALID" }, 200)
  }

  let record
  try {
    record = JSON.parse(raw)
  } catch {
    return json({ status: "INVALID" }, 200)
  }

  const isValid =
    record.status === "active" &&
    record.key === key &&
    record.ip === ip &&
    record.product === product

  return json({ status: isValid ? "VALID" : "INVALID" }, 200)
}
