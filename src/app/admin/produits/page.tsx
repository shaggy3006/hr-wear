"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight, Upload, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/lib/types";

const EMPTY_FORM = {
  name: "", slug: "", description: "", price: "", original_price: "",
  stock: "", images: [] as string[], is_active: true, is_featured: false,
};

export default function AdminProduits() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(true); setUploadError(""); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, slug: p.slug, description: p.description || "",
      price: String(p.price), original_price: String(p.original_price || ""),
      stock: String(p.stock), images: p.images || [],
      is_active: p.is_active, is_featured: p.is_featured,
    });
    setEditing(p.id);
    setShowForm(true);
    setUploadError("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");
    const supabase = createClient();
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      // Vérification taille (max 5 MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image trop lourde (max 5 MB).");
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(filename, file, { cacheControl: "3600", upsert: false });

      if (error) {
        setUploadError("Erreur upload : " + error.message);
      } else {
        const { data: urlData } = supabase.storage.from("products").getPublicUrl(filename);
        newUrls.push(urlData.publicUrl);
      }
    }

    setForm((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      description: form.description || null,
      price: parseInt(form.price),
      original_price: form.original_price ? parseInt(form.original_price) : null,
      stock: parseInt(form.stock) || 0,
      images: form.images,
      is_active: form.is_active,
      is_featured: form.is_featured,
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      await supabase.from("products").update(payload).eq("id", editing);
    } else {
      await supabase.from("products").insert(payload);
    }
    await fetchProducts();
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    await fetchProducts();
  };

  const toggleActive = async (p: Product) => {
    const supabase = createClient();
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    await fetchProducts();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-medium text-hr-dark tracking-widest">PRODUITS ({products.length})</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-hr-dark text-white text-[11px] px-3 py-2 rounded-sm hover:bg-hr-brown"
        >
          <Plus size={13} /> Ajouter
        </button>
      </div>

      {/* Liste produits */}
      <div className="bg-white border border-hr-border rounded-lg overflow-hidden">
        <div className="divide-y divide-hr-border">
          {products.length === 0 ? (
            <p className="px-5 py-10 text-xs text-hr-hint text-center">Aucun produit. Ajoutez-en un !</p>
          ) : (
            products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-12 h-12 bg-hr-warm rounded overflow-hidden flex items-center justify-center shrink-0">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={18} className="text-hr-hint" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-hr-dark truncate">{p.name}</p>
                    {!p.is_active && (
                      <span className="text-[9px] text-hr-hint border border-hr-border px-1.5 py-0.5 rounded-sm">MASQUÉ</span>
                    )}
                    {p.is_featured && (
                      <span className="text-[9px] text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-sm">VED.</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-hr-dark font-medium">{p.price.toLocaleString()} DA</span>
                    {p.original_price && (
                      <span className="text-[11px] text-hr-hint line-through">{p.original_price.toLocaleString()}</span>
                    )}
                    <span className="text-[11px] text-hr-hint">· Stock : {p.stock}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive(p)} className="text-hr-hint hover:text-hr-dark">
                    {p.is_active ? <ToggleRight size={18} className="text-green-600" /> : <ToggleLeft size={18} />}
                  </button>
                  <button onClick={() => openEdit(p)} className="text-hr-hint hover:text-hr-dark p-1">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-hr-hint hover:text-hr-promo p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-hr-border w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-hr-border sticky top-0 bg-white z-10">
              <h3 className="text-xs font-medium text-hr-dark tracking-widest">
                {editing ? "MODIFIER PRODUIT" : "AJOUTER PRODUIT"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-hr-hint hover:text-hr-dark">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">

              {/* Upload photos */}
              <div>
                <label className="block text-[10px] text-hr-hint tracking-widest mb-2">PHOTOS DU PRODUIT</label>

                {/* Aperçu des images */}
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.images.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded overflow-hidden border border-hr-border group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Zone d'upload */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full border-2 border-dashed border-hr-border rounded-lg py-6 flex flex-col items-center gap-2 text-hr-hint hover:border-hr-brown hover:text-hr-brown transition-colors disabled:opacity-50"
                >
                  <Upload size={20} />
                  <span className="text-xs">
                    {uploading ? "Envoi en cours..." : "Cliquer pour ajouter des photos"}
                  </span>
                  <span className="text-[10px] text-hr-hint">JPG, PNG, WEBP · max 5 MB</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-[10px] text-hr-hint tracking-widest mb-1">NOM *</label>
                <input
                  type="text" value={form.name} required placeholder="Snapback Premium"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-hr-border rounded px-3 py-2 text-sm text-hr-dark focus:outline-none focus:border-hr-brown"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[10px] text-hr-hint tracking-widest mb-1">SLUG (URL)</label>
                <input
                  type="text" value={form.slug} placeholder="snapback-premium (auto si vide)"
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full border border-hr-border rounded px-3 py-2 text-sm text-hr-dark focus:outline-none focus:border-hr-brown"
                />
              </div>

              {/* Prix */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-hr-hint tracking-widests mb-1">PRIX (DA) *</label>
                  <input
                    type="number" value={form.price} required placeholder="2500"
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-hr-border rounded px-3 py-2 text-sm text-hr-dark focus:outline-none focus:border-hr-brown"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-hr-hint tracking-widests mb-1">PRIX BARRÉ (promo)</label>
                  <input
                    type="number" value={form.original_price} placeholder="3000"
                    onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                    className="w-full border border-hr-border rounded px-3 py-2 text-sm text-hr-dark focus:outline-none focus:border-hr-brown"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-[10px] text-hr-hint tracking-widests mb-1">STOCK *</label>
                <input
                  type="number" value={form.stock} required placeholder="10"
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-hr-border rounded px-3 py-2 text-sm text-hr-dark focus:outline-none focus:border-hr-brown"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] text-hr-hint tracking-widests mb-1">DESCRIPTION</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} placeholder="Description du produit..."
                  className="w-full border border-hr-border rounded px-3 py-2 text-sm text-hr-dark focus:outline-none focus:border-hr-brown resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox" checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-xs text-hr-dark">Visible sur le site</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox" checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-xs text-hr-dark">En vedette (accueil)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-hr-border text-hr-muted text-xs py-2.5 rounded-sm hover:bg-hr-warm"
                >
                  Annuler
                </button>
                <button
                  type="submit" disabled={saving || uploading}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-hr-dark text-white text-xs py-2.5 rounded-sm hover:bg-hr-brown disabled:opacity-60"
                >
                  <Check size={13} /> {saving ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
