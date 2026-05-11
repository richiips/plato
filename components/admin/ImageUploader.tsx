"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  name: string;
  defaultValue?: string | null;
  label?: string;
}

export function ImageUploader({ name, defaultValue, label = "Imagen" }: ImageUploaderProps) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Máximo 10 MB.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Get one-time Cloudflare upload URL
      const tokenRes = await fetch("/api/cloudflare/upload-url", { method: "POST" });
      if (!tokenRes.ok) throw new Error("No se pudo obtener URL de subida.");
      const { uploadURL, deliveryUrl } = await tokenRes.json();

      // Upload directly to Cloudflare
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch(uploadURL, { method: "POST", body: form });
      if (!uploadRes.ok) throw new Error("Error al subir la imagen.");

      setUrl(deliveryUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {/* Hidden field submitted with the form */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="group relative inline-block">
          <Image
            src={url}
            alt={label}
            width={200}
            height={133}
            className="rounded-lg object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-1.5 top-1.5 hidden rounded-full bg-black/60 p-0.5 text-white group-hover:flex"
            aria-label="Eliminar imagen"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-28 w-48 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          <span className="text-xs">{uploading ? "Subiendo…" : label}</span>
        </button>
      )}

      {url && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          Cambiar
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
