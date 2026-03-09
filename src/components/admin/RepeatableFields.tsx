import { Plus, Trash2, GripVertical } from 'lucide-react';

interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'url';
  placeholder?: string;
}

interface RepeatableFieldsProps {
  label: string;
  fields: FieldConfig[];
  value: Record<string, string>[];
  onChange: (value: Record<string, string>[]) => void;
}

const RepeatableFields = ({ label, fields, value, onChange }: RepeatableFieldsProps) => {
  const addRow = () => {
    const empty: Record<string, string> = {};
    fields.forEach((f) => (empty[f.key] = ''));
    onChange([...value, empty]);
  };

  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, key: string, val: string) => {
    const updated = value.map((row, i) => (i === index ? { ...row, [key]: val } : row));
    onChange(updated);
  };

  const inputClass =
    'w-full px-3 py-2 bg-muted/30 border border-border/40 rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-body text-xs text-muted-foreground">{label}</label>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary font-body text-xs rounded-md hover:bg-primary/20 transition-colors border border-primary/20"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {value.length === 0 && (
        <p className="font-body text-xs text-muted-foreground/50 italic py-3 text-center border border-dashed border-border/20 rounded-lg">
          No items yet. Click "Add" to get started.
        </p>
      )}

      <div className="space-y-2">
        {value.map((row, index) => (
          <div key={index} className="group flex gap-2 items-start p-3 bg-muted/15 rounded-lg border border-border/20 hover:border-border/40 transition-colors">
            <div className="pt-2 text-muted-foreground/30">
              <GripVertical className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(fields.length, 3)}, 1fr)` }}>
              {fields.map((field) => (
                <div key={field.key} className={fields.length > 3 ? '' : ''}>
                  <label className="font-body text-[10px] text-muted-foreground/60 mb-0.5 block">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className={inputClass + ' min-h-[60px] resize-none'}
                      value={row[field.key] || ''}
                      onChange={(e) => updateRow(index, field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type === 'url' ? 'url' : 'text'}
                      className={inputClass}
                      value={row[field.key] || ''}
                      onChange={(e) => updateRow(index, field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="pt-5 text-muted-foreground/40 hover:text-destructive transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepeatableFields;
