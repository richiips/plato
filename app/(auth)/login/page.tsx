import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Ingresar</h1>
          <p className="mt-1 text-sm text-zinc-500">Accedé a tu panel de Plato</p>
        </div>

        <form action={signIn} className="space-y-4">
          <ErrorMessage searchParams={searchParams} />

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
}

async function ErrorMessage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (!error) return null;
  return (
    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
      Email o contraseña incorrectos.
    </div>
  );
}
