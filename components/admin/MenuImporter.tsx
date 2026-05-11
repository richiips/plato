"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, ClipboardPaste, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { importMenu } from "@/lib/actions/menu";
import type { ImportMenuState } from "@/lib/actions/menu";

const EXAMPLE_PROMPT = `Genera un menú para un restaurante en formato JSON estricto. Usa esta estructura exacta:

{
  "categories": [
    {
      "name": "Nombre de categoría",
      "items": [
        {
          "name": "Nombre del plato",
          "description": "Descripción breve",
          "price": 9900
        }
      ]
    }
  ]
}

Reglas:
- El precio debe ser un número entero (sin decimales, en centavos o la moneda local sin símbolo)
- Responde SOLO con el JSON, sin texto adicional
- No uses markdown ni bloques de código`;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Importar menú
    </Button>
  );
}

export function MenuImporter({
  restaurantId,
  currency,
}: {
  restaurantId: string;
  currency: string;
}) {
  const bound = importMenu.bind(null, restaurantId, currency);
  const [state, formAction] = useActionState<ImportMenuState, FormData>(bound, {});
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-background p-6 space-y-4">
      <div>
        <h2 className="text-sm font-semibold">Importar menú desde JSON</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Pedile a Claude que genere el menú y pegá el JSON aquí.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowPrompt((v) => !v)}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        {showPrompt ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        Ver prompt para Claude
      </button>

      {showPrompt && (
        <pre className="rounded-lg border border-border bg-muted/50 p-4 text-xs whitespace-pre-wrap leading-relaxed">
          {EXAMPLE_PROMPT}
        </pre>
      )}

      <form action={formAction} className="space-y-3">
        <Textarea
          name="json"
          rows={10}
          placeholder={'{\n  "categories": [\n    {\n      "name": "Entradas",\n      "items": [...]\n    }\n  ]\n}'}
          className="font-mono text-xs"
          required
        />

        {state.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        {state.message && (
          <p className="text-sm text-green-600">{state.message}</p>
        )}

        <div className="flex items-center gap-2">
          <SubmitButton />
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ClipboardPaste className="h-3 w-3" />
            Se añade al menú existente
          </span>
        </div>
      </form>
    </div>
  );
}
