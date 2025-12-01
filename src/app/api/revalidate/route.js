
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("📩 Webhook recibido:", body);

    if (body.full_slug) {
      const slug = body.full_slug;

      console.log("🔄 Revalidando:", slug);
      revalidatePath(`/${slug}`);

      if (slug === "home" || slug === "") {
        console.log("🏠 Revalidando /");
        revalidatePath('/');
      }
    }

    return NextResponse.json({
      revalidated: true,
      message: "Revalidation OK"
    });

  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return NextResponse.json(
      {
        error: "Revalidation failed",
        details: error.message
      },
      { status: 500 }
    );
  }
}
