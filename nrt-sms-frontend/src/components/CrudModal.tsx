import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from 'reactstrap';

interface Field {
  name: string;
  label: string;
  type?: 'text' | 'select' | 'textarea' | 'email' | 'password' | 'number';
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface CrudModalProps {
  isOpen: boolean;
  toggle: () => void;
  title: string;
  fields: Field[];
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
  onSave: () => Promise<void>;
  saving?: boolean;
  size?: string;
}

export default function CrudModal({ isOpen, toggle, title, fields, data, onChange, onSave, saving, size }: CrudModalProps) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size={size as any}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>
        {fields.map(f => (
          <div className="mb-2" key={f.name}>
            <label className="form-label">{f.label}</label>
            {f.type === 'select' ? (
              <select className="form-select" value={data[f.name] || ''} onChange={e => onChange(f.name, e.target.value)} required={f.required}>
                {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea className="form-control" rows={3} value={data[f.name] || ''} onChange={e => onChange(f.name, e.target.value)} required={f.required} />
            ) : (
              <input className="form-control" type={f.type || 'text'} value={data[f.name] || ''} onChange={e => onChange(f.name, e.target.value)} required={f.required} />
            )}
          </div>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
        <Button color="primary" onClick={onSave} disabled={saving}>
          {saving ? <Spinner size="sm" className="me-50" /> : null}
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  toggle: () => void;
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function ConfirmModal({ isOpen, toggle, title, message, onConfirm, loading }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody><p>{message}</p></ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
        <Button color="danger" onClick={onConfirm} disabled={loading}>
          {loading ? <Spinner size="sm" className="me-50" /> : null}
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}
