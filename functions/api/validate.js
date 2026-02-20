export async function onRequestPost(context) {
  const data = await context.request.json()

  // Licenças cadastradas (por enquanto manual)
  const licenses = [
    { key: "QS-ABC123-001", ip: "123.123.123.123", status: "active" }
  ]

  const found = licenses.find(l =>
    l.key === data.key &&
    l.ip === data.ip &&
    l.status === "active"
  )

  return new Response(JSON.stringify({ status: found ? "VALID" : "INVALID" }), {
    headers: { "Content-Type": "application/json" }
  })
}
