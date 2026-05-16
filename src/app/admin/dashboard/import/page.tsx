'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, Check, X, AlertCircle, Loader2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import toast from 'react-hot-toast';

type ImportRow = {
  _rowIndex: number;
  name: string;
  slug: string;
  description: string;
  price_unit: number;
  price_box: number;
  units_per_box: number;
  min_units: number;
  stock: number;
  category: string;
  brand: string;
  featured: boolean;
  active: boolean;
  selected: boolean;
  modified: boolean;
};

function slugify(text: string) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

function parseRow(row: any, index: number): ImportRow {
  const name = String(row['nom'] || row['name'] || row['produit'] || row['Nom'] || '').trim();
  return {
    _rowIndex: index,
    name,
    slug: slugify(name),
    description: String(row['description'] || row['Description'] || '').trim(),
    price_unit: parseFloat(row['prix_unite'] || row['prix unitaire'] || row['price_unit'] || row['Prix'] || row['prix'] || 0),
    price_box: parseFloat(row['prix_boite'] || row['prix boite'] || row['price_box'] || row['Prix Boite'] || 0),
    units_per_box: parseInt(row['unites_boite'] || row['unités/boite'] || row['units_per_box'] || row['Unités/Boite'] || 1),
    min_units: parseInt(row['min_commande'] || row['minimum'] || row['min_units'] || row['Min'] || 1),
    stock: parseInt(row['stock'] || row['Stock'] || row['quantite'] || row['Quantité'] || 0),
    category: String(row['categorie'] || row['catégorie'] || row['category'] || row['Categorie'] || '').trim(),
    brand: String(row['marque'] || row['brand'] || row['Marque'] || '').trim(),
    featured: ['oui', 'yes', 'true', '1'].includes(String(row['vedette'] || row['featured'] || '').toLowerCase()),
    active: !['non', 'no', 'false', '0'].includes(String(row['actif'] || row['active'] || 'oui').toLowerCase()),
    selected: true,
    modified: false,
  };
}

