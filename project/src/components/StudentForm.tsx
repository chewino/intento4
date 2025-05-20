import React, { useState, useEffect } from 'react';
import { Student } from '../types';

interface StudentFormProps {
  onSubmit: (name: string, email: string) => void;
  onCancel: () => void;
  student?: Student;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, onCancel, student }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (student) {
      setName(student.name);
      setEmail(student.email || '');
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email);
  };

  const isEditing = !!student;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Estudiante*
        </label>
        <input
          type="text"
          id="studentName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
          placeholder="Ingrese el nombre del estudiante"
          required
        />
      </div>
      
      <div>
        <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico (opcional)
        </label>
        <input
          type="email"
          id="studentEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
          placeholder="Ingrese el correo electrónico"
        />
      </div>
      
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
          {isEditing ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
        </button>
      </div>
    </form>
  );
};