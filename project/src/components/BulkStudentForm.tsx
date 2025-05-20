import React, { useState } from 'react';

interface BulkStudentFormProps {
  onSubmit: (students: { name: string; email: string }[]) => void;
  onCancel: () => void;
}

export const BulkStudentForm: React.FC<BulkStudentFormProps> = ({ onSubmit, onCancel }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const lines = input
      .split(/[\n\r]+/)
      .map(line => line.trim())
      .filter(line => line);

    if (lines.length === 0) {
      setError('Por favor ingrese al menos un nombre de estudiante');
      return;
    }

    const students = lines.map(name => ({
      name,
      email: ''
    }));

    onSubmit(students);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="bulkInput" className="block text-sm font-medium text-gray-700 mb-1">
          Ingrese los Nombres de los Estudiantes
        </label>
        <p className="text-sm text-gray-500 mb-2">
          Copie y pegue su lista de estudiantes - un nombre por línea
        </p>
        <textarea
          id="bulkInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Juan Pérez&#13;&#10;María García&#13;&#10;Carlos López"
          rows={10}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border font-mono text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      <div className="flex justify-end space-x-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Importar Estudiantes
        </button>
      </div>
    </form>
  );
};