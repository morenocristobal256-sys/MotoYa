// MotoYa: valida Turnstile en servidor antes de insertar el pre-registro.
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://morenocristobal256-sys.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405);

  try {
    const body = await req.json();
    const token = typeof body.token === "string" ? body.token : "";
    const payload = body.payload ?? {};

    if (!token || token.length > 2048) {
      return json({ error: "Falta la verificación de seguridad." }, 400);
    }

    const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!secret || !supabaseUrl || !anonKey) {
      console.error("Falta una variable de entorno requerida.");
      return json({ error: "Servicio temporalmente no disponible." }, 500);
    }

    const verifyForm = new FormData();
    verifyForm.append("secret", secret);
    verifyForm.append("response", token);
    const ip = req.headers.get("cf-connecting-ip");
    if (ip) verifyForm.append("remoteip", ip);

    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: verifyForm },
    );
    if (!verifyResponse.ok) {
      return json({ error: "No se pudo verificar el control de seguridad." }, 502);
    }

    const verification = await verifyResponse.json();
    if (!verification.success) {
      return json({ error: "La verificación expiró o no fue válida. Inténtalo otra vez." }, 403);
    }

    const allowedTypes = ["Socio conductor", "Usuario", "Comercio o negocio"];
    const clean = {
      tipo: String(payload.tipo ?? ""),
      nombre: String(payload.nombre ?? "").trim(),
      telefono: String(payload.telefono ?? "").trim(),
      zona: String(payload.zona ?? "").trim() || null,
      correo: String(payload.correo ?? "").trim() || null,
      detalle: String(payload.detalle ?? "").trim() || null,
      consentimiento: payload.consentimiento === true,
    };

    if (
      !allowedTypes.includes(clean.tipo) ||
      clean.nombre.length < 2 || clean.nombre.length > 100 ||
      clean.telefono.length < 5 || clean.telefono.length > 30 ||
      (clean.zona !== null && clean.zona.length > 120) ||
      (clean.correo !== null && clean.correo.length > 254) ||
      (clean.detalle !== null && clean.detalle.length > 1000) ||
      !clean.consentimiento
    ) {
      return json({ error: "Revisa los datos del formulario e inténtalo otra vez." }, 400);
    }

    const insertResponse = await fetch(
      `${supabaseUrl}/rest/v1/pre_registros`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": anonKey,
          "Authorization": `Bearer ${anonKey}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify(clean),
      },
    );

    if (!insertResponse.ok) {
      console.error("Error al guardar pre-registro:", insertResponse.status, await insertResponse.text());
      return json({ error: "No pudimos guardar tu pre-registro. Inténtalo más tarde." }, 502);
    }

    return json({ success: true });
  } catch (error) {
    console.error("Error interno en motoya-turnstile:", error);
    return json({ error: "Ocurrió un error. Inténtalo nuevamente." }, 500);
  }
});
