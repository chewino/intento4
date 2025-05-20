import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AttendanceStatCards } from '../components/AttendanceStatCards';
import { UsersRound, CalendarDays, ChevronRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  // Calculate overall stats
  const overallStats = {
    present: 0,
    absent: 0,
    justified: 0,
    total: 0,
  };

  state.attendanceRecords.forEach((record) => {
    record.records.forEach((r) => {
      if (r.status === 'present') overallStats.present++;
      else if (r.status === 'absent') overallStats.absent++;
      else if (r.status === 'justified') overallStats.justified++;
    });
  });

  overallStats.total = overallStats.present + overallStats.absent + overallStats.justified;

  // Get recent attendance dates (last 5)
  const recentDates = [...new Set(
    state.attendanceRecords.map(record => record.date)
  )]
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 5);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Panel Principal</h1>
        <button
          onClick={() => navigate('/attendance')}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Tomar Asistencia
        </button>
      </div>

      {state.groups.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <UsersRound className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">No hay grupos creados</h2>
          <p className="mt-2 text-sm text-gray-500">
            Comienza creando un grupo para registrar la asistencia.
          </p>
          <button
            onClick={() => navigate('/groups')}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Crear Grupo
          </button>
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Asistencia General</h2>
            <AttendanceStatCards {...overallStats} />
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Tus Grupos</h2>
                <button
                  onClick={() => navigate('/groups')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Ver todos <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-3">
                {state.groups.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay grupos creados</p>
                ) : (
                  state.groups.slice(0, 5).map(group => (
                    <div 
                      key={group.id}
                      className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{group.name}</p>
                        <p className="text-sm text-gray-500">{group.students.length} estudiantes</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Asistencia Reciente</h2>
                <button
                  onClick={() => navigate('/reports')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Ver todos <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-3">
                {recentDates.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarDays className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No hay registros de asistencia</p>
                  </div>
                ) : (
                  recentDates.map(date => {
                    // Find all records for this date
                    const recordsForDate = state.attendanceRecords.filter(r => r.date === date);
                    // Count total students processed on this date
                    const totalStudents = recordsForDate.reduce((sum, record) => sum + record.records.length, 0);
                    // Find the group names
                    const groupIds = [...new Set(recordsForDate.map(r => r.groupId))];
                    const groupNames = groupIds.map(id => {
                      const group = state.groups.find(g => g.id === id);
                      return group ? group.name : 'Grupo Desconocido';
                    });
                    
                    return (
                      <div 
                        key={date}
                        className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                        onClick={() => navigate(`/reports?date=${date}`)}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{formatDate(date)}</p>
                          <p className="text-sm text-gray-500">
                            {groupNames.join(', ')} - {totalStudents} estudiantes
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};