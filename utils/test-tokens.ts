const secrets ={
    CLOUDFLARE_API_TOKEN: Deno.env.get("CLOUDFLARE_API_TOKEN")
}

console.log(`[cf-api] API token: ${secrets.CLOUDFLARE_API_TOKEN}`)
const cfApi = await fetch("https://api.cloudflare.com/client/v4/user/tokens/verify", {
    headers: {
        "Authorization": `Bearer ${secrets.CLOUDFLARE_API_TOKEN}`,
        "Accept": `application/json`
    }
})

console.log(`[cf-api] API response status code: ${cfApi.status}`)
console.log(`[cf-api] API response JSON: ${JSON.stringify(await cfApi.json())}`)

if (cfApi.status !== 200) {
    throw new Error("Some of the API token checks failed, check token and rotate if expired/revoked", {
        cause: "AuthFailure"
    })
}