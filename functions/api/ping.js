export async function onRequestGet({ env }) {
  const hasToken = !!env.ADMIN_TOKEN
  const hasKV = !!env.LICENSES

  return new Response(
    JSON.stringify({ ok: true, hasToken, hasKV }),
    { headers: { "Content-Type": "application/json" } }
  )
}
