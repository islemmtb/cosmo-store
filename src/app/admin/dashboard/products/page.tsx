'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Search, Loader2, X, Image as ImageIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const fmt = (n: number) => new Intl.NumberFormat('fr-DZ').format(n) + ' DZD';

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

const EMPTY_FORM = {
  name: '', slug: '', description: '', price_unit: 0, price_box: 0,
  units_per_box: 1, min_units: 1, stock: 0,
  category: '', brand: '', featured: false, active: true, images: [] as string[],
};

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token = () => localStorage.getItem('admin-token');
  const headers = () => ({ Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' });

  const load = async () => {
    const res = await fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token()}` } });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ ...p });
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: editing ? f.slug : slugify(name) }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price_unit) { toast.error('Nom et prix obligatoires'); return; }
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      const res = await fetch('/api/admin/products', { method, headers: headers(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      await load();
      setModalOpen(false);
      toast.success(editing ? 'Produit mis à jour' : 'Produit créé');
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    if (res.ok) { await load(); toast.success('Produit supprimé'); }
    else toast.error('Erreur lors de la suppression');
  };

  const toggleActive = async (p: any) => {
    const res = await fetch('/api/admin/products', { method: 'PUT', headers: headers(), body: JSON.stringify({ id: p.id, active: !p.active }) });
    if (res.ok) await load();
  };

  const toggleFeatured = async (p: any) => {
    const res = await fetch('/api/admin/products', { method: 'PUT', headers: headers(), body: JSON.stringify({ id: p.id, featured: !p.featured }) });
    if (res.ok) await load();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('files', f));
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: formData });
      const data = await res.json();
      if (data.urls) setForm(f => ({ ...f, images: [...f.images, ...data.urls] }));
      else toast.error(data.error || 'Erreur upload');
    } catch { toast.error('Erreur upload images'); }
    finally { setUploading(false); }
  };

  const removeImage = (url: string) => setForm(f => ({ ...f, images: f.images.filter(i => i !== url) }));

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-700" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" className="input-field pl-9 py-2" />
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nouveau produit
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-rose-deep" size={32} /></div>
      ) : (
        <div className="bg-white border border-cream-200 overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-xs text-espresso-700 uppercase tracking-wide">
                <th className="text-left px-4 py-3">Produit</th>
                <th className="text-right px-4 py-3">Prix unité</th>
                <th className="text-right px-4 py-3">Prix boîte</th>
                <th className="text-right px-4 py-3">Stock</th>
                <th className="text-center px-4 py-3">Actif</th>
                <th className="text-center px-4 py-3">Vedette</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover border border-cream-200" />
                      ) : (
                        <div className="w-10 h-10 bg-cream-100 flex items-center justify-center border border-cream-200">
                          <ImageIcon size={14} className="text-cream-200" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-espresso-900">{p.name}</p>
                        <p className="text-xs text-espresso-700">{p.brand || p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">{fmt(p.price_unit)}</td>
                  <td className="px-4 py-3 text-right">{fmt(p.price_box)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={p.stock === 0 ? 'text-red-600 font-medium' : p.stock < 10 ? 'text-orange-600' : 'text-green-700'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(p)} className={`p-1 transition-colors ${p.active ? 'text-green-600 hover:text-green-800' : 'text-gray-300 hover:text-gray-500'}`}>
                      {p.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleFeatured(p)} className={`p-1 transition-colors ${p.featured ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}>
                      <Star size={16} fill={p.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 border border-cream-200 hover:bg-cream-100 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 font-body text-espresso-700">Aucun produit trouvé</p>
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl my-4 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
              <h2 className="font-display text-xl text-espresso-900">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button onClick={() => setModalOpen(false)}><X size={22} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Nom du produit *</label>
                  <input className="input-field" value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Ex: Crème hydratante…" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">URL (slug)</label>
                  <input className="input-field font-mono text-sm" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="creme-hydratante" />
                  <p className="text-xs text-espresso-700 mt-1">URL: votresite.com/{form.slug || 'slug-produit'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Marque</label>
                  <input className="input-field" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="L'Oréal, Garnier…" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <input className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Soin, Maquillage…" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix par unité (DZD) *</label>
                  <input type="number" className="input-field" value={form.price_unit} onChange={e => setForm(f => ({ ...f, price_unit: +e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix par boîte (DZD)</label>
                  <input type="number" className="input-field" value={form.price_box} onChange={e => setForm(f => ({ ...f, price_box: +e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unités par boîte</label>
                  <input type="number" className="input-field" value={form.units_per_box} onChange={e => setForm(f => ({ ...f, units_per_box: +e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Commande minimum (unités)</label>
                  <input type="number" className="input-field" value={form.min_units} onChange={e => setForm(f => ({ ...f, min_units: +e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input type="number" className="input-field" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: +e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="input-field resize-none" rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="flex items-center gap-4 col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4" />
                    <span className="text-sm font-medium">Actif (visible en ligne)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4" />
                    <span className="text-sm font-medium">Produit vedette</span>
                  </label>
                </div>

                {/* Image upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Images</label>
                  <label className="flex items-center gap-2 border-2 border-dashed border-cream-200 p-4 cursor-pointer hover:border-rose-muted transition-colors">
                    <Upload size={18} className="text-espresso-700" />
                    <span className="font-body text-sm text-espresso-700">
                      {uploading ? 'Upload en cours…' : 'Cliquez pour ajouter des images'}
                    </span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {form.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.images.map(img => (
                        <div key={img} className="relative">
                          <img src={img} alt="" className="w-20 h-20 object-cover border border-cream-200" />
                          <button onClick={() => removeImage(img)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-cream-200 bg-cream-50">
              <button onClick={() => setModalOpen(false)} className="btn-outline flex-1">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editing ? 'Mettre à jour' : 'Créer le produit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
