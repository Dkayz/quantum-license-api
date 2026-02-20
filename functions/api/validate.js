export async function onRequestPost(context) {
  const data = await context.request.json()

  const licenses = [
    { ip: "123.123.123.123", status: "active" }
  ]

  const found = licenses.find(l => l.ip === data.ip && l.status === "active")

  if (found) {
    return new Response(JSON.stringify({ status: "VALID" }), {
      headers: { "Content-Type": "application/json" }
    })
  }

  return new Response(JSON.stringify({ status: "INVALID" }), {
    headers: { "Content-Type": "application/json" }
  })
}