export default function AdminImport() {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const token = () => localStorage.getItem('admin-token');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFileName(file.name);
    setResults(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        const parsed = json.map((row: any, i) => parseRow(row, i));
        setRows(parsed);
        toast.success(`${parsed.length} produits importés depuis le fichier`);
      } catch (err) {
        toast.error('Erreur lors de la lecture du fichier Excel');
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'], 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  const updateRow = (index: number, field: keyof ImportRow, value: any) => {
    setRows(prev => prev.map(r => r._rowIndex === index ? { ...r, [field]: value, modified: true } : r));
  };

  const toggleSelect = (index: number) => {
    setRows(prev => prev.map(r => r._rowIndex === index ? { ...r, selected: !r.selected } : r));
  };

  const toggleAll = (val: boolean) => {
    setRows(prev => prev.map(r => ({ ...r, selected: val })));
  };

  const handleImport = async () => {
    const selected = rows.filter(r => r.selected && r.name);
    if (!selected.length) { toast.error('Aucun produit sélectionné'); return; }
    setImporting(true);
    const errors: string[] = [];
    let success = 0;

    for (const row of selected) {
      try {
        const { _rowIndex, selected: _s, modified: _m, ...product } = row;
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        if (!res.ok) {
          const err = await res.json();
          errors.push(`${row.name}: ${err.error || 'Erreur'}`);
        } else {
          success++;
        }
      } catch {
        errors.push(`${row.name}: Erreur réseau`);
      }
    }

    setResults({ success, errors });
    setImporting(false);
    if (success > 0) toast.success(`${success} produit(s) importé(s) avec succès`);
    if (errors.length) toast.error(`${errors.length} erreur(s)`);
  };

  const selectedCount = rows.filter(r => r.selected).length;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-cream-100 border border-cream-200 p-5">
        <h2 className="font-body font-semibold text-espresso-900 mb-2 flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-deep" /> Format du fichier Excel attendu
        </h2>
        <p className="font-body text-sm text-espresso-700 mb-3">Les colonnes suivantes sont reconnues automatiquement:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
          {[
            ['nom / name', 'Nom du produit'],
            ['prix_unite / prix', 'Prix par unité (DZD)'],
            ['prix_boite', 'Prix par boîte (DZD)'],
            ['stock / quantite', 'Quantité en stock'],
            ['marque / brand', 'Marque'],
            ['categorie', 'Catégorie'],
            ['unites_boite', 'Unités par boîte'],
            ['min_commande', 'Commande minimum'],
            ['description', 'Description'],
            ['vedette', 'Vedette (oui/non)'],
            ['actif', 'Actif (oui/non)'],
          ].map(([col, desc]) => (
            <div key={col} className="bg-white border border-cream-200 p-2">
              <span className="text-rose-deep">{col}</span>
              <span className="text-espresso-700 ml-1 font-sans not-italic">→ {desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-rose-deep bg-rose-deep/5' : 'border-cream-200 hover:border-rose-muted'
        }`}
      >
        <input {...getInputProps()} />
        <FileSpreadsheet size={40} className="mx-auto text-espresso-700 mb-4 opacity-50" />
        <p className="font-body font-medium text-espresso-900 mb-1">
          {isDragActive ? 'Déposez le fichier ici…' : 'Glissez votre fichier Excel ici'}
        </p>
        <p className="font-body text-sm text-espresso-700">ou cliquez pour sélectionner (.xlsx, .xls, .csv)</p>
        {fileName && (
          <p className="mt-3 text-sm font-body text-rose-deep font-medium">{fileName}</p>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className={`p-4 border font-body text-sm ${results.errors.length === 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
          <p className="font-semibold mb-1">✓ {results.success} produit(s) importé(s) avec succès</p>
          {results.errors.map((e, i) => <p key={i} className="text-red-600">✗ {e}</p>)}
        </div>
      )}

      {/* Table preview */}
      {rows.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="font-body font-semibold text-espresso-900">{rows.length} produits détectés</h2>
              <div className="flex gap-2">
                <button onClick={() => toggleAll(true)} className="text-xs font-body text-rose-deep hover:underline">Tout sélectionner</button>
                <span className="text-cream-200">|</span>
                <button onClick={() => toggleAll(false)} className="text-xs font-body text-espresso-700 hover:underline">Tout désélectionner</button>
              </div>
            </div>
            <button
              onClick={handleImport}
              disabled={importing || selectedCount === 0}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {importing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Importer {selectedCount > 0 ? `(${selectedCount})` : ''}
            </button>
          </div>

          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row._rowIndex} className={`bg-white border transition-colors ${row.selected ? 'border-espresso-900' : 'border-cream-200 opacity-60'}`}>
                {/* Row summary */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={row.selected}
                    onChange={() => toggleSelect(row._rowIndex)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-espresso-900 truncate">{row.name || <span className="text-red-500 italic">Nom manquant</span>}</p>
                    <p className="text-xs font-body text-espresso-700">{row.brand} {row.category && `• ${row.category}`}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-sm font-body">
                    <span className="text-espresso-900 font-medium">{row.price_unit.toLocaleString()} DZD/u.</span>
                    <span className="text-espresso-700">Stock: {row.stock}</span>
                    {row.modified && <span className="text-xs text-rose-deep bg-rose-deep/10 px-2 py-0.5">Modifié</span>}
                  </div>
                  <button
                    onClick={() => setExpandedRow(expandedRow === row._rowIndex ? null : row._rowIndex)}
                    className="p-1 text-espresso-700 hover:text-espresso-900"
                  >
                    {expandedRow === row._rowIndex ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Expanded edit form */}
                {expandedRow === row._rowIndex && (
                  <div className="border-t border-cream-200 px-4 py-4 bg-cream-50">
                    <p className="font-body text-xs text-espresso-700 uppercase tracking-wide mb-3">Modifier avant import</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-body mb-1 block">Nom *</label>
                        <input className="input-field py-2 text-sm" value={row.name} onChange={e => updateRow(row._rowIndex, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-body mb-1 block">Marque</label>
                        <input className="input-field py-2 text-sm" value={row.brand} onChange={e => updateRow(row._rowIndex, 'brand', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-body mb-1 block">Catégorie</label>
                        <input className="input-field py-2 text-sm" value={row.category} onChange={e => updateRow(row._rowIndex, 'category', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-body mb-1 block">Prix unité (DZD)</label>
                        <input type="number" className="input-field py-2 text-sm" value={row.price_unit} onChange={e => updateRow(row._rowIndex, 'price_unit', +e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-body mb-1 block">Prix boîte (DZD)</label>
                        <input type="number" className="input-field py-2 text-sm" value={row.price_box} onChange={e => updateRow(row._rowIndex, 'price_box', +e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-body mb-1 block">Stock</label>
                        <input type="number" className="input-field py-2 text-sm" value={row.stock} onChange={e => updateRow(row._rowIndex, 'stock', +e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-body mb-1 block">Unités/boîte</label>
                        <input type="number" className="input-field py-2 text-sm" value={row.units_per_box} onChange={e => updateRow(row._rowIndex, 'units_per_box', +e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-body mb-1 block">Min. commande</label>
                        <input type="number" className="input-field py-2 text-sm" value={row.min_units} onChange={e => updateRow(row._rowIndex, 'min_units', +e.target.value)} />
                      </div>
                      <div className="flex items-end gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-body">
                          <input type="checkbox" checked={row.active} onChange={e => updateRow(row._rowIndex, 'active', e.target.checked)} className="w-4 h-4" />
                          Actif
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-body">
                          <input type="checkbox" checked={row.featured} onChange={e => updateRow(row._rowIndex, 'featured', e.target.checked)} className="w-4 h-4" />
                          Vedette
                        </label>
                      </div>
                      <div className="col-span-2 md:col-span-3">
                        <label className="text-xs font-body mb-1 block">Description</label>
                        <textarea className="input-field py-2 text-sm resize-none" rows={2} value={row.description} onChange={e => updateRow(row._rowIndex, 'description', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
